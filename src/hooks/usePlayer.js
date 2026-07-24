import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { shuffled } from "../lib/player/library";
import { clamp } from "../lib/player/format";
import { KEYS, readJSON, writeJSON } from "../lib/player/storage";

export const REPEAT_OFF = 0;
export const REPEAT_ALL = 1;
export const REPEAT_ONE = 2;

// Pressing previous this far into a track restarts it instead of stepping back,
// which is what every other player does and what fingers expect.
const RESTART_THRESHOLD_SECONDS = 3;
const HISTORY_LIMIT = 100;

const pushHistory = (state) =>
  state.currentId && state.currentId !== state.history.at(-1)
    ? [...state.history, state.currentId].slice(-HISTORY_LIMIT)
    : state.history;

const initialState = {
  currentId: null,
  isPlaying: false,
  shuffle: false,
  repeat: REPEAT_OFF,
  contextIds: [],   // the list playback was started from
  order: [],        // contextIds, shuffled when shuffle is on
  userQueue: [],    // ids explicitly queued by the user, played before order advances
  history: [],
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    // Starting playback captures the list it started from. Everything after
    // this navigates that captured context, so filtering the library or
    // switching to Favorites mid-song can no longer redirect the next track.
    case "play": {
      const ids = action.contextIds ?? state.contextIds;
      return {
        ...state,
        currentId: action.id,
        contextIds: ids,
        order: state.shuffle ? shuffled(ids, action.id) : ids,
        isPlaying: true,
        error: null,
        history: pushHistory(state),
      };
    }

    case "playQueued": {
      // Clicking the third thing in the queue consumes the two ahead of it.
      const id = state.userQueue[action.index];
      if (!id) return state;
      return {
        ...state,
        currentId: id,
        userQueue: state.userQueue.slice(action.index + 1),
        isPlaying: true,
        error: null,
        history: pushHistory(state),
      };
    }

    case "advance": {
      const { dir, auto } = action;
      const { order, currentId, repeat, userQueue, history } = state;

      if (dir > 0 && userQueue.length) {
        return {
          ...state,
          currentId: userQueue[0],
          userQueue: userQueue.slice(1),
          isPlaying: true,
          error: null,
          history: pushHistory(state),
        };
      }

      const i = order.indexOf(currentId);

      if (dir < 0) {
        if (history.length) {
          return {
            ...state,
            currentId: history.at(-1),
            history: history.slice(0, -1),
            isPlaying: true,
            error: null,
          };
        }
        const prevId = i > 0
          ? order[i - 1]
          : repeat === REPEAT_ALL ? order.at(-1) : null;
        return prevId ? { ...state, currentId: prevId, isPlaying: true, error: null } : state;
      }

      if (i >= 0 && i + 1 < order.length) {
        return { ...state, currentId: order[i + 1], isPlaying: true, error: null, history: pushHistory(state) };
      }

      // End of the list. Auto-advance honours repeat and otherwise stops;
      // an explicit press of next still wraps, since a dead button reads as broken.
      if (auto && repeat !== REPEAT_ALL) {
        return { ...state, isPlaying: false };
      }
      const nextOrder = state.shuffle ? shuffled(state.contextIds, null) : order;
      const firstId = nextOrder[0];
      if (!firstId) return { ...state, isPlaying: false };
      return {
        ...state,
        currentId: firstId,
        order: nextOrder,
        isPlaying: true,
        error: null,
        history: pushHistory(state),
      };
    }

    case "setPlaying":
      return state.isPlaying === action.value ? state : { ...state, isPlaying: action.value };

    case "toggleShuffle": {
      const shuffle = !state.shuffle;
      return {
        ...state,
        shuffle,
        order: shuffle ? shuffled(state.contextIds, state.currentId) : state.contextIds,
      };
    }

    case "cycleRepeat":
      return { ...state, repeat: (state.repeat + 1) % 3 };

    case "enqueue":
      return {
        ...state,
        userQueue: action.next
          ? [...action.ids, ...state.userQueue]
          : [...state.userQueue, ...action.ids],
      };

    case "removeQueued":
      return { ...state, userQueue: state.userQueue.filter((_, i) => i !== action.index) };

    case "moveQueued": {
      const next = state.userQueue.slice();
      const [moved] = next.splice(action.from, 1);
      if (moved === undefined) return state;
      next.splice(action.to, 0, moved);
      return { ...state, userQueue: next };
    }

    case "clearQueue":
      return state.userQueue.length ? { ...state, userQueue: [] } : state;

    case "error":
      return { ...state, error: action.message, isPlaying: false };

    case "dismissError":
      return state.error ? { ...state, error: null } : state;

    case "restore":
      return { ...state, ...action.state, isPlaying: false, error: null };

    default:
      return state;
  }
}

