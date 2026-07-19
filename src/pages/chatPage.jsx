import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { MessageCircle, Play, RotateCcw, StepForward, Eye, Sparkles, ArrowLeft, ImagePlus } from "lucide-react";
import InlineText from "../components/InlineText.jsx";
import FloatingParticles from "../components/FloatingParticles.jsx";
import LockScreen from "../components/LockScreen.jsx";
import useSessionAuth from "../hooks/useSessionAuth.js";
import { resolveSpeaker } from "../lib/speakers.js";
import { parseChatScript, scriptSpeakers } from "../lib/chatScript.js";
import { loadJSON, saveJSON } from "../lib/storyStorage.js";

const STORAGE_KEY = "chat_studio_state";
const IMAGES_KEY = "chat_studio_images";
const SPEED_MULT = { slow: 1.7, normal: 1, fast: 0.45 };

const STATUS_PRESETS = [
  ["#34d399", "Online"],
  ["#fbbf24", "Idle"],
  ["#f87171", "Busy"],
  ["#a8a29e", "Offline"],
  ["#a78bfa", "Arcane"],
];

// Uploaded images are downscaled before hitting localStorage (a few MB quota).
async function fileToDataUrl(file, maxDim = 512) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.85);
  } catch {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

const DEFAULT_SCRIPT = `> Late night, somewhere above the clouds

Sentinel: you awake?
Astral: always am when you text me at 3am
Sentinel (soft): couldn't sleep. the void's been noisy again
Astral: want me to come up to the observation deck?

??? yes please | I'll be fine | don't bother

Astral [photo]: /images/astral.png
Astral: too late, already on my way
> Sentinel smiles at her screen
Sentinel: **dork.** see you in five
Sentinel [sticker]: sentinel`;

const DEFAULTS = {
  chatName: "Astral Anemos",
  subtitle: "online · the Astral Spire",
  pov: "Sentinel",
  speed: "normal",
  clockStart: "03:12",
  statusColor: "#34d399",
  avatar: "",
  showTimestamps: true,
  showReceipts: true,
  sound: true,
  script: DEFAULT_SCRIPT,
};

const THEME_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  * { font-family: 'Crimson Text', serif; }
  h1, h2, h3, h4, h5, h6 { font-family: 'Cinzel', serif; }
  @keyframes float {
    0%, 100% { transform: translateY(0px); opacity: 0.3; }
    50% { transform: translateY(-20px); opacity: 0.6; }
  }
  @keyframes chat-dot {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
    30% { transform: translateY(-4px); opacity: 1; }
  }
  @keyframes msg-in {
    from { opacity: 0; transform: translateY(6px) scale(0.98); }
    to { opacity: 1; transform: none; }
  }
  .msg-in { animation: msg-in 0.25s ease-out; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #1c1917; }
  ::-webkit-scrollbar-thumb { background: #4800b4; border-radius: 4px; }
`;

const samePerson = (a, b) => a?.trim().toLowerCase() === b?.trim().toLowerCase();

function Portrait({ speaker, size = "w-8 h-8" }) {
  if (speaker.image) {
    return (
      <img
        src={speaker.image}
        alt=""
        className={`${size} rounded-full object-cover flex-shrink-0 border-2`}
        style={{ borderColor: `${speaker.color}99` }}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-full flex-shrink-0 border-2 flex items-center justify-center font-bold bg-stone-900`}
      style={{ borderColor: `${speaker.color}99`, color: speaker.color }}
    >
      {speaker.name.charAt(0).toUpperCase()}
    </div>
  );
}

// Rendered with key={src} so a new url resets the broken flag via remount.
function PhotoContent({ src }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return <div className="px-4 py-3 text-stone-500 italic text-sm">⚠ image not found: {src}</div>;
  }
  return <img src={src} alt="" onError={() => setBroken(true)} className="max-h-56 max-w-full object-cover" />;
}

function StickerContent({ src, text }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return <div className="text-stone-500 italic text-sm">⚠ sticker not found: {text}</div>;
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setBroken(true)}
      className="h-32 w-auto rounded-xl drop-shadow-[0_4px_14px_rgba(124,58,237,0.35)]"
    />
  );
}

