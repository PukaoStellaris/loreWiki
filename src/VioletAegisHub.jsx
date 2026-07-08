import { useEffect, useRef, useState } from "react";
import "./violet-aegis-hub.css";

const DEFAULT_TRACKS = [
  { title: "Falling Up", sub: "MAIN THEME", dur: 222 },
  { title: "The Violet Nihility", sub: "ASCENSION", dur: 258 },
  { title: "Shatter Art", sub: "BATTLE", dur: 177 },
];

// To add a door: copy an entry, fill in the fields, and un-comment (or append to the array).
//   roman      — numeral shown inside the orb (e.g. "IV")
//   label      — large name below the orb
//   tag        — small subtitle below the label
//   href       — URL the door links to
//   left/top   — position on the page (% from top-left corner)
//   delay      — pop-in animation delay on load
//   floatDelay — phase offset so each orb bobs at a different time
const DOORS = [
  { roman: "I",  label: "Listen",   tag: "MUSIC PLAYER", href: "/listen",   left: "64%", top: "26%", delay: "0.6s", floatDelay: "0s"   },
  { roman: "II", label: "Divinity", tag: "THE PATH",     href: "/divinity", left: "81%", top: "53%", delay: "0.8s", floatDelay: "1.3s" },
  { roman: "III", label: "Chronicle", tag: "THE STORY",  href: "/story",    left: "60%", top: "78%", delay: "1.0s", floatDelay: "0.65s" },
  // { roman: "IV", label: "Phantasma", tag: "THE POEM", href: "/phantasma", left: "45%", top: "30%", delay: "1.2s", floatDelay: "0.9s" },
];

const MOTION_FACTORS = { Calm: 0.55, Drifting: 1, Charged: 1.7 };
const STORAGE_KEY = "va-player";

function darken(hex, amt) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16),
    g = parseInt(n.slice(2, 4), 16),
    b = parseInt(n.slice(4, 6), 16);
  const d = (c) => Math.round(c * (1 - amt));
  return `rgb(${d(r)},${d(g)},${d(b)})`;
}

function rgba(hex, a) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16),
    g = parseInt(n.slice(2, 4), 16),
    b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function fmt(s) {
  s = Math.floor(s);
  const m = Math.floor(s / 60),
    r = s % 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

function loadPlayer() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (s && typeof s.track === "number") return { playing: false, track: s.track, t: s.t || 0 };
  } catch (e) {}
  return { playing: false, track: 0, t: 0 };
}

function savePlayer(p) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ track: p.track, t: p.t }));
  } catch (e) {}
}

function usePlayer(tracks) {
  const [player, setPlayer] = useState(loadPlayer);

  useEffect(() => {
    const id = setInterval(() => {
      setPlayer((p) => {
        if (!p.playing) return p;
        const dur = tracks[p.track].dur;
        let t = p.t + 0.25,
          track = p.track;
        if (t >= dur) {
          t = 0;
          track = (track + 1) % tracks.length;
        }
        const np = { playing: true, track, t };
        savePlayer(np);
        return np;
      });
    }, 250);
    return () => clearInterval(id);
  }, [tracks]);

  const toggle = () => setPlayer((p) => { const np = { ...p, playing: !p.playing }; savePlayer(np); return np; });
  const next   = () => setPlayer((p) => { const np = { playing: p.playing, track: (p.track + 1) % tracks.length, t: 0 }; savePlayer(np); return np; });
  const prev   = () => setPlayer((p) => { const np = { playing: p.playing, track: (p.track - 1 + tracks.length) % tracks.length, t: 0 }; savePlayer(np); return np; });
  const seek   = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    setPlayer((p) => { const np = { ...p, t: f * tracks[p.track].dur }; savePlayer(np); return np; });
  };

  return { player, toggle, next, prev, seek };
}

const PlayPause = ({ playing }) =>
  playing ? (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

const NextIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
    <rect x="15.6" y="5" width="2.4" height="14" rx="1" />
    <path d="M4 5l9 7-9 7z" />
  </svg>
);