/**
 * Owns the audio element and every decision about what plays next.
 *
 * Playback position deliberately does not live in React state: it is published
 * through `subscribeTime` so the progress bar and clock can write to the DOM
 * directly. Putting it in state re-rendered the whole library four times a
 * second for a bar that is 4px tall.
 */
export function usePlayer(songs) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [duration, setDuration] = useState(0);

  const [settings, setSettings] = useState(() => ({
    volume: 0.7,
    muted: false,
    rate: 1.0,
    ...readJSON(KEYS.settings, {}),
  }));

  // The element lives here rather than in JSX. Nothing about it is rendered,
  // so keeping it out of the tree spares every consumer from threading a ref
  // through their markup just to give the player somewhere to put its audio.
  const [audio] = useState(() => {
    if (typeof Audio === 'undefined') return null;
    const el = new Audio();
    el.preload = 'metadata';
    return el;
  });
  const timeRef = useRef(0);
  const listenersRef = useRef(new Set());
  const pendingSeekRef = useRef(null);
  const restoredRef = useRef(false);

  // Audio event handlers are attached once and read live state through this ref.
  // Re-subscribing on every change used to leave `ended` holding whatever
  // shuffle and repeat were set to when the track started.
  const stateRef = useRef(state);
  stateRef.current = state;

  const byId = useMemo(() => new Map(songs.map(s => [s.id, s])), [songs]);
  const currentSong = state.currentId ? byId.get(state.currentId) ?? null : null;

  // --- time publishing -------------------------------------------------------

  const subscribeTime = useCallback((fn) => {
    listenersRef.current.add(fn);
    if (audio) fn(audio.currentTime, audio.duration);
    return () => { listenersRef.current.delete(fn); };
  }, [audio]);

  const emitTime = useCallback(() => {
    if (!audio) return;
    timeRef.current = audio.currentTime;
    for (const fn of listenersRef.current) fn(audio.currentTime, audio.duration);
  }, [audio]);

  useEffect(() => {
    if (!state.isPlaying) return;
    let raf = requestAnimationFrame(function tick() {
      emitTime();
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [state.isPlaying, emitTime]);

  // --- web audio graph (visualizer) -----------------------------------------

  // Created lazily and stashed on the element itself, because a second
  // createMediaElementSource for the same element throws — the graph has to
  // outlive anything that might run twice.
  const ensureAnalyser = useCallback(() => {
    if (!audio) return null;
    if (audio.__vaGraph) return audio.__vaGraph.analyser;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.78;
      ctx.createMediaElementSource(audio).connect(analyser);
      analyser.connect(ctx.destination);
      audio.__vaGraph = { ctx, analyser };
      return analyser;
    } catch {
      return null;
    }
  }, [audio]);

  const getAnalyser = useCallback(() => audio?.__vaGraph?.analyser ?? null, [audio]);

  // Routing through an AudioContext silences playback while that context is
  // suspended, which is its default state until a gesture resumes it.
  const resumeContext = useCallback(() => {
    const ctx = audio?.__vaGraph?.ctx;
    if (ctx?.state === "suspended") ctx.resume().catch(() => {});
  }, [audio]);

  // --- element wiring --------------------------------------------------------

  // An element that keeps a src keeps its buffered data alive, so tear both
  // down when the player goes away.
  useEffect(() => () => {
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }, [audio]);

  // Swap the source only when the track actually changes, so re-renders and
  // volume changes never restart playback.
  useEffect(() => {
    if (!audio) return;
    if (!currentSong) {
      audio.removeAttribute("src");
      audio.load();
      setDuration(0);
      return;
    }
    if (audio.dataset.trackId === currentSong.id) return;
    audio.dataset.trackId = currentSong.id;
    audio.src = currentSong.url;
    // Show the length we already know from the manifest rather than 0:00 while
    // the element loads its own metadata.
    setDuration(currentSong.duration || 0);
    timeRef.current = 0;
    emitTime();
  }, [audio, currentSong, emitTime]);

  useEffect(() => {
    if (!audio || !currentSong) return;
    if (state.isPlaying) {
      resumeContext();
      audio.play().catch(err => {
        // AbortError just means a newer src replaced this one mid-play.
        if (err.name === "AbortError") return;
        dispatch({
          type: "error",
          message: err.name === "NotAllowedError"
            ? "Playback needs a click first — your browser blocked autoplay."
            : `Could not play “${currentSong.title}”.`,
        });
      });
    } else {
      audio.pause();
    }
  }, [audio, state.isPlaying, currentSong, resumeContext]);

  useEffect(() => {
    if (audio) audio.volume = settings.muted ? 0 : settings.volume;
  }, [audio, settings.volume, settings.muted]);

  useEffect(() => {
    if (!audio) return;
    audio.playbackRate = settings.rate;
    // Deliberately off: pitch shifting with speed is the point here.
    audio.preservesPitch = false;
    audio.mozPreservesPitch = false;
    audio.webkitPreservesPitch = false;
  }, [audio, settings.rate, currentSong]);

  useEffect(() => {
    if (!audio) return;

    const onLoaded = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
      const seek = pendingSeekRef.current;
      if (seek != null) {
        pendingSeekRef.current = null;
        audio.currentTime = clamp(seek, 0, audio.duration || seek);
      }
      emitTime();
    };

    const onEnded = () => {
      // Repeat-one restarts here rather than through the reducer so it never
      // touches history or the queue.
      if (stateRef.current.repeat === REPEAT_ONE) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      dispatch({ type: "advance", dir: 1, auto: true });
    };

    const onError = () => {
      const title = stateRef.current.currentId
        ? "This track could not be loaded."
        : "Playback failed.";
      dispatch({ type: "error", message: title });
    };

    const onPlay = () => dispatch({ type: "setPlaying", value: true });
    const onPause = () => dispatch({ type: "setPlaying", value: false });

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("timeupdate", emitTime);
    audio.addEventListener("seeked", emitTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("timeupdate", emitTime);
      audio.removeEventListener("seeked", emitTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [audio, emitTime]);

  // --- actions ---------------------------------------------------------------

  const play = useCallback((song, contextSongs) => {
    if (!song) return;
    ensureAnalyser();
    resumeContext();
    dispatch({
      type: "play",
      id: song.id,
      contextIds: contextSongs?.length ? contextSongs.map(s => s.id) : undefined,
    });
  }, [ensureAnalyser, resumeContext]);

  const toggle = useCallback(() => {
    if (!stateRef.current.currentId) return;
    ensureAnalyser();
    resumeContext();
    dispatch({ type: "setPlaying", value: !stateRef.current.isPlaying });
  }, [ensureAnalyser, resumeContext]);

  const next = useCallback(() => dispatch({ type: "advance", dir: 1, auto: false }), []);

  const prev = useCallback(() => {
    if (audio && audio.currentTime > RESTART_THRESHOLD_SECONDS) {
      audio.currentTime = 0;
      emitTime();
      return;
    }
    dispatch({ type: "advance", dir: -1, auto: false });
  }, [audio, emitTime]);

  const seek = useCallback((seconds) => {
    if (!audio) return;
    const total = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : duration;
    if (!total) return;
    audio.currentTime = clamp(seconds, 0, total);
    emitTime();
  }, [audio, duration, emitTime]);

  const seekBy = useCallback((delta) => {
    if (audio) seek(audio.currentTime + delta);
  }, [audio, seek]);

  const updateSettings = useCallback((patch) => setSettings(prev => ({ ...prev, ...patch })), []);

  const setVolume = useCallback((v) => updateSettings({ volume: clamp(v, 0, 1), muted: false }), [updateSettings]);
  const toggleMute = useCallback(() => setSettings(prev => ({ ...prev, muted: !prev.muted })), []);
  const setRate = useCallback((rate) => updateSettings({ rate }), [updateSettings]);
  const nudgeVolume = useCallback((delta) => setSettings(prev => ({
    ...prev, volume: clamp(prev.volume + delta, 0, 1), muted: false,
  })), []);

  const toggleShuffle = useCallback(() => dispatch({ type: "toggleShuffle" }), []);
  const cycleRepeat = useCallback(() => dispatch({ type: "cycleRepeat" }), []);

  const enqueue = useCallback((songsToAdd, { next: playNext = false } = {}) => {
    const ids = (Array.isArray(songsToAdd) ? songsToAdd : [songsToAdd]).map(s => s.id);
    if (ids.length) dispatch({ type: "enqueue", ids, next: playNext });
  }, []);

  const playQueued = useCallback((index) => {
    ensureAnalyser();
    resumeContext();
    dispatch({ type: "playQueued", index });
  }, [ensureAnalyser, resumeContext]);

  const removeQueued = useCallback((index) => dispatch({ type: "removeQueued", index }), []);
  const moveQueued = useCallback((from, to) => dispatch({ type: "moveQueued", from, to }), []);
  const clearQueue = useCallback(() => dispatch({ type: "clearQueue" }), []);
  const dismissError = useCallback(() => dispatch({ type: "dismissError" }), []);

  // --- persistence -----------------------------------------------------------

  useEffect(() => { writeJSON(KEYS.settings, settings); }, [settings]);

  // Restore the last session once the library is available, paused and parked
  // at wherever the user left off.
  useEffect(() => {
    if (restoredRef.current || !songs.length) return;
    restoredRef.current = true;
    const saved = readJSON(KEYS.session, null);
    if (!saved?.currentId || !songs.some(s => s.id === saved.currentId)) return;
    const known = new Set(songs.map(s => s.id));
    pendingSeekRef.current = saved.time || 0;
    dispatch({
      type: "restore",
      state: {
        currentId: saved.currentId,
        shuffle: !!saved.shuffle,
        repeat: saved.repeat ?? REPEAT_OFF,
        contextIds: saved.contextIds?.filter(id => known.has(id)) ?? [],
        order: saved.order?.filter(id => known.has(id)) ?? [],
        userQueue: saved.userQueue?.filter(id => known.has(id)) ?? [],
      },
    });
  }, [songs]);

  // Uploaded blob URLs die with the page, so they are never worth restoring.
  useEffect(() => {
    const save = () => {
      if (!stateRef.current.currentId) return;
      const persistable = (ids) => ids.filter(id => !byId.get(id)?.isUpload);
      const song = byId.get(stateRef.current.currentId);
      writeJSON(KEYS.session, {
        currentId: song?.isUpload ? null : stateRef.current.currentId,
        time: timeRef.current,
        shuffle: stateRef.current.shuffle,
        repeat: stateRef.current.repeat,
        contextIds: persistable(stateRef.current.contextIds),
        order: persistable(stateRef.current.order),
        userQueue: persistable(stateRef.current.userQueue),
      });
    };
    const interval = setInterval(save, 5000);
    window.addEventListener("pagehide", save);
    return () => { clearInterval(interval); window.removeEventListener("pagehide", save); save(); };
  }, [byId]);

  // --- derived ---------------------------------------------------------------

  // What actually plays next: everything explicitly queued, then the remainder
  // of the current context.
  const upNext = useMemo(() => {
    const queued = state.userQueue.map(id => byId.get(id)).filter(Boolean);
    const i = state.order.indexOf(state.currentId);
    const rest = i >= 0
      ? state.order.slice(i + 1)
      : state.order;
    const tail = (state.repeat === REPEAT_ALL && i >= 0
      ? [...rest, ...state.order.slice(0, i)]
      : rest
    ).map(id => byId.get(id)).filter(Boolean);
    return { queued, tail };
  }, [state.userQueue, state.order, state.currentId, state.repeat, byId]);

  return {
    currentSong,
    duration,
    isPlaying: state.isPlaying,
    shuffle: state.shuffle,
    repeat: state.repeat,
    error: state.error,
    userQueue: upNext.queued,
    upNext: upNext.tail,
    volume: settings.volume,
    muted: settings.muted,
    rate: settings.rate,
    play, toggle, next, prev, seek, seekBy,
    setVolume, nudgeVolume, toggleMute, setRate,
    toggleShuffle, cycleRepeat,
    enqueue, playQueued, removeQueued, moveQueued, clearQueue,
    dismissError, subscribeTime, ensureAnalyser, getAnalyser,
  };
}
