import { useState, useEffect, useRef } from "react";

const BG_VIDEO_PATH = "/videos/whitebg.mp4";

const TIPS = ["Hello, Am white, I sleep."];
const TIP_DURATION_SECONDS = 30;

const BG_MAIN = "#0c0a1a";

export default function WhitePage() {
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const [showAka, setShowAka] = useState(false);
  const [titleVisible, setTitleVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1700);
    return () => clearTimeout(t);
  }, []);

  const handleTitleEnter = () => {
    setTitleVisible(false);
    setTimeout(() => { setShowAka(true); setTitleVisible(true); }, 200);
  };
  const handleTitleLeave = () => {
    setTitleVisible(false);
    setTimeout(() => { setShowAka(false); setTitleVisible(true); }, 200);
  };

  useEffect(() => {
    if (TIPS.length <= 1) return;
    const interval = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % TIPS.length);
        setTipVisible(true);
      }, 500);
    }, TIP_DURATION_SECONDS * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: "100%", height: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: BG_MAIN, overflow: "hidden",
      position: "relative", fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes videoFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInFromTop { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInFromBottom { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {BG_VIDEO_PATH ? (
        <video ref={videoRef} src={BG_VIDEO_PATH} autoPlay loop muted playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, animation: "videoFadeIn 1s ease forwards" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "#0c0a1a" }} />
      )}

      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: BG_VIDEO_PATH
          ? `radial-gradient(ellipse at center, ${BG_MAIN}77 0%, ${BG_MAIN}cc 70%, ${BG_MAIN}ee 100%)`
          : "transparent",
      }} />

      <div style={{
        position: "relative", zIndex: 2, textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
      }}>
        <h1
          onMouseEnter={handleTitleEnter}
          onMouseLeave={handleTitleLeave}
          style={{
            fontSize: 52, fontWeight: 700, color: "#ffffff",
            letterSpacing: "-0.03em", lineHeight: 1.1,
            fontFamily: "'DM Sans', sans-serif",
            textShadow: "0 0 10px #000000cc, 0 0 30px #000000aa, 0 2px 4px #000000ee",
            cursor: "default",
            opacity: loaded ? (titleVisible ? 1 : 0) : undefined,
            animation: loaded ? "none" : "fadeInFromTop 0.7s ease 0.5s both",
            transition: loaded ? "opacity 0.2s ease-in-out" : "none",
          }}
        >
          {showAka ? "White" : "White"}
        </h1>

        <div style={{ minHeight: 52, maxWidth: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{
            fontSize: 16, color: "#d4d0e0", maxWidth: 500,
            lineHeight: 1.6, fontWeight: 400,
            textShadow: "0 0 8px #000000cc, 0 0 20px #000000aa, 0 1px 3px #000000ee",
            opacity: loaded ? (tipVisible ? 1 : 0) : undefined,
            animation: loaded ? "none" : "fadeInFromBottom 0.7s ease 0.9s both",
            transition: loaded ? "opacity 0.5s ease-in-out" : "none",
          }}>
            {TIPS[tipIndex]}
          </p>
        </div>
      </div>

      {/* Sound toggle — bottom right corner */}
      <button
        onClick={() => {
          const v = videoRef.current;
          if (!v) return;
          if (soundOn) {
            v.muted = true;
            setSoundOn(false);
          } else {
            v.muted = false;
            v.volume = 0.1;
            setSoundOn(true);
          }
        }}
        style={{
          position: "absolute", bottom: 24, right: 24, zIndex: 10,
          background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "8px 14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8,
          color: "#e8e4f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
          backdropFilter: "blur(8px)", transition: "background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
      >
        {soundOn ? (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
          </svg>
        ) : (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        )}
        {soundOn ? "10%" : "Muted"}
      </button>
    </div>
  );
}
