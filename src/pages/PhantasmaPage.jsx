import { useState, useEffect, useRef } from "react";
import SoundButton from "../components/SoundButton.jsx";
import FloatingParticles from "../components/FloatingParticles.jsx";
import useRevealOnHover from "../hooks/useRevealOnHover.js";
import useTipRotation from "../hooks/useTipRotation.js";

const BG_VIDEO_PATH = "/videos/background.mp4";
const AUDIO_PATH = "/audio/phantasma.mp3";
const BG_MAIN = "#0c0a1a";
const ACCENT  = "#c493fd";

const START_TIME    = 84;   // seconds to skip to on load
const FADE_VOLUME    = 0.2; // target volume after fade-in
const FADE_DURATION  = 1500; // ms

// Placeholder lyrics — replace text/time (seconds) once the real track + lyrics are ready.
// Timing helper: while the music plays, press "L" to log a ready-to-paste
// `{ time, text }` line with the current timestamp in the browser console.
const LYRICS = [
  { time: 30, text: "When I was young and lost" },
  { time: 36.8, text: "You showed up, and had my doors unlocked" },
  { time: 44.8, text: "Like threads, petals unfold" },
  { time: 51.1, text: "A red Kawara-Nadeshiko" },
  { time: 59.4, text: "You have shown me that I am still capable of caring for someone else" },
  { time: 74.0, text: "That I still bare the same innocence inside" },
  { time: 80.0, text: " " },
  { time: 84,  text: "'Cause now I know that pain cannot define the past" },
  { time: 89.7,  text: "We are built to overcome endless mishaps" },
  { time: 94.6,  text: "You know, it is not so bad" },
  { time: 99, text: "When you are with me?" },
  { time: 101.1, text: "Cherish as long as we last" },
  { time: 104.3, text: "'Cause S is not for Sayonara" },
  { time: 109.3, text: "'Let memories play back" },
  { time: 114.8, text: "" },
  { time: 141.1, text: "I knew I must step up" },
  { time: 147.6, text: "You deserve the world and more" },
  { time: 155.5, text: "The truth is that you'd rather" },
  { time: 161.7, text: "Spend our limited time together" },
  { time: 169.6, text: "Protection alone is not enough" },
  { time: 179.1, text: "Providing cannot fill an empty cup" },
  { time: 188.5, text: "Thirsting for love" },
  { time: 192.4, text: "I questioned myself a lot" },
  { time: 197.5, text: "" },
  { time: 224.8, text: "What do I know about love?" },
  { time: 228.0, text: "How can I recreate what I've never had?" },
  { time: 232.9, text: "All I know is that I must keep you thriving" },
  { time: 239.3, text: "If nutrients are what you lack" },
  { time: 242.5, text: "I will water you with every drop of blood I have" },
  { time: 248.9, text: "" },
  { time: 251.8, text: "But now I know that" },
  { time: 253.9, text: "Sacrifice is the easy path" },
  { time: 257.1, text: "My absence cannot ever change the fact" },
  { time: 261.9, text: "I wanted the very best for you, believe me" },
  { time: 268.5, text: "Our threads in red can never be cut" },
  { time: 271.6, text: "And S is not for Sayonara" },
  { time: 277.4, text: "Will you forgive me at last?" },
];

// Rotating idle quotes, shown before the music starts and while muted. Edit freely.
const TIPS = [
  "the one who writes the aegis.",
  "somewhere between the code and the poem.",
  "cherish as long as we last.",
  "let memories play back.",
];

