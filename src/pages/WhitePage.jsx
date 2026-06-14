import { useState, useEffect, useRef } from "react";

const BG_VIDEO_PATH = "/videos/whitebg.mp4";
const NAME = "White";

const TIPS = [
  { text: "everyone can find love. except you.", duration: 13 },
  { text: "i watch them. i hold nothing.", duration: 8 },
  { text: "it's quiet in here. it always has been.", duration: 8 },
  { text: "i don't know why. i just know it's me.", duration: 8 },
  { text: "rooms fill. something in me empties.", duration: 8 },
  { text: "you smile. no one asks if it's real.", duration: 8 },
  { text: "i think i've stopped waiting.", duration: 8 },
  { text: "static where a heartbeat should be.", duration: 8 },
];

const PARTICLES = [
  [18, 50, 2, 7.1, 0.0],
  [30, 44, 3, 9.3, 1.8],
  [43, 58, 2, 8.0, 0.6],
  [55, 41, 2, 10.2, 3.1],
  [67, 55, 3, 7.7, 2.2],
  [79, 47, 2, 8.9, 0.4],
  [88, 62, 2, 9.6, 1.5],
  [10, 38, 2, 6.8, 2.9],
];

export default function WhitePage() {
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (TIPS.length <= 1) return;
    let outer = null;
    let inner = null;
    const schedule = (idx) => {
      outer = setTimeout(() => {
        setTipVisible(false);
        inner = setTimeout(() => {
          const next = (idx + 1) % TIPS.length;
          setTipIndex(next);
          setTipVisible(true);
          schedule(next);
        }, 500);
      }, TIPS[idx].duration * 1000);
    };
    schedule(0);
    return () => { clearTimeout(outer); clearTimeout(inner); };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        background: "#dde2ee",
        fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --void-bright: #edf0f7;
          --void-mid:    #dde2ee;
          --void-edge:   #c8cdd9;
          --ink:         #FFFFFF;
          --ghost-cold:  #3d60c8;
          --ghost-warm:  #a83860;
          --whisper:     #FFFFFF;
          --line:        rgba(12,14,24,0.05);
        }

        /* cold fluorescent void */
        .void {
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(120% 120% at 50% 44%,
            var(--void-bright) 0%, var(--void-mid) 55%, var(--void-edge) 100%);
          animation: breathe 20s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { filter: brightness(1); }
          50%      { filter: brightness(0.975); }
        }

        /* darkness closes in from the edges */
        .vignette {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: radial-gradient(ellipse 72% 68% at 50% 50%,
            transparent 30%,
            rgba(8, 10, 22, 0.18) 65%,
            rgba(8, 10, 22, 0.28) 100%);
        }

        .scanlines {
          position: absolute; inset: 0; z-index: 4; pointer-events: none;
          mix-blend-mode: multiply; opacity: 0.58;
          background: repeating-linear-gradient(to bottom,
            transparent 0 2px, rgba(12,14,24,0.055) 2px 4px);
        }
        .scanband {
          position: absolute; left: 0; right: 0; height: 30%; z-index: 4;
          pointer-events: none; mix-blend-mode: multiply;
          background: linear-gradient(to bottom, transparent, rgba(12,14,24,0.045), transparent);
          animation: drift 11s linear infinite;
        }
        @keyframes drift {
          0%   { transform: translateY(-35%); }
          100% { transform: translateY(160%); }
        }

        /* thoughts that drift away unheard */
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(61, 96, 200, 0.1);
          animation: float var(--dur, 8s) ease-in var(--delay, 0s) infinite;
          pointer-events: none; z-index: 3;
        }
        @keyframes float {
          0%   { transform: translateY(0) scale(1); opacity: 0.28; }
          65%  { opacity: 0.08; }
          100% { transform: translateY(-80px) scale(0.15); opacity: 0; }
        }

        .stage {
          position: relative; z-index: 5; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 34px;
          padding: 0 20px;
        }

        /* ====== THE NAME ====== */
        .glitch {
          position: relative;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(64px, 18vw, 152px);
          letter-spacing: -0.045em;
          line-height: 1;
          color: var(--ink);
          cursor: default;
          user-select: none;
          will-change: transform, filter;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          mix-blend-mode: multiply;
          pointer-events: none;
          opacity: 0;
        }
        .glitch::before { color: var(--ghost-cold); }
        .glitch::after  { color: var(--ghost-warm); }

        /* emerge from fog on load */
        .glitch.intro {
          animation: assemble 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes assemble {
          from { opacity: 0; transform: translateY(-28px) scale(0.97); filter: blur(8px); }
          to   { opacity: 1; transform: none; filter: none; }
        }

        /*
          5 independent async loops — they rarely align, so the
          pattern never obviously repeats.
          jitter:  0.19s   constant micro-tremor
          brk:     8.7s    rare violent break
          flk:     5.3s    independent opacity stutter
          gA:      3.1s    cold (blue) channel slice bursts
          gB:      4.3s    warm (mauve) channel slice bursts
        */
        .glitch.live {
          animation:
            jitter 0.19s ease-in-out infinite,
            brk    8.7s  steps(1, end) infinite,
            flk    5.3s  steps(1, end) infinite;
        }
        .glitch.live::before { animation: gA 3.1s steps(1, end) infinite; }
        .glitch.live::after  { animation: gB 4.3s steps(1, end) infinite; }

        /* hover: touch it and it breaks faster */
        .glitch.intense {
          animation:
            jitter 0.11s ease-in-out infinite,
            brk    2.2s  steps(1, end) infinite,
            flk    1.65s steps(1, end) infinite;
        }
        .glitch.intense::before { animation: gA 0.88s steps(1, end) infinite; }
        .glitch.intense::after  { animation: gB 1.22s steps(1, end) infinite; }

        /* it's never completely still */
        @keyframes jitter {
          0%   { transform: translate(0,      0); }
          18%  { transform: translate(-0.45px,  0.20px); }
          36%  { transform: translate( 0.35px, -0.18px); }
          54%  { transform: translate(-0.25px,  0.32px); }
          72%  { transform: translate( 0.40px,  0.08px); }
          90%  { transform: translate(-0.15px, -0.22px); }
          100% { transform: translate(0,      0); }
        }

        /* 89% of the cycle: nothing. then it shatters. */
        @keyframes brk {
          0%, 89%, 100% {
            transform: translate(0,0) skewX(0deg);
            filter: none;
          }
          90%  { transform: translate(-20px,  5px) skewX(18deg);  filter: hue-rotate(90deg) saturate(2.5); }
          91%  { transform: translate( 16px, -6px) skewX(-14deg); filter: hue-rotate(-55deg) saturate(1.8); }
          92%  { transform: translate(-10px,  3px) skewX(9deg);   filter: none; }
          93%  { transform: translate(  7px, -2px) skewX(-6deg); }
          94%  { transform: translate( -4px,  1px) skewX(3deg); }
          95%  { transform: translate(  2px,  0px); }
          96%  { transform: translate( -1px,  0px); }
        }

        /* independent opacity stutter */
        @keyframes flk {
          0%, 83%, 100% { opacity: 1; }
          84% { opacity: 0.05; }
          85% { opacity: 1; }
          87% { opacity: 0.52; }
          88% { opacity: 1; }
          90% { opacity: 0.78; }
          91% { opacity: 1; }
        }

        /*
          Cold channel: 64% silence → 5 rapid slice snaps (62ms each) → gone.
          With steps(1,end) each keyframe holds until the next, then snaps.
        */
        @keyframes gA {
          0%   { opacity: 0; clip-path: inset(0 0 100% 0); transform: translateX(0); }
          64%  { opacity: 0; clip-path: inset(0 0 100% 0); transform: translateX(0); }
          66%  { opacity: 0.92; clip-path: inset( 3% 0 86% 0); transform: translateX(-6px); }
          68%  { opacity: 0.92; clip-path: inset(31% 0 56% 0); transform: translateX(-9px); }
          70%  { opacity: 0.92; clip-path: inset(62% 0 24% 0); transform: translateX(-5px); }
          72%  { opacity: 0.85; clip-path: inset(14% 0 74% 0); transform: translateX(-7px); }
          74%  { opacity: 0.92; clip-path: inset(80% 0  8% 0); transform: translateX(-4px); }
          76%  { opacity: 0;    clip-path: inset( 0 0 100% 0); transform: translateX(0); }
          /* micro-flash late in the cycle */
          90%  { opacity: 0; }
          91%  { opacity: 0.75; clip-path: inset(44% 0 40% 0); transform: translateX(-3px); }
          92%  { opacity: 0; }
          100% { opacity: 0; clip-path: inset(0 0 100% 0); transform: translateX(0); }
        }

        /* Warm channel: fires at a different phase, offsets right */
        @keyframes gB {
          0%   { opacity: 0; clip-path: inset(0 0 100% 0); transform: translateX(0); }
          27%  { opacity: 0; }
          29%  { opacity: 0.88; clip-path: inset( 8% 0 79% 0); transform: translateX(7px); }
          31%  { opacity: 0.88; clip-path: inset(46% 0 40% 0); transform: translateX(10px); }
          33%  { opacity: 0.88; clip-path: inset(73% 0 14% 0); transform: translateX(6px); }
          35%  { opacity: 0.72; clip-path: inset(20% 0 66% 0); transform: translateX(8px); }
          37%  { opacity: 0; }
          /* secondary flicker at a different phase */
          68%  { opacity: 0; }
          69%  { opacity: 0.82; clip-path: inset(53% 0 34% 0); transform: translateX(5px); }
          70%  { opacity: 0.82; clip-path: inset( 6% 0 83% 0); transform: translateX(7px); }
          71%  { opacity: 0; }
          100% { opacity: 0; clip-path: inset(0 0 100% 0); transform: translateX(0); }
        }

        /* ====== CAPTION ====== */
        .caption {
          min-height: 20px;
          max-width: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: clamp(11px, 2.4vw, 13px);
          letter-spacing: 0.09em;
          color: var(--whisper);
          text-transform: lowercase;
        }
        .caption-text {
          transition: opacity 0.52s ease;
        }
        .caret {
          display: inline-block;
          width: 0.52em; height: 1em;
          margin-left: 0.28em;
          background: var(--whisper);
          transform: translateY(0.1em);
          flex-shrink: 0;
          animation: blink 1.2s steps(1, end) infinite;
        }
        @keyframes blink {
          0%,  49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .caption.intro { animation: rise 0.9s ease 0.55s both; }
        @keyframes rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ====== SOUND BUTTON ====== */
        .soundbtn {
          position: absolute; bottom: 24px; right: 24px; z-index: 10;
          background: rgba(255,255,255,0.36);
          border: 1px solid rgba(12,14,24,0.1);
          border-radius: 999px; padding: 7px 13px; cursor: pointer;
          display: flex; align-items: center; gap: 7px;
          color: #3a3d50; font-size: 11px; letter-spacing: 0.07em;
          font-family: 'Space Mono', monospace; text-transform: lowercase;
          backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s;
        }
        .soundbtn:hover {
          background: rgba(255,255,255,0.6);
          border-color: rgba(12,14,24,0.18);
        }

        @media (prefers-reduced-motion: reduce) {
          .void, .scanband, .particle, .caret { animation: none !important; }
          .glitch.live, .glitch.intense { animation: none !important; }
          .glitch.live::before, .glitch.intense::before {
            opacity: 0.55; clip-path: inset(28% 0 54% 0);
            transform: translateX(-2px); animation: none !important;
          }
          .glitch.live::after, .glitch.intense::after {
            opacity: 0.55; clip-path: inset(60% 0 22% 0);
            transform: translateX(2px); animation: none !important;
          }
        }
      `}</style>

      <div className="void" />

      {BG_VIDEO_PATH && (
        <video
          ref={videoRef}
          src={BG_VIDEO_PATH}
          autoPlay loop muted playsInline
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", zIndex: 0,
          }}
        />
      )}

      {/* cold wash: melts video edges back into the void */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "radial-gradient(ellipse at center, rgba(237,240,247,0.1) 0%, rgba(221,226,238,0.3) 55%, rgba(200,205,217,0.55) 100%)",
        }}
      />

      <div className="vignette" />

      {PARTICLES.map(([x, y, size, dur, delay], i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${x}%`, top: `${y}%`,
            width: `${size}px`, height: `${size}px`,
            "--dur": `${dur}s`,
            "--delay": `${delay}s`,
          }}
        />
      ))}

      <div className="stage">
        <h1
          className={`glitch ${loaded ? "live" : "intro"} ${hovered ? "intense" : ""}`}
          data-text={NAME}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {NAME}
        </h1>

        <div className={`caption ${loaded ? "" : "intro"}`}>
          <span className="caption-text" style={{ opacity: tipVisible ? 1 : 0 }}>
            {TIPS[tipIndex].text}
          </span>
          <span className="caret" />
        </div>
      </div>

      <div className="scanlines" />
      <div className="scanband" />

      <button
        className="soundbtn"
        onClick={() => {
          const v = videoRef.current;
          if (!v) return;
          if (soundOn) { v.muted = true; setSoundOn(false); }
          else { v.muted = false; v.volume = 0.1; setSoundOn(true); }
        }}
      >
        {soundOn ? (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
          </svg>
        ) : (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
        {soundOn ? "10%" : "muted"}
      </button>
    </div>
  );
}