const Sigil = ({ w = 32, h = 44 }) => (
  <img src="/Icon.png" width={w} height={h} alt=""
    style={{ filter: "drop-shadow(0 0 9px var(--accent-deep))", objectFit: "contain" }} />
);

export default function VioletAegisHub({
  accent = "#b06bf0",
  motion = "Drifting",
  tracks = DEFAULT_TRACKS,
  onNavigate,
}) {
  const rootRef      = useRef(null);
  const particlesRef = useRef(null);
  const linesRef     = useRef(null);
  const originRef    = useRef(null);
  const nodeRefs     = useRef([]);

  const { player, toggle, next, prev, seek } = usePlayer(tracks);
  const tr = tracks[player.track];
  const eqState = player.playing ? "running" : "paused";

  useEffect(() => {
    const root    = rootRef.current;
    const pCanvas = particlesRef.current;
    const lCanvas = linesRef.current;
    if (!root || !pCanvas || !lCanvas) return;

    const factor = MOTION_FACTORS[motion] || 1;
    let raf = null;
    let linesRaf = null;

    const drawParticles = () => {
      const rect = root.getBoundingClientRect();
      const dpr  = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width, h = rect.height;
      pCanvas.width  = w * dpr;
      pCanvas.height = h * dpr;
      const ctx = pCanvas.getContext("2d");
      ctx.scale(dpr, dpr);
      const count = Math.round(((w * h) / 14000) * factor);
      const speed = 0.3 * factor;
      const ps = [];
      for (let i = 0; i < count; i++) {
        ps.push({
          x: Math.random() * w, y: Math.random() * h,
          r: 0.5 + Math.random() * 1.5,
          vy: speed * (0.4 + Math.random()),
          sway: 0.04 + Math.random() * 0.16,
          ph: Math.random() * 6.28,
          a: 0.1 + Math.random() * 0.55,
        });
      }
      const tick = () => {
        ctx.clearRect(0, 0, w, h);
        for (const p of ps) {
          p.y -= p.vy;
          p.x += Math.sin(p.y * 0.01 + p.ph) * p.sway;
          if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
          const rad = p.r * 4;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
          g.addColorStop(0, rgba(accent, p.a));
          g.addColorStop(1, rgba(accent, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, 6.2832);
          ctx.fill();
        }
        raf = requestAnimationFrame(tick);
      };
      tick();
    };

    const drawLines = () => {
      const rect = root.getBoundingClientRect();
      const dpr  = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (lCanvas.width !== w || lCanvas.height !== h) {
        lCanvas.width  = w;
        lCanvas.height = h;
      }
      const ctx = lCanvas.getContext("2d");
      ctx.scale(dpr, dpr);
      const center = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - rect.left + r.width / 2, y: r.top - rect.top + r.height / 2 };
      };
      const o = originRef.current;
      const nodes = nodeRefs.current.filter(Boolean);
      if (!o || nodes.length < 1) return;
      const oc  = center(o);
      const pts = nodes.map(center);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.lineWidth = 1;
      // Lines from origin to each node
      pts.forEach((p) => {
        const grad = ctx.createLinearGradient(oc.x, oc.y, p.x, p.y);
        grad.addColorStop(0, rgba(accent, 0.05));
        grad.addColorStop(1, rgba(accent, 0.3));
        ctx.strokeStyle = grad;
        ctx.beginPath(); ctx.moveTo(oc.x, oc.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      });
      // Lines connecting nodes sequentially
      ctx.strokeStyle = rgba(accent, 0.12);
      for (let i = 0; i < pts.length - 1; i++) {
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[i + 1].x, pts[i + 1].y); ctx.stroke();
      }
      ctx.fillStyle = rgba(accent, 0.5);
      ctx.beginPath(); ctx.arc(oc.x, oc.y, 2.5, 0, 6.2832); ctx.fill();
    };

    drawParticles();

    const t1 = setTimeout(() => {
      const loopLines = () => { drawLines(); linesRaf = requestAnimationFrame(loopLines); };
      loopLines();
    }, 100);
    const t2 = setTimeout(() => { lCanvas.style.opacity = 1; }, 420);

    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      drawParticles();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (linesRaf) cancelAnimationFrame(linesRaf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", onResize);
    };
  }, [accent, motion]);

  const handleDoor = (href) => (e) => {
    if (onNavigate) { e.preventDefault(); onNavigate(href); }
  };

  const rootStyle = {
    "--accent":      accent,
    "--accent-deep": darken(accent, 0.5),
  };

  return (
    <div ref={rootRef} className="va-hub" style={rootStyle}>
      <canvas ref={linesRef}     className="va-hub__lines"     />
      <canvas ref={particlesRef} className="va-hub__particles" />

      <div className="va-hub__nebula va-hub__nebula--a" />
      <div className="va-hub__nebula va-hub__nebula--b" />
      <div className="va-hub__vignette" />

      <div ref={originRef} className="va-hub__origin" />

      {/* TITLE */}
      <div className="va-hub__title">
        <div className="va-hub__eyebrow-row">
          <Sigil />
          <div className="va-hub__eyebrow">PROJECT DIVINITY</div>
        </div>
        <div className="va-hub__wordmark">
          VIOLET<br />AEGIS
        </div>
        <div className="va-hub__flavor">
          Pukao was here.
        </div>
        {/*<div className="va-hub__rule">
          <span className="va-hub__rule-line" />
          "Both things can be true."
        </div>*/}
      </div>

      {/* DOOR NODES */}
      {DOORS.map((d, i) => (
        <div key={d.href} className="va-hub__node-pos" style={{ left: d.left, top: d.top, animationDelay: d.floatDelay }}>
          <div className="va-hub__node-pop" style={{ animationDelay: d.delay }}>
            <a href={d.href} className="va-hub__node" onClick={handleDoor(d.href)}>
              <div ref={(el) => (nodeRefs.current[i] = el)} className="va-hub__orb">
                <span className="va-hub__orb-roman">{d.roman}</span>
              </div>
              <div className="va-hub__node-label">
                <div className="va-hub__node-name">{d.label}</div>
                <div className="va-hub__node-tag">{d.tag}</div>
              </div>
            </a>
          </div>
        </div>
      ))}

      {/* MUSIC CONTROL — hidden for now, un-comment to restore
      <div className="va-hub__music">
        <div className="va-hub__music-btn-wrap">
          <div className="va-hub__pulse" style={{ animationPlayState: eqState }} />
          <button className="va-hub__playbtn" onClick={toggle} aria-label={player.playing ? "Pause" : "Play"}>
            <span className="va-hub__icon"><PlayPause playing={player.playing} /></span>
          </button>
        </div>
        <div className="va-hub__eq">
          <span style={{ animationPlayState: eqState, animationDelay: "0s" }} />
          <span style={{ animationPlayState: eqState, animationDelay: "0.3s" }} />
          <span style={{ animationPlayState: eqState, animationDelay: "0.15s" }} />
        </div>
        <div className="va-hub__music-meta">
          <div className="va-hub__music-row">
            <div className="va-hub__track">{tr.title}</div>
            <button className="va-hub__nextbtn" onClick={next} aria-label="Next track">
              <NextIcon />
            </button>
          </div>
          <div className="va-hub__scrub" onClick={seek}>
            <div className="va-hub__scrub-fill" style={{ width: `${(player.t / tr.dur) * 100}%` }} />
          </div>
        </div>
      </div>
      */}

      {/* FOOTER */}
      <div className="va-hub__foot va-hub__foot--left">© PROJECT DIVINITY · VIOLET AEGIS</div>
      <div className="va-hub__foot va-hub__foot--right">EST. MMXXVI</div>
    </div>
  );
}