// Bio panel content (press ↓ or the "about" button). Placeholder — edit to taste.
const BIO = {
  epithet: "The creator behind Violet Aegis",
  fields: [
    ["Alias", "Phantasma / Pukao"],
    ["Role", "Writer · Worldbuilder · Developer"],
    ["Project", "Violet Aegis — Project: Divinity"],
    ["Status", "Dreaming"],
  ],
  paragraphs: [
    `Violet Aegis started from a lore story: when Sentinel Phantasma, the "Violet Nihility," was imprisoned for trying to save her sister from the Void entity known as "the Monarch," the top operatives of the Imperial Aegis and the Cardinals of the Divinity Council resigned in protest and founded Violet Aegis in her name.`,
    "Beyond the lore, it's personal to me, a way of sitting with the same questions its characters face: what you'd give up, and who you'd give it up for.",
    "More stories are coming. Where it all leads, though, is still being written.",
  ],
  links: [
    { label: "Lore Wiki", href: "/divinity" },
    { label: "The Story", href: "/story" },
  ],
};

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function PhantasmaPage() {
  const [titleLoaded, setTitleLoaded]   = useState(false);
  const [soundOn, setSoundOn]           = useState(false);
  const [started, setStarted]           = useState(false);
  const [lyricIndex, setLyricIndex]     = useState(-1);
  const [bioOpen, setBioOpen]           = useState(false);
  const [volume, setVolume]             = useState(FADE_VOLUME);

  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);
  const rootRef = useRef(null);
  const { revealed: showAka, visible: titleVisible, bind: titleBind } = useRevealOnHover();
  const { tip, tipVisible } = useTipRotation(TIPS);

  useEffect(() => {
    // titleFadeIn ends at 0.1s + 0.7s = 0.8s; hand off to transition after that
    const t1 = setTimeout(() => setTitleLoaded(true), 850);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      const t = a.currentTime;
      let idx = -1;
      for (let i = 0; i < LYRICS.length; i++) if (LYRICS[i].time <= t) idx = i;
      setLyricIndex(idx);
    };
    a.addEventListener("timeupdate", onTime);
    return () => a.removeEventListener("timeupdate", onTime);
  }, []);

  useEffect(() => () => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
  }, []);

  // Keyboard: M mute · ↓ bio · Esc close bio · L log lyric timestamp
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const k = e.key.toLowerCase();
      if (k === "m" && started) toggleSound();
      else if (k === "arrowdown") setBioOpen(true);
      else if (k === "escape") setBioOpen(false);
      else if (k === "l") {
        const a = audioRef.current;
        if (a) console.log(`{ time: ${a.currentTime.toFixed(1)}, text: "" },`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, soundOn]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const toggleSound = () => {
    const a = audioRef.current;
    if (!a) return;
    cancelFade();
    if (soundOn) { a.muted = true; setSoundOn(false); }
    else { a.muted = false; a.volume = volume; setSoundOn(true); }
  };

  const handleVolume = (v) => {
    cancelFade();
    setVolume(v);
    const a = audioRef.current;
    if (a) a.volume = v;
  };

  // Feed the audio through an analyser so the divider glow can pulse with the
  // low end of the track. Created inside the start gesture so the context runs.
  const startPulse = () => {
    if (REDUCED_MOTION || audioCtxRef.current) return;
    const a = audioRef.current;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = ctx.createMediaElementSource(a);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      ctx.resume().catch(() => {});
      audioCtxRef.current = ctx;

      const data = new Uint8Array(analyser.frequencyBinCount);
      let level = 0;
      const loop = () => {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        const bins = 20; // low frequencies only
        for (let i = 0; i < bins; i++) sum += data[i];
        const target = Math.min(1, (sum / bins / 255) * 1.6);
        level += (target - level) * 0.12;
        rootRef.current?.style.setProperty("--pulse", level.toFixed(3));
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      // Web Audio unavailable — the page works fine without the pulse.
    }
  };

  // Triggered by the "click to begin" overlay — a real user gesture, so the
  // browser will reliably allow unmuted playback (autoplay alone kept getting blocked).
  const handleStart = () => {
    const a = audioRef.current;
    if (!a || started) return;

    const begin = () => {
      try { a.currentTime = START_TIME; } catch {}
      a.muted = false;
      a.volume = 0;
      a.play().catch(() => {});
      startPulse();
      setSoundOn(true);
      setStarted(true);
      const steps = 30;
      let i = 0;
      fadeIntervalRef.current = setInterval(() => {
        i++;
        a.volume = Math.min(FADE_VOLUME, (FADE_VOLUME * i) / steps);
        if (i >= steps && fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }, FADE_DURATION / steps);
    };

    if (a.readyState >= 1) begin();
    else a.addEventListener("loadedmetadata", begin, { once: true });
  };

  const showLyric = soundOn && lyricIndex >= 0;
  const nextLyric = lyricIndex >= 0 && lyricIndex < LYRICS.length - 1 ? LYRICS[lyricIndex + 1] : null;
  const lineSecs = nextLyric ? Math.max(1, nextLyric.time - LYRICS[lyricIndex].time) : 6;

  return (
    <div ref={rootRef} style={{
      width: "100%", height: "100vh", overflow: "hidden",
      background: BG_MAIN, fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Tangerine:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes videoFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes titleFadeIn { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp      { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes karaokeFill { from { background-position: 100% 0; } to { background-position: 0% 0; } }
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
        @keyframes panelUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

        .phantasma-stage {
          position: relative; z-index: 2; width: 100%; height: 100%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 0 6vw;
        }
        .phantasma-stage h1 { font-size: 104px; }
        .karaoke-line {
          margin-top: 26px; max-width: 760px;
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 28px; font-weight: 300; line-height: 1.7;
          animation: fadeUp 0.5s ease both;
        }
        .karaoke-line .fill {
          background: linear-gradient(90deg, #f2eefc 50%, #8d87a5 50%);
          background-size: 205% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: karaokeFill var(--line-secs, 5s) linear forwards;
          filter: drop-shadow(0 1px 4px #000000cc);
        }
        .karaoke-next {
          margin-top: 10px;
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 19px; font-weight: 300; line-height: 1.6;
          color: #7a7490; text-shadow: 0 1px 6px #000000bb;
          animation: fadeUp 0.6s ease 0.15s both;
        }
        .idle-line {
          margin-top: 26px; max-width: 640px;
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 24px; font-weight: 300; line-height: 1.7;
          color: #a8a2bc; text-shadow: 0 1px 6px #000000bb;
          transition: opacity 0.5s ease-in-out;
        }

        .sound-controls {
          position: absolute; bottom: 24px; right: 24px; z-index: 10;
          display: flex; align-items: center; gap: 10px;
        }
        .soundbtn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px; padding: 7px 13px; cursor: pointer;
          display: flex; align-items: center; gap: 7px;
          color: #d4d0e0; font-size: 11px; letter-spacing: 0.07em;
          font-family: 'Space Mono', monospace; text-transform: lowercase;
          backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s;
        }
        .soundbtn:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.28);
        }
        .volslider {
          width: 88px; height: 3px; cursor: pointer;
          accent-color: ${ACCENT};
          opacity: 0.75; transition: opacity 0.2s;
        }
        .volslider:hover { opacity: 1; }

        .bio-hint {
          position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
          z-index: 45; /* above .bio-panel so it can close it */
          background: none; border: none; cursor: pointer;
          color: #8d87a5; font-size: 11px; letter-spacing: 0.14em;
          font-family: 'Space Mono', monospace; text-transform: lowercase;
          text-shadow: 0 1px 6px #000000bb;
          padding: 8px 14px;
          transition: color 0.2s;
        }
        .bio-hint:hover { color: #ece6fb; }

        .bio-panel {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 40;
          max-height: 72vh; overflow-y: auto;
          background: rgba(12,10,26,0.85);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-top: 1px solid ${ACCENT}33;
          padding: 40px 8vw 56px;
          text-align: left;
          animation: panelUp 0.35s ease both;
        }
        .bio-panel h2 {
          font-family: 'Tangerine', cursive; font-weight: 700;
          font-size: 54px; color: #ffffff; line-height: 1;
        }
        .bio-epithet {
          margin-top: 4px; color: ${ACCENT}bb;
          font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase;
          font-family: 'Space Mono', monospace;
        }
        .bio-fields {
          margin-top: 26px;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 14px 28px; max-width: 920px;
        }
        .bio-fields > div {
          border-left: 2px solid ${ACCENT}44; padding-left: 12px;
        }
        .bio-fields .k {
          display: block; color: #8d87a5; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase;
          font-family: 'Space Mono', monospace;
        }
        .bio-fields .v { display: block; margin-top: 3px; color: #e8e4f0; font-size: 14px; }
        .bio-para {
          margin-top: 26px; max-width: 680px;
          color: #c8c4d8; font-size: 15px; line-height: 1.8; font-weight: 300;
        }
        .bio-links { margin-top: 30px; display: flex; gap: 22px; flex-wrap: wrap; }
        .bio-links a {
          color: ${ACCENT}; text-decoration: none; font-size: 12px;
          letter-spacing: 0.12em; text-transform: lowercase;
          font-family: 'Space Mono', monospace;
          border-bottom: 1px solid ${ACCENT}44; padding-bottom: 2px;
          transition: border-color 0.2s, color 0.2s;
        }
        .bio-links a:hover { color: #ece6fb; border-color: #ece6fb; }

        .startbtn {
          margin-top: 38px;
          background: rgba(20,16,36,0.55);
          border: 1px solid ${ACCENT}66;
          border-radius: 999px; padding: 14px 30px; cursor: pointer;
          color: #ece6fb; font-size: 12px; letter-spacing: 0.16em;
          font-family: 'Space Mono', monospace; text-transform: uppercase;
          box-shadow: 0 0 30px -6px ${ACCENT};
          transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
          animation: fadeUp 0.6s ease 0.3s both;
        }
        .startbtn:hover {
          background: rgba(20,16,36,0.78);
          box-shadow: 0 0 44px -4px ${ACCENT};
          transform: scale(1.05);
        }

        @media (max-width: 700px) {
          .phantasma-stage h1 { font-size: 68px !important; }
          .karaoke-line { font-size: 22px; }
          .karaoke-next { font-size: 16px; }
          .idle-line { font-size: 19px; }
          .bio-panel { padding: 30px 7vw 44px; }
        }
        @media (min-width: 701px) and (max-width: 1024px) {
          .phantasma-stage h1 { font-size: 80px !important; }
          .karaoke-line { font-size: 24px; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
          .karaoke-line .fill {
            background: none;
            -webkit-text-fill-color: #d8d4e6; color: #d8d4e6;
          }
          .title-divider { opacity: 1 !important; }
        }
      `}</style>

      {/* Fixed background (static color when the user prefers reduced motion) */}
      {BG_VIDEO_PATH && !REDUCED_MOTION ? (
        <video src={BG_VIDEO_PATH} autoPlay loop muted playsInline style={{
          position: "fixed", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", zIndex: 0, animation: "videoFadeIn 1s ease forwards",
        }} />
      ) : (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, background: BG_MAIN }} />
      )}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1,
        background: `radial-gradient(ellipse at center, ${BG_MAIN}88 0%, ${BG_MAIN}dd 65%, ${BG_MAIN}f5 100%)`,
      }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <FloatingParticles />
      </div>

      <audio ref={audioRef} src={AUDIO_PATH} loop muted />

      {/* Centered content */}
      <div className="phantasma-stage">
        <h1
          {...titleBind}
          style={{
            fontWeight: 700, color: "#ffffff",
            letterSpacing: "0.02em", lineHeight: 1.1,
            fontFamily: "'Tangerine', cursive",
            textShadow: "0 0 10px #000000cc, 0 0 30px #000000aa, 0 2px 4px #000000ee",
            cursor: "default",
            opacity: titleLoaded ? (titleVisible ? 1 : 0) : undefined,
            animation: titleLoaded ? "none" : "titleFadeIn 0.7s ease 0.1s both",
            transition: titleLoaded ? "opacity 0.2s ease-in-out" : "none",
          }}
        >
          {showAka ? "Pukao" : "Phantasma"}
        </h1>
        <div className="title-divider" style={{
          width: 248, height: 2,
          background: `linear-gradient(90deg, transparent, ${ACCENT}55, transparent)`,
          margin: "10px auto 0",
          opacity: 0, animation: "titleFadeIn 0.7s ease 0.5s both",
          // pulses with the music via the analyser loop (--pulse is 0..1)
          boxShadow: `0 0 calc(8px + var(--pulse, 0) * 34px) calc(var(--pulse, 0) * 2px) ${ACCENT}55`,
          borderRadius: 2,
        }} />

        {showLyric ? (
          <div className="karaoke-line" key={lyricIndex} style={{ "--line-secs": `${lineSecs}s` }}>
            <span className="fill">{LYRICS[lyricIndex].text}</span>
            {nextLyric && <div className="karaoke-next">{nextLyric.text}</div>}
          </div>
        ) : (
          <div className="idle-line" style={{ opacity: tipVisible ? 1 : 0 }}>
            {tip}
          </div>
        )}

        {!started && (
          <button className="startbtn" onClick={handleStart}>
            click me (unmutes music)
          </button>
        )}
      </div>

      <button
        className="bio-hint"
        aria-expanded={bioOpen}
        onClick={() => setBioOpen((o) => !o)}
      >
        {bioOpen ? "✕ close" : "↓ about"}
      </button>

      {bioOpen && (
        <div className="bio-panel" role="dialog" aria-label="About Phantasma">
          <h2>Phantasma</h2>
          <p className="bio-epithet">{BIO.epithet}</p>
          <div className="bio-fields">
            {BIO.fields.map(([k, v]) => (
              <div key={k}>
                <span className="k">{k}</span>
                <span className="v">{v}</span>
              </div>
            ))}
          </div>
          {BIO.paragraphs.map((p, i) => (
            <p className="bio-para" key={i}>{p}</p>
          ))}
          <div className="bio-links">
            {BIO.links.map((l) => (
              <a key={l.href} href={l.href}>{l.label} →</a>
            ))}
          </div>
        </div>
      )}

      {started && (
        <div className="sound-controls">
          <input
            type="range"
            className="volslider"
            min="0" max="100"
            value={Math.round(volume * 100)}
            onChange={(e) => handleVolume(Number(e.target.value) / 100)}
            aria-label="Volume"
          />
          <SoundButton
            soundOn={soundOn}
            onToggle={toggleSound}
            onLabel={`${Math.round(volume * 100)}%`}
          />
        </div>
      )}
    </div>
  );
}