const Meta = ({ children, right }) => (
  <span className={`text-[10px] text-stone-600 mt-0.5 ${right ? "text-right" : ""}`}>{children}</span>
);

function Bubble({ event, isPov, showHeader, meta, resolvePerson, resolveImage }) {
  const speaker = resolvePerson(event.speaker);
  const isSticker = event.media === "sticker";
  // uploaded library images win, then character portraits (stickers), then a raw url/path
  const mediaSrc =
    resolveImage(event.text) ??
    (isSticker && !event.text.includes("/") ? resolvePerson(event.text).image : null) ??
    event.text;
  const body =
    event.media === "photo" ? (
      <PhotoContent key={mediaSrc} src={mediaSrc} />
    ) : (
      <InlineText text={event.text} />
    );
  if (isPov) {
    return (
      <div className="msg-in flex flex-col items-end">
        {event.tone && <span className="text-xs italic text-stone-500 mb-0.5">({event.tone})</span>}
        {isSticker ? (
          <StickerContent key={mediaSrc} src={mediaSrc} text={event.text} />
        ) : (
          <div
            className={`bg-gradient-to-br from-violet-700 to-purple-800 text-violet-50 rounded-2xl rounded-br-sm w-fit max-w-[80%] leading-relaxed ${event.media ? "overflow-hidden p-0" : "px-4 py-2"}`}
          >
            {body}
          </div>
        )}
        {meta && <Meta right>{meta}</Meta>}
      </div>
    );
  }
  return (
    <div className="msg-in flex gap-2.5 items-end">
      <div className="w-8 flex-shrink-0">{showHeader && <Portrait speaker={speaker} />}</div>
      <div className="min-w-0 flex flex-col items-start max-w-[80%]">
        {showHeader && (
          <span className="text-xs font-semibold mb-0.5 flex items-baseline gap-1.5" style={{ color: speaker.color }}>
            {speaker.name}
            {event.tone && <span className="italic font-normal text-stone-500">({event.tone})</span>}
          </span>
        )}
        {!showHeader && event.tone && <span className="text-xs italic text-stone-500 mb-0.5">({event.tone})</span>}
        {isSticker ? (
          <StickerContent key={mediaSrc} src={mediaSrc} text={event.text} />
        ) : (
          <div
            className={`bg-stone-800/90 border rounded-2xl rounded-bl-sm text-stone-200 leading-relaxed w-fit max-w-full ${event.media ? "overflow-hidden p-0" : "px-4 py-2"}`}
            style={{ borderColor: `${speaker.color}59` }}
          >
            {body}
          </div>
        )}
        {meta && <Meta>{meta}</Meta>}
      </div>
    </div>
  );
}

