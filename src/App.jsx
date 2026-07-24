import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ACCENT, ACCENT_DEEP, ACCENT_HOVER, BG_MAIN, BG_PANEL, BG_VIDEO_PATH, BORDER,
  HOME_TIPS, MINI_PLAYER_BREAKPOINT, SEEK_STEP_SECONDS, TEXT, TEXT_DIM, TEXT_MUTED,
  TIP_DURATION_SECONDS,
} from "./lib/player/config";
import { LIBRARY_SONGS, migrateLegacyIds, searchSongs } from "./lib/player/library";
import { KEYS, readJSON, writeJSON } from "./lib/player/storage";
import { usePlayer } from "./hooks/usePlayer";
import { useMediaSession } from "./hooks/useMediaSession";
import { usePlaylists } from "./hooks/usePlaylists";
import { useUploads } from "./hooks/useUploads";
import Icon from "./components/player/Icon";
import LogoIcon from "./components/player/LogoIcon";
import NowPlayingBar from "./components/player/NowPlayingBar";
import QueuePanel from "./components/player/QueuePanel";
import Sidebar from "./components/player/Sidebar";
import TrackList from "./components/player/TrackList";
import Visualizer from "./components/player/Visualizer";
import "./styles/player.css";

const THEME_VARS = {
  "--accent": ACCENT,
  "--accent-hover": ACCENT_HOVER,
  "--accent-deep": ACCENT_DEEP,
  "--bg-main": BG_MAIN,
  "--bg-panel": BG_PANEL,
  "--border": BORDER,
  "--text": TEXT,
  "--text-dim": TEXT_DIM,
  "--text-muted": TEXT_MUTED,
};

