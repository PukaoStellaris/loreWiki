import { useState, useEffect, useRef } from "react";
import SoundButton from "../components/SoundButton.jsx";
import useRevealOnHover from "../hooks/useRevealOnHover.js";

const BG_VIDEO_PATH = "/videos/background.mp4";
const AUDIO_PATH = "/audio/phantasma.mp3";
const BG_MAIN = "#0c0a1a";
const ACCENT  = "#c493fd";

const START_TIME    = 84;   // seconds to skip to on load
const FADE_VOLUME    = 0.2; // target volume after fade-in
const FADE_DURATION  = 1500; // ms

// Placeholder lyrics — replace text/time (seconds) once the real track + lyrics are ready.
const LYRICS = [
  { time: 84,  text: "'Cause now I know that pain cannot define the past" },
  { time: 89,  text: "We are built to overcome endless mishaps" },
  { time: 95,  text: "You know, it is not so bad" },
  { time: 99, text: "When you are with me?" },
  { time: 101, text: "Cherish as long as we last" },
  { time: 104, text: "'Cause S is not for Sayonara" },
  { time: 109, text: "'Let memories play back" },
];

export default function PhantasmaPage() {
  const [titleLoaded, setTitleLoaded]   = useState(false);
  const [soundOn, setSoundOn]           = useState(false);
  const [started, setStarted]           = useState(false);
  const [lyricIndex, setLyricIndex]     = useState(-1);

  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const { revealed: showAka, visible: titleVisible, bind: titleBind } = useRevealOnHover();

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
  }, []);

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

  return (
    <div style={{
      width: "100%", height: "100vh", overflow: "hidden",
      background: BG_MAIN, fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Tangerine:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes videoFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes titleFadeIn { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp      { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

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
          color: #c8c4d8; text-shadow: 0 1px 6px #000000bb;
          animation: fadeUp 0.5s ease both;
        }

        .soundbtn {
          position: absolute; bottom: 24px; right: 24px; z-index: 10;
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

        .start-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: rgba(8,6,16,0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          animation: videoFadeIn 0.4s ease both;
        }
        .startbtn {
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
        }
        @media (min-width: 701px) and (max-width: 1024px) {
          .phantasma-stage h1 { font-size: 80px !important; }
          .karaoke-line { font-size: 24px; }
        }
      `}</style>

      {/* Fixed background */}
      {BG_VIDEO_PATH ? (
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
        <div style={{
          width: 248, height: 2,
          background: `linear-gradient(90deg, transparent, ${ACCENT}55, transparent)`,
          margin: "10px auto 0",
          opacity: 0, animation: "titleFadeIn 0.7s ease 0.5s both",
        }} />

        {lyricIndex >= 0 && (
          <div className="karaoke-line" key={lyricIndex}>
            {LYRICS[lyricIndex].text}
          </div>
        )}
      </div>

      {!started && (
        <div className="start-overlay">
          <button className="startbtn" onClick={handleStart}>
            click me (unmutes music)
          </button>
        </div>
      )}

      {started && (
        <SoundButton
          soundOn={soundOn}
          onToggle={() => {
            const a = audioRef.current;
            if (!a) return;
            if (fadeIntervalRef.current) { clearInterval(fadeIntervalRef.current); fadeIntervalRef.current = null; }
            if (soundOn) { a.muted = true; setSoundOn(false); }
            else { a.muted = false; a.volume = FADE_VOLUME; setSoundOn(true); }
          }}
        />
      )}
    </div>
  );
}