function TypingBubble({ speakerName, resolvePerson }) {
  const speaker = resolvePerson(speakerName);
  return (
    <div className="msg-in flex gap-2.5 items-end">
      <Portrait speaker={speaker} />
      <div className="bg-stone-800/90 border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5" style={{ borderColor: `${speaker.color}59` }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-violet-300"
            style={{ animation: "chat-dot 1.1s ease-in-out infinite", animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-violet-500/70 text-xs tracking-widest uppercase mb-1.5">{label}</span>
    {children}
  </label>
);

const inputCls =
  "w-full px-3 py-2 bg-stone-800/80 border border-violet-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 placeholder-stone-500 text-stone-200 text-sm";

export default function ChatStudio() {
  const { isAuthenticated, login } = useSessionAuth();
  const [config, setConfig] = useState(() => ({ ...DEFAULTS, ...loadJSON(STORAGE_KEY, {}) }));
  const [shown, setShown] = useState(0);
  // each message plays in two phases: "gap" (a breather after the previous
  // bubble, no indicator) then "typing" (the ••• bubble), then it reveals
  const [phase, setPhase] = useState("gap");
  const [choices, setChoices] = useState({});
  const [playing, setPlaying] = useState(false);
  const scrollRef = useRef(null);
  const audioRef = useRef(null);

  const events = useMemo(() => parseChatScript(config.script), [config.script]);
  const speakers = useMemo(() => scriptSpeakers(events), [events]);

  // local image library — uploads live in the browser as downscaled data urls;
  // an image's name works anywhere a picture can appear, and an image named
  // after a speaker overrides their portrait
  const [images, setImages] = useState(() => loadJSON(IMAGES_KEY, []));
  const imgByName = useMemo(() => new Map(images.map((i) => [i.name.toLowerCase(), i.data])), [images]);
  const resolveImage = useCallback((name) => imgByName.get(name?.trim().toLowerCase()) ?? null, [imgByName]);
  const resolvePerson = useCallback(
    (name) => {
      const speaker = resolveSpeaker(name);
      const override = resolveImage(name);
      return override ? { ...speaker, image: override } : speaker;
    },
    [resolveImage]
  );

  const addImages = async (files) => {
    const added = [];
    for (const file of files) {
      const name = file.name.replace(/\.[^.]+$/, "").trim() || "image";
      try {
        added.push({ name, data: await fileToDataUrl(file) });
      } catch { /* unreadable file — skip it */ }
    }
    if (!added.length) return;
    setImages((prev) => {
      const replaced = new Set(added.map((a) => a.name.toLowerCase()));
      const next = [...prev.filter((i) => !replaced.has(i.name.toLowerCase())), ...added];
      saveJSON(IMAGES_KEY, next);
      return next;
    });
  };

  const removeImage = (name) => {
    setImages((prev) => {
      const next = prev.filter((i) => i.name !== name);
      saveJSON(IMAGES_KEY, next);
      return next;
    });
  };

  const headerSpeaker = resolvePerson(config.chatName || "?");
  const headerImage = resolveImage(config.avatar) ?? headerSpeaker.image;

  // the ••• bubble is derived, not stored: it shows during the typing phase
  // of an incoming (non-POV) message
  const nextEvent = playing && shown < events.length ? events[shown] : null;
  const typingSpeaker =
    phase === "typing" && nextEvent?.kind === "message" && !samePerson(nextEvent.speaker, config.pov)
      ? nextEvent.speaker
      : null;

  // fake clock: starts at clockStart, each message advances it one minute
  const times = useMemo(() => {
    const [h, m] = (config.clockStart || "03:12").split(":").map(Number);
    let mins = (Number.isFinite(h) ? h : 3) * 60 + (Number.isFinite(m) ? m : 12);
    return events.map((e) => {
      if (e.kind !== "message" && e.kind !== "options") return null;
      const t = `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
      mins += 1;
      return t;
    });
  }, [events, config.clockStart]);

  // soft WebAudio pop on each revealed message — no asset needed
  const soundOn = config.sound;
  const pop = useCallback((outgoing) => {
    if (!soundOn) return;
    try {
      audioRef.current ??= new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = outgoing ? 700 : 540;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch { /* audio unavailable */ }
  }, [soundOn]);

  const resetPlayback = () => {
    setShown(0);
    setPhase("gap");
    setChoices({});
    setPlaying(false);
  };

  const set = (patch) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      saveJSON(STORAGE_KEY, next);
      return next;
    });
    // a changed script invalidates revealed indices — reset in the handler
    if ("script" in patch) resetPlayback();
  };

  // playback engine: gap → typing → reveal for each event
  useEffect(() => {
    if (!playing || shown >= events.length) return;
    const next = events[shown];
    if (next.kind === "options" && choices[shown] == null) return; // wait for a pick
    const mult = SPEED_MULT[config.speed] ?? 1;
    const isPov = next.kind === "message" && samePerson(next.speaker, config.pov);

    // breather after the previous bubble before anyone starts typing
    if (next.kind === "message" && phase === "gap") {
      const gap = (shown === 0 ? 200 : 1000) * mult;
      const timer = setTimeout(() => setPhase("typing"), gap);
      return () => clearTimeout(timer);
    }

    const duration =
      next.kind === "message"
        ? Math.min(500 + next.text.length * 30, 2600) * mult * (isPov || next.media ? 0.4 : 1)
        : 400 * mult;
    const timer = setTimeout(() => {
      if (next.kind === "message") pop(isPov);
      setShown((s) => s + 1);
      setPhase("gap");
      if (shown + 1 >= events.length) setPlaying(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [playing, shown, phase, events, choices, config.speed, config.pov, pop]);

  // keep the newest message in view
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [shown, typingSpeaker]);

  const restart = () => {
    setChoices({});
    setShown(0);
    setPlaying(true);
  };
  const step = () => {
    if (shown >= events.length) return;
    if (events[shown].kind === "options" && choices[shown] == null) return;
    setShown((s) => s + 1);
    setPhase("gap");
  };
  const showAll = () => {
    setPlaying(false);
    // unchosen option blocks default to their first option
    setChoices((prev) => {
      const next = { ...prev };
      events.forEach((e, i) => {
        if (e.kind === "options" && next[i] == null) next[i] = e.options[0];
      });
      return next;
    });
    setShown(events.length);
  };
  const pickOption = (index, option) => {
    setChoices((prev) => ({ ...prev, [index]: option }));
    setShown(index + 1);
    setPhase("gap");
    pop(true);
    if (index + 1 >= events.length) setPlaying(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 font-serif">
        <style>{THEME_STYLES}</style>
        <LockScreen onLogin={login} />
      </div>
    );
  }

  const pendingOptions = shown < events.length && events[shown].kind === "options" && choices[shown] == null ? events[shown] : null;

  // read receipt: the newest sent (POV) message is "Delivered" until any
  // later incoming message reveals — then it flips to "Seen"
  const revealed = events.slice(0, shown);
  let lastPovIndex = -1;
  revealed.forEach((e, i) => {
    if ((e.kind === "message" && samePerson(e.speaker, config.pov)) || e.kind === "options") lastPovIndex = i;
  });
  const povSeen = revealed.some((e, i) => i > lastPovIndex && e.kind === "message" && !samePerson(e.speaker, config.pov));
  const metaFor = (i, isPov) => {
    const parts = [];
    if (config.showTimestamps && times[i]) parts.push(times[i]);
    if (isPov && config.showReceipts && i === lastPovIndex) parts.push(povSeen ? "Seen" : "Delivered");
    return parts.join(" · ") || null;
  };

  return (
    <div className="min-h-screen bg-stone-900 relative">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />
      <FloatingParticles />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8">
        <header className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-violet-500 hover:text-violet-300 transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Return to the Hub
          </a>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-violet-100 to-violet-200">Chat Studio</h1>
          <p className="text-violet-500/60 text-sm tracking-[0.3em] uppercase mt-2">Weave a conversation</p>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,26rem),1fr] gap-8 items-start">
          {/* ---------- editor ---------- */}
          <section className="bg-gradient-to-br from-stone-800/90 to-stone-900/90 border border-violet-700/30 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Chat name">
                <input className={inputCls} value={config.chatName} onChange={(e) => set({ chatName: e.target.value })} placeholder="Astral Anemos" />
              </Field>
              <Field label="Status / subtitle">
                <input className={inputCls} value={config.subtitle} onChange={(e) => set({ subtitle: e.target.value })} placeholder="online" />
              </Field>
              <Field label="You are (POV)">
                <select className={inputCls} value={config.pov} onChange={(e) => set({ pov: e.target.value })}>
                  <option value="">— nobody (all left) —</option>
                  {speakers.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Typing speed">
                <select className={inputCls} value={config.speed} onChange={(e) => set({ speed: e.target.value })}>
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </Field>
              <Field label="Clock starts at">
                <input className={inputCls} value={config.clockStart} onChange={(e) => set({ clockStart: e.target.value })} placeholder="03:12" />
              </Field>
              <Field label="Status color">
                <div className="flex items-center gap-1.5 py-1">
                  {STATUS_PRESETS.map(([color, label]) => (
                    <button
                      key={color}
                      title={label}
                      aria-label={`Status ${label}`}
                      onClick={() => set({ statusColor: color })}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${config.statusColor === color ? "border-violet-300 scale-110" : "border-stone-700"}`}
                      style={{ backgroundColor: color, boxShadow: config.statusColor === color ? `0 0 8px ${color}` : "none" }}
                    />
                  ))}
                  <input
                    type="color"
                    title="Custom color"
                    aria-label="Custom status color"
                    value={config.statusColor}
                    onChange={(e) => set({ statusColor: e.target.value })}
                    className="w-6 h-6 rounded-full border-2 border-stone-700 bg-transparent cursor-pointer p-0"
                  />
                </div>
              </Field>
              <Field label="Chat avatar">
                <select className={inputCls} value={config.avatar} onChange={(e) => set({ avatar: e.target.value })}>
                  <option value="">— auto (from chat name) —</option>
                  {images.map((img) => (
                    <option key={img.name} value={img.name}>{img.name}</option>
                  ))}
                </select>
              </Field>
              <div className="flex flex-col justify-end gap-1.5 pb-0.5">
                {[
                  ["showTimestamps", "Timestamps"],
                  ["showReceipts", "Read receipts"],
                  ["sound", "Message sounds"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!config[key]}
                      onChange={(e) => set({ [key]: e.target.checked })}
                      className="accent-violet-600 w-3.5 h-3.5"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <Field label="Script">
              <textarea
                className={`${inputCls} font-mono leading-relaxed`}
                style={{ fontFamily: "ui-monospace, monospace" }}
                rows={16}
                spellCheck={false}
                value={config.script}
                onChange={(e) => set({ script: e.target.value })}
              />
            </Field>

            <Field label="Image library">
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-violet-700/30 text-violet-400 hover:text-violet-200 hover:border-violet-500/50 cursor-pointer transition-all text-sm">
                  <ImagePlus className="w-4 h-4" /> Upload images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => { addImages([...e.target.files]); e.target.value = ""; }}
                  />
                </label>
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img) => (
                      <div key={img.name} className="group relative">
                        <img src={img.data} alt={img.name} className="w-full aspect-square object-cover rounded-lg border border-violet-700/30" />
                        <button
                          onClick={() => removeImage(img.name)}
                          aria-label={`Delete ${img.name}`}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-stone-900 border border-stone-700 text-stone-500 hover:text-rose-400 hover:border-rose-500/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs leading-none"
                        >
                          ✕
                        </button>
                        <p className="text-[10px] text-stone-500 truncate text-center mt-0.5" title={img.name}>{img.name}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-stone-500">
                  Use an image's name in <code className="text-violet-400/80">[photo]</code>/<code className="text-violet-400/80">[sticker]</code> lines or as the chat avatar. Name one after a speaker to replace their portrait. Stored in this browser only.
                </p>
              </div>
            </Field>

            <details className="text-sm text-stone-400">
              <summary className="cursor-pointer text-violet-400/80 hover:text-violet-300 transition-colors">Syntax cheatsheet</summary>
              <div className="mt-2 space-y-1 bg-stone-950/50 rounded-lg p-3 border border-violet-800/20" style={{ fontFamily: "ui-monospace, monospace" }}>
                <p><span className="text-violet-300">Sentinel:</span> a text message</p>
                <p><span className="text-violet-300">Sentinel (soft):</span> message with a tone label</p>
                <p><span className="text-violet-300">Astral [photo]:</span> /images/astral.png</p>
                <p><span className="text-violet-300">Astral [sticker]:</span> sentinel <span className="text-stone-500">(a character name, an uploaded image name, or a url)</span></p>
                <p><span className="text-violet-300">&gt;</span> centered stage direction</p>
                <p><span className="text-violet-300">???</span> choice A | choice B | choice C</p>
                <p className="text-stone-500">**bold**, *italic* and {"{gold}"}colored{"{/}"} work inside messages. Known characters get their portrait & color automatically.</p>
              </div>
            </details>

            <button
              onClick={() => { set({ ...DEFAULTS }); }}
              className="text-xs text-stone-500 hover:text-rose-400 transition-colors"
            >
              Reset everything to the example
            </button>
          </section>

          {/* ---------- phone preview ---------- */}
          <section className="max-w-md w-full mx-auto lg:sticky lg:top-8">
            <div className="relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-violet-500/60 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-violet-500/60 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-violet-500/60 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-violet-500/60 rounded-br-lg" />

              <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-violet-700/40 rounded-3xl overflow-hidden shadow-2xl">
                {/* chat header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-900/60 via-violet-800/40 to-violet-900/60 border-b border-violet-700/40">
                  {headerImage ? (
                    <img src={headerImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2" style={{ borderColor: `${headerSpeaker.color}99` }} />
                  ) : headerSpeaker.known ? (
                    <Portrait speaker={headerSpeaker} size="w-10 h-10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-violet-900/60 border-2 border-violet-600/40 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-violet-300" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-violet-100 truncate leading-tight">{config.chatName || "Unnamed chat"}</p>
                    <p className="text-xs text-violet-400/70 truncate flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                        style={{ backgroundColor: config.statusColor, boxShadow: `0 0 6px ${config.statusColor}` }}
                      />
                      {config.subtitle || "…"}
                    </p>
                  </div>
                  <Sparkles className="w-4 h-4 text-violet-500/50 flex-shrink-0" />
                </div>

                {/* messages */}
                <div ref={scrollRef} onClick={step} className="h-[540px] overflow-y-auto px-4 py-4 space-y-3 cursor-pointer">
                  {events.slice(0, shown).map((event, i) => {
                    if (event.kind === "direction") {
                      return (
                        <div key={i} className="msg-in flex items-center gap-3 py-1">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-700/30 to-transparent" />
                          <span className="text-center italic text-stone-500 text-xs"><InlineText text={event.text} /></span>
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-700/30 to-transparent" />
                        </div>
                      );
                    }
                    if (event.kind === "options") {
                      return (
                        <Bubble
                          key={i}
                          event={{ kind: "message", speaker: config.pov || "You", tone: null, media: null, text: choices[i] ?? event.options[0] }}
                          isPov
                          showHeader={false}
                          meta={metaFor(i, true)}
                          resolvePerson={resolvePerson}
                          resolveImage={resolveImage}
                        />
                      );
                    }
                    const isPov = samePerson(event.speaker, config.pov);
                    const prev = [...events.slice(0, i)].reverse().find((e) => e.kind === "message" || e.kind === "options");
                    const prevSpeaker = prev?.kind === "message" ? prev.speaker : prev?.kind === "options" ? config.pov : null;
                    const showHeader = !isPov && !samePerson(prevSpeaker, event.speaker);
                    return (
                      <Bubble
                        key={i}
                        event={event}
                        isPov={isPov}
                        showHeader={showHeader}
                        meta={metaFor(i, isPov)}
                        resolvePerson={resolvePerson}
                        resolveImage={resolveImage}
                      />
                    );
                  })}

                  {typingSpeaker && <TypingBubble speakerName={typingSpeaker} resolvePerson={resolvePerson} />}

                  {pendingOptions && (
                    <div className="msg-in flex flex-wrap gap-2 justify-end pt-1">
                      {pendingOptions.options.map((option) => (
                        <button
                          key={option}
                          onClick={(e) => { e.stopPropagation(); pickOption(shown, option); }}
                          className="px-4 py-2 rounded-full border border-violet-500/50 text-violet-300 text-sm hover:bg-violet-800/40 hover:text-violet-100 transition-all"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {shown === 0 && !typingSpeaker && (
                    <p className="text-center text-stone-600 italic text-sm pt-16">Press play to begin the conversation…</p>
                  )}
                </div>

                {/* controls */}
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-violet-800/30 bg-stone-950/60">
                  <button onClick={restart} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-800/40 border border-violet-600/30 text-violet-200 hover:bg-violet-800/60 transition-colors text-sm font-medium">
                    {shown > 0 ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {shown > 0 ? "Replay" : "Play"}
                  </button>
                  <button onClick={step} disabled={shown >= events.length || !!pendingOptions} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-violet-800/30 text-violet-400 hover:text-violet-200 hover:border-violet-600/40 disabled:opacity-30 transition-all text-sm">
                    <StepForward className="w-4 h-4" /> Step
                  </button>
                  <button onClick={showAll} disabled={shown >= events.length} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-violet-800/30 text-violet-400 hover:text-violet-200 hover:border-violet-600/40 disabled:opacity-30 transition-all text-sm">
                    <Eye className="w-4 h-4" /> All
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center text-stone-600 text-xs italic mt-3">Tip: click anywhere in the chat to advance a step.</p>
          </section>
        </div>
      </div>

      <style>{THEME_STYLES}</style>
    </div>
  );
}
