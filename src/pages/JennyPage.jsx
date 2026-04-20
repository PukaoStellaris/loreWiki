import { useState, useEffect } from "react";

const BG_PATH = "/images/Trin.png";
const BG_IS_IMAGE = /\.(png|jpe?g|webp|gif|avif)$/i.test(BG_PATH);

const TIPS = ["Nub artist. (complete lies btw.)"];
const TIP_DURATION_SECONDS = 30;

const BG_MAIN = "#0c0a1a";

export default function LivvyPage() {
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const [showAka, setShowAka] = useState(false);
  const [titleVisible, setTitleVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);

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

      {BG_PATH && BG_IS_IMAGE && (
        <img src={BG_PATH} alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, animation: "videoFadeIn 1s ease forwards" }} />
      )}
      {BG_PATH && !BG_IS_IMAGE && (
        <video src={BG_PATH} autoPlay loop muted playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, animation: "videoFadeIn 1s ease forwards" }} />
      )}
      {!BG_PATH && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "#0c0a1a" }} />
      )}

      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: BG_PATH
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
          {showAka ? "Jenny the pro god" : "Jenny"}
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
    </div>
  );
}