export default function MusicPlayer() {
  const [view, setView] = useState({ type: "home" });
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showQueue, setShowQueue] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(() => readJSON("va-visualizer", true));
  const [dragOver, setDragOver] = useState(false);

  const [liked, setLiked] = useState(() => {
    // Runs before the first read so likes saved under the old positional ids
    // are carried over rather than silently pointing at the wrong tracks.
    migrateLegacyIds();
    const saved = readJSON(KEYS.liked, []);
    return new Set(Array.isArray(saved) ? saved : []);
  });

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const uploads = useUploads();
  const playlists = usePlaylists();

  const allSongs = useMemo(() => [...LIBRARY_SONGS, ...uploads.songs], [uploads.songs]);
  const player = usePlayer(allSongs);
  useMediaSession(player);

  // --- what the current view shows ------------------------------------------

  const activePlaylist = view.type === "playlist"
    ? playlists.playlists.find(p => p.id === view.id) ?? null
    : null;

  const visibleSongs = useMemo(() => {
    switch (view.type) {
      case "search": return searchSongs(allSongs, searchQuery);
      case "favorites": return allSongs.filter(s => liked.has(s.id));
      case "upload": return uploads.songs;
      case "playlist": {
        if (!activePlaylist) return [];
        const byId = new Map(allSongs.map(s => [s.id, s]));
        return activePlaylist.songIds.map(id => byId.get(id)).filter(Boolean);
      }
      default: return allSongs;
    }
  }, [view.type, allSongs, searchQuery, liked, uploads.songs, activePlaylist]);

  // Read by the stable action callbacks below, so changing views doesn't
  // rebuild every row's props.
  const visibleRef = useRef(visibleSongs);
  // Just the two facts the stable callbacks below need to consult, kept as
  // plain values so those callbacks don't have to depend on the player object.
  const latestRef = useRef({ shuffle: false, hasTrack: false });
  useEffect(() => {
    visibleRef.current = visibleSongs;
    latestRef.current = { shuffle: player.shuffle, hasTrack: !!player.currentSong };
  });

  // --- actions ---------------------------------------------------------------

  const { play, toggle, enqueue, toggleShuffle } = player;
  const { addSongs: addToPlaylist, removeSong: removePlaylistSong, create: createPlaylist } = playlists;
  const { remove: removeUpload } = uploads;

  const toggleLike = useCallback((id) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => { writeJSON(KEYS.liked, [...liked]); }, [liked]);
  useEffect(() => { writeJSON("va-visualizer", showVisualizer); }, [showVisualizer]);

  const rowActions = useMemo(() => ({
    play: (song) => play(song, visibleRef.current),
    toggle,
    toggleLike,
    playNext: (song) => enqueue(song, { next: true }),
    addToQueue: (song) => enqueue(song),
    addToPlaylist,
    removeFromPlaylist: (playlistId, song) => removePlaylistSong(playlistId, song.id),
    removeUpload: (song) => removeUpload(song.id),
    newPlaylistWith: (song) => {
      const name = window.prompt("Name this playlist", `${song.artist} mix`);
      if (name !== null) createPlaylist(name, [song]);
    },
  }), [play, toggle, toggleLike, enqueue, addToPlaylist, removePlaylistSong, removeUpload, createPlaylist]);

  const playAll = useCallback(() => {
    const list = visibleRef.current;
    if (list.length) play(list[0], list);
  }, [play]);

  const shuffleAll = useCallback(() => {
    const list = visibleRef.current;
    if (!list.length) return;
    if (!latestRef.current.shuffle) toggleShuffle();
    play(list[Math.floor(Math.random() * list.length)], list);
  }, [play, toggleShuffle]);

  // --- uploads ---------------------------------------------------------------

  const { add: addUploads } = uploads;

  const handleFiles = useCallback(async (files) => {
    const added = await addUploads(files);
    if (added.length) {
      setView({ type: "upload" });
      // Only take over playback if nothing is already going.
      if (!latestRef.current.hasTrack) play(added[0], added);
    }
  }, [addUploads, play]);

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); };
  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false); };

  // --- mini player -----------------------------------------------------------

  // Narrow windows collapse the player automatically, but an explicit choice
  // sticks until the window actually crosses the breakpoint again — the old
  // observer overwrote the button on every resize event.
  const [narrow, setNarrow] = useState(false);
  const [miniOverride, setMiniOverride] = useState(null);
  const miniPlayer = miniOverride ?? narrow;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const isNarrow = entry.contentRect.width < MINI_PLAYER_BREAKPOINT;
      setNarrow(prev => {
        if (prev !== isNarrow) setMiniOverride(null);
        return isNarrow;
      });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // --- keyboard shortcuts ----------------------------------------------------

  useEffect(() => {
    const handler = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      if (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        if (e.key === "Escape") target.blur();
        return;
      }
      // Space and the arrows already mean something on a focused control.
      const onControl = target.closest?.('button, [role="slider"], a');

      switch (e.key) {
        case " ":
          if (onControl) return;
          e.preventDefault();
          player.toggle();
          break;
        case "ArrowRight":
          if (onControl) return;
          e.preventDefault();
          player.seekBy(SEEK_STEP_SECONDS);
          break;
        case "ArrowLeft":
          if (onControl) return;
          e.preventDefault();
          player.seekBy(-SEEK_STEP_SECONDS);
          break;
        case "ArrowUp": e.preventDefault(); player.nudgeVolume(0.05); break;
        case "ArrowDown": e.preventDefault(); player.nudgeVolume(-0.05); break;
        case "n": player.next(); break;
        case "p": player.prev(); break;
        case "m": player.toggleMute(); break;
        case "s": player.toggleShuffle(); break;
        case "r": player.cycleRepeat(); break;
        case "l": if (player.currentSong) toggleLike(player.currentSong.id); break;
        case "/":
          e.preventDefault();
          setView({ type: "search" });
          searchInputRef.current?.focus();
          break;
        default: break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [player, toggleLike]);

  // --- home tips -------------------------------------------------------------

  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  useEffect(() => {
    if (HOME_TIPS.length <= 1) return;
    let fade;
    const interval = setInterval(() => {
      setTipVisible(false);
      fade = setTimeout(() => {
        setTipIndex(prev => (prev + 1) % HOME_TIPS.length);
        setTipVisible(true);
      }, 500);
    }, TIP_DURATION_SECONDS * 1000);
    return () => { clearInterval(interval); clearTimeout(fade); };
  }, []);

  // --- render ----------------------------------------------------------------

  const listTitle = {
    library: "Library",
    search: searchQuery ? `Results for “${searchQuery}”` : "Search",
    favorites: "Favorites",
    upload: "Uploaded",
    playlist: activePlaylist?.name ?? "Playlist",
  }[view.type] ?? "Library";

  const emptyMessage = {
    search: searchQuery ? "Nothing matched that." : "Type above to search your library.",
    favorites: "No favorites yet — tap the heart on any track.",
    upload: "Nothing uploaded yet. Drop audio files anywhere in the window.",
    playlist: "This playlist is empty. Add tracks from a row's menu.",
  }[view.type] ?? "No tracks found in public/music/.";

  const showList = view.type !== "home";

  return (
    <div
      ref={containerRef}
      className="va-player"
      style={THEME_VARS}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >

      {dragOver && (
        <div className="drop-overlay">
          <Icon name="upload" size={48} />
          <span style={{ fontSize: 18, fontWeight: 600 }}>Drop audio files here</span>
        </div>
      )}

      {player.error && (
        <div className="error-toast" role="alert">
          <Icon name="alert" size={16} />
          <span style={{ flex: 1 }}>{player.error}</span>
          <button className="ctrl-btn" onClick={player.dismissError} aria-label="Dismiss error">
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <div style={{ display: miniPlayer ? "none" : "flex", flex: 1, overflow: "hidden" }}>
        {sidebarOpen && (
          <Sidebar
            view={view}
            onSelectView={setView}
            playlists={playlists.playlists}
            uploadCount={uploads.songs.length}
            onCreatePlaylist={(name) => {
              const created = playlists.create(name);
              setView({ type: "playlist", id: created.id });
            }}
            onDeletePlaylist={(id, name) => {
              if (!window.confirm(`Delete the playlist “${name}”? The tracks themselves stay put.`)) return;
              playlists.remove(id);
              setView(v => (v.type === "playlist" && v.id === id ? { type: "library" } : v));
            }}
          />
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <div style={{
            padding: "12px 24px", display: "flex", alignItems: "center", gap: 12,
            borderBottom: `1px solid ${BORDER}`,
          }}>
            <button
              className="ctrl-btn"
              onClick={() => setSidebarOpen(o => !o)}
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <Icon name="list" size={20} />
            </button>

            <div style={{ flex: 1, maxWidth: 480, display: "flex", alignItems: "center", gap: 4, color: TEXT_DIM }}>
              <Icon name="search" size={16} />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search songs or artists…"
                aria-label="Search songs or artists"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setView({ type: "search" }); }}
                onFocus={() => setView({ type: "search" })}
                style={{
                  background: "transparent", border: "none", outline: "none", color: TEXT,
                  fontSize: 14, padding: "8px 10px", flex: 1, fontFamily: "inherit", minWidth: 0,
                }}
              />
              {searchQuery && (
                <button className="ctrl-btn" onClick={() => setSearchQuery("")} aria-label="Clear search">
                  <Icon name="close" size={14} />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              style={{ display: "none" }}
              onChange={e => { handleFiles(e.target.files); e.target.value = ""; }}
            />
            <button
              className="pill-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="upload" size={14} /> Upload
            </button>
          </div>

          <div style={{ flex: 1, display: "flex", overflow: "hidden", minWidth: 0 }}>
            <div style={{ flex: 1, position: "relative", overflow: "hidden", minWidth: 0 }}>
              {/* Home stays mounted so the background video keeps its buffer. */}
              <div
                aria-hidden={showList}
                style={{
                  position: "absolute", inset: 0, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: showList ? 0 : 1,
                  visibility: showList ? "hidden" : "visible",
                  transition: "opacity 0.6s ease",
                }}
              >
                {BG_VIDEO_PATH ? (
                  <video
                    src={BG_VIDEO_PATH} autoPlay loop muted playsInline
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(135deg, ${BG_MAIN} 0%, #1a0e3a 30%, #120a2a 50%, #1e1040 70%, ${BG_MAIN} 100%)`,
                    backgroundSize: "400% 400%", animation: "gradientShift 12s ease infinite",
                  }} />
                )}
                {BG_VIDEO_PATH && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(ellipse at center, ${BG_MAIN}66 0%, ${BG_MAIN}cc 70%, ${BG_MAIN}ee 100%)`,
                  }} />
                )}

                <div style={{
                  position: "relative", textAlign: "center", padding: 24,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
                }}>
                  <LogoIcon size={88} radius={22} />
                  <h1 style={{
                    fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 700, color: "#fff",
                    letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0,
                    textShadow: "0 0 10px #000000cc, 0 0 30px #000000aa, 0 2px 4px #000000ee",
                  }}>
                    Violet Aegis
                  </h1>
                  <div style={{ minHeight: 78, maxWidth: 420, display: "flex", alignItems: "center" }}>
                    <p style={{
                      fontSize: 16, color: "#d4d0e0", lineHeight: 1.6, margin: 0,
                      textShadow: "0 0 8px #000000cc, 0 1px 3px #000000ee",
                      opacity: tipVisible ? 1 : 0, transition: "opacity 0.5s ease-in-out",
                    }}>
                      {HOME_TIPS[tipIndex]}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                    <button className="primary-btn" onClick={() => setView({ type: "library" })}>
                      Browse Library
                    </button>
                    <button
                      className="pill-btn"
                      onClick={() => {
                        setView({ type: "library" });
                        if (!player.shuffle) toggleShuffle();
                        play(LIBRARY_SONGS[Math.floor(Math.random() * LIBRARY_SONGS.length)], LIBRARY_SONGS);
                      }}
                      disabled={!LIBRARY_SONGS.length}
                      style={{ padding: "12px 22px", fontSize: 14 }}
                    >
                      <Icon name="shuffle" size={14} /> Shuffle everything
                    </button>
                  </div>
                </div>
              </div>

              {showList && (
                <div style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
                  {view.type === "upload" && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "28px 24px 4px" }}>
                      <button className="drop-zone" onClick={() => fileInputRef.current?.click()}>
                        <Icon name="upload" size={40} />
                        <span style={{ fontSize: 15, fontWeight: 500 }}>Click or drag files</span>
                        <span style={{ fontSize: 12 }}>MP3, WAV, FLAC, OGG, Opus, M4A</span>
                      </button>
                    </div>
                  )}
                  <TrackList
                    title={listTitle}
                    songs={visibleSongs}
                    currentId={player.currentSong?.id ?? null}
                    isPlaying={player.isPlaying}
                    liked={liked}
                    actions={rowActions}
                    playlists={playlists.playlists}
                    inPlaylistId={activePlaylist?.id ?? null}
                    subscribeTime={player.subscribeTime}
                    duration={player.duration}
                    emptyMessage={emptyMessage}
                    onPlayAll={playAll}
                    onShuffleAll={shuffleAll}
                  />
                </div>
              )}
            </div>

            {showQueue && (
              <QueuePanel
                userQueue={player.userQueue}
                upNext={player.upNext}
                onPlayQueued={player.playQueued}
                onRemoveQueued={player.removeQueued}
                onMoveQueued={player.moveQueued}
                onClearQueue={player.clearQueue}
                onPlaySong={(song) => play(song)}
                onClose={() => setShowQueue(false)}
              />
            )}
          </div>
        </div>
      </div>

      <Visualizer
        active={showVisualizer}
        isPlaying={player.isPlaying}
        ensureAnalyser={player.ensureAnalyser}
        getAnalyser={player.getAnalyser}
        height={miniPlayer ? 44 : 56}
      />

      <NowPlayingBar
        player={player}
        isLiked={player.currentSong ? liked.has(player.currentSong.id) : false}
        onToggleLike={toggleLike}
        miniPlayer={miniPlayer}
        onToggleMini={() => setMiniOverride(!miniPlayer)}
        showVisualizer={showVisualizer}
        onToggleVisualizer={() => setShowVisualizer(v => !v)}
        showQueue={showQueue}
        onToggleQueue={() => setShowQueue(q => !q)}
      />
    </div>
  );
}
