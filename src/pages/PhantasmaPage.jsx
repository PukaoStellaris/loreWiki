import { useState, useEffect } from "react";

// =============================================================================
// CONFIGURATION
// =============================================================================

const BG_VIDEO_PATH = "/videos/background.mp4";
const LOGO_IMAGE_PATH = "/images/sentinel.png";

const PHANTASMA_TIPS = [
  "Hello, Welcome to my page. Nothing much but it works!",
  ];

const TIP_DURATION_SECONDS = 30;

// =============================================================================

const ACCENT    = "#93c5fd";
const BG_MAIN   = "#0c0a1a";

/* const GhostIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2">
    <path d="M12 2a7 7 0 00-7 7v10l2.5-2.5L10 19l2-2 2 2 2.5-2.5L19 19V9a7 7 0 00-7-7z"/>
    <line x1="9" y1="10" x2="9" y2="10" strokeWidth="3" strokeLinecap="round"/>
    <line x1="15" y1="10" x2="15" y2="10" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const LogoIcon = ({ size = 32 }) => {
  const [imgFailed, setImgFailed] = useState(false);
  if (LOGO_IMAGE_PATH && !imgFailed) {
    return (
      <img
        src={LOGO_IMAGE_PATH}
        alt="Logo"
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size, objectFit: "contain", borderRadius: size > 40 ? 16 : 6 }}
      />
    );
  }
  return <GhostIcon size={size * 0.55} />;
}; */

export default function PhantasmaPage() {
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const [showAka, setShowAka] = useState(false);
  const [titleVisible, setTitleVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // title finishes at 0.5s delay + 0.7s = 1.2s
    // description finishes at 0.9s delay + 0.7s = 1.6s
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
    if (PHANTASMA_TIPS.length <= 1) return;
    const interval = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % PHANTASMA_TIPS.length);
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
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes videoFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeInFromTop {
          from { opacity: 0; transform: translateY(-30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInFromBottom {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background */}
      {BG_VIDEO_PATH ? (
        <video src={BG_VIDEO_PATH} autoPlay loop muted playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0,
            animation: "videoFadeIn 1s ease forwards" }} />
      ) : (
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "linear-gradient(135deg, #0c0a1a 0%, #0e1a3a 30%, #0a1228 50%, #102040 70%, #0c0a1a 100%)",
          backgroundSize: "400% 400%", animation: "gradientShift 12s ease infinite",
        }} />
      )}

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: BG_VIDEO_PATH
          ? `radial-gradient(ellipse at center, ${BG_MAIN}77 0%, ${BG_MAIN}cc 70%, ${BG_MAIN}ee 100%)`
          : "transparent",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2, textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
      }}>
        {/* <div style={{
          width: 120, height: 120, borderRadius: "50%",
          background: `linear-gradient(135deg, ${ACCENT}33, #3b82f622)`,
          border: `1px solid ${ACCENT}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(20px)", boxShadow: `0 0 60px #3b82f625`,
          overflow: "hidden",
        }}>
          <LogoIcon size={120} />
        </div> */}

        <h1
          onMouseEnter={handleTitleEnter}
          onMouseLeave={handleTitleLeave}
          style={{
            fontSize: 52, fontWeight: 700, color: "#ffffff",
            letterSpacing: "-0.03em", lineHeight: 1.1,
            fontFamily: "'DM Sans', sans-serif",
            textShadow: "0 0 10px #000000cc, 0 0 30px #000000aa, 0 2px 4px #000000ee",
            WebkitTextStroke: "0.5px rgba(0,0,0,0.3)",
            cursor: "default",
            opacity: loaded ? (titleVisible ? 1 : 0) : undefined,
            animation: loaded ? "none" : "fadeInFromTop 0.7s ease 0.5s both",
            transition: loaded ? "opacity 0.2s ease-in-out" : "none",
          }}
        >
          {showAka ? "Phantasma, also known as Pukao" : "Phantasma"}
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
            {PHANTASMA_TIPS[tipIndex]}
          </p>
        </div>

      </div>
    </div>
  );
}
