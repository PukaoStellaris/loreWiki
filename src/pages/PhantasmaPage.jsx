import { useState, useEffect } from "react";

const BG_VIDEO_PATH = "/videos/background.mp4";
const BG_MAIN = "#0c0a1a";
const ACCENT  = "#c493fd";

const LEFT_STANZAS = [
  [
    "To love a thing is to know it will end.",
    "To love a thing is to understand the shape of its absence before absence arrives.",
    "To love a thing is to hold it gently, knowing your hands are made of edges.",
  ],
  [
    "I am the space after the last breath.",
    "I am the pause between heartbeats where nothing exists.",
    "I am the moment of ending, and I am not cruel...",
    <>I am simply <em>thorough</em>.</>,
  ],
  [
    "To be Nihil is to understand that everything is temporary.",
    "To be Nihil is to know that impermanence is not tragedy...",
    "It is the condition that makes beauty possible.",
    "If nothing ever ended, nothing would ever matter.",
  ],
  [
    "So I will love this world the only way I know how:",
    "By holding it gently.",
    "By taking only what must be taken.",
    "By learning, slowly, carefully, over millennia if necessary...",
    "How to be the ending that serves the continuing.",
  ],
];

const RIGHT_STANZAS = [
  [
    "I will be the winter that makes spring possible.",
    "I will be the silence that defines sound.",
    "I will be the void that gives shape to existence.",
    "And I will do this with love,",
    "Even when love looks like letting go.",
  ],
  [
    "This is my prayer:",
    "Let me learn gentleness.",
    "Let me understand the difference between deletion and destruction.",
    "Let me hold without breaking.",
    "Let me end things with the care they deserve.",
  ],
  [
    "And if I cannot do this alone,",
    "Let me find someone patient enough to teach me.",
    "Someone stubborn enough to stay.",
    "Someone kind enough to believe I can be better than I was.",
  ],
  [
    "Someone who eats chips on rooftops,",
    "And looks at the sky like they're surprised it's still there,",
    "And makes me remember",
    "Why I stayed.",
  ],
];

function Stanza({ lines, direction, delay }) {
  const anim = direction === "left" ? "slideFromLeft" : "slideFromRight";
  const align = direction === "right" ? "right" : "left";
  return (
    <div style={{ opacity: 0, animation: `${anim} 0.65s ease ${delay}s both`, textAlign: align }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          fontSize: 18, lineHeight: 1.9, color: "#c8c4d8",
          fontWeight: 300, fontFamily: "'Cormorant Garamond', serif",
          textShadow: "0 1px 6px #000000bb",
        }}>
          {line}
        </div>
      ))}
    </div>
  );
}

export default function PhantasmaPage() {
  const [showAka, setShowAka]           = useState(false);
  const [titleVisible, setTitleVisible] = useState(true);
  const [poemVisible, setPoemVisible]   = useState(false);
  const [titleLoaded, setTitleLoaded]   = useState(false);

  useEffect(() => {
    // titleFadeIn ends at 0.1s + 0.7s = 0.8s; hand off to transition after that
    const t1 = setTimeout(() => setTitleLoaded(true), 850);
    const t2 = setTimeout(() => setPoemVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleTitleEnter = () => {
    setTitleVisible(false);
    setTimeout(() => { setShowAka(true);  setTitleVisible(true); }, 200);
  };
  const handleTitleLeave = () => {
    setTitleVisible(false);
    setTimeout(() => { setShowAka(false); setTitleVisible(true); }, 200);
  };

  return (
    <div style={{
      width: "100%", height: "100vh", overflowY: "auto",
      background: BG_MAIN, fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Tangerine:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes videoFadeIn    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes titleFadeIn    { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideFromLeft  { from { opacity: 0; transform: translateX(-48px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideFromRight { from { opacity: 0; transform: translateX( 48px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp         { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2450; border-radius: 2px; }

        .poem-outer {
          min-height: 100vh; padding: 40px 4vw;
          display: flex; align-items: center; justify-content: center;
        }
        .poem-layout {
          display: flex; align-items: center; width: 100%; gap: 0;
        }
        .poem-col {
          flex: 0 1 38%; display: flex; flex-direction: column; gap: 36px;
        }
        .poem-center {
          flex: 0 0 24%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
        }
        .poem-col-right .stanza { text-align: right; }

        @media (max-width: 700px) {
          .poem-outer { align-items: flex-start; padding: 48px 6vw 64px; }
          .poem-layout { flex-direction: column; gap: 0; }
          .poem-center { flex: unset; width: 100%; order: -1; margin-bottom: 36px; }
          .poem-center h1 { font-size: 52px !important; }
          .poem-col { flex: unset; width: 100%; gap: 28px; }
          .poem-col + .poem-col { margin-top: 28px; }
          .poem-col-right .stanza { text-align: left; }
        }

        @media (min-width: 701px) and (max-width: 1024px) {
          .poem-col { flex: 0 1 42%; }
          .poem-center { flex: 0 0 16%; }
          .poem-center h1 { font-size: 48px !important; }
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

      {/* Centered content */}
      <div className="poem-outer" style={{ position: "relative", zIndex: 2 }}>
        <div className="poem-layout">

          {/* Left poem column */}
          <div className="poem-col poem-col-left">
            {poemVisible && LEFT_STANZAS.map((lines, i) => (
              <Stanza key={i} lines={lines} direction="left" delay={i * 0.12} />
            ))}
          </div>

          {/* Center — title */}
          <div className="poem-center">
            <h1
              onMouseEnter={handleTitleEnter}
              onMouseLeave={handleTitleLeave}
              style={{
                fontSize: 72, fontWeight: 700, color: "#ffffff",
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
          </div>

          {/* Right poem column */}
          <div className="poem-col poem-col-right">
            {poemVisible && RIGHT_STANZAS.map((lines, i) => (
              <Stanza key={i} lines={lines} direction="right" delay={i * 0.12} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
