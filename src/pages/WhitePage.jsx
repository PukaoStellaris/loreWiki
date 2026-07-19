import { useEffect, useRef, useState, useCallback } from "react";

// ============================================================================
// CONFIG — everything you'd want to edit is here.
// ============================================================================

// Songs — these actually play.
//   src  : audio file in /public/audio
//   art  : cover image in /public/images
//   tint : [from, to] card colours pulled from the cover
// Durations are read from the files themselves, not hardcoded.
const SONGS = [
  {
    title: "Over 85", artist: "Hojean", album: "Over 85",
    src: "/audio/Hojean - Over 85 [Yga5pgWubXs].webm",
    art: "/images/over85.jpg",
    tint: ["#1f4a5c", "#101f2b"],
  },
  {
    title: "deserve this", artist: "Hojean", album: "deserve this",
    src: "/audio/deserve this [x-gXlG8mZ2M].webm",
    art: "/images/deserve.jpg",
    tint: ["#2b6b63", "#14322f"],
  },
  {
    title: "weathergirl", artist: "ft. Eleanor Forte", album: "weathergirl",
    src: "/audio/weathergirl ft. Eleanor Forte [M7VSEZOQIlg].webm",
    art: "/images/weathergirl.jpg",
    tint: ["#3a5fa8", "#1a2444"],
  },
  {
    title: "Patchwork Staccato", artist: "JubyPhonic", album: "ツギハギスタッカート",
    src: "/audio/Patchwork Staccato (English Cover)【JubyPhonic】ツギハギスタッカート [elC2uKfEKbg].webm",
    art: "/images/patchwork.jpg",
    tint: ["#b8412c", "#5e2a1e"],
  },
];

// copy:"..." copies to clipboard instead of opening a link.
const SOCIALS = [
  { icon: "discord", title: "Discord", handle: "white1ist", copy: "white1ist" },
  { icon: "roblox",  title: "Roblox",  handle: "@white",    href: "https://www.roblox.com/users/1752114591/profile" },
  { icon: "steam",   title: "Steam",   handle: "@white",    href: "https://steamcommunity.com/profiles/76561198318448470/" },
  { icon: "x",       title: "Twitter", handle: "@white1ist", href: "https://x.com/white1ist" },
];

const P = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.32 4.37A19.8 19.8 0 0 0 15.43 3a13.9 13.9 0 0 0-.63 1.28 18.3 18.3 0 0 0-5.6 0A13.9 13.9 0 0 0 8.57 3 19.7 19.7 0 0 0 3.68 4.38C.57 9 .28 13.53.42 18a19.9 19.9 0 0 0 6.07 3.06c.49-.67.93-1.38 1.3-2.12a13 13 0 0 1-2.05-.98c.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.1 0c.17.14.33.27.5.4-.65.39-1.34.72-2.05.99.37.74.81 1.44 1.3 2.11A19.8 19.8 0 0 0 24.16 18c.31-5.18-.53-9.67-3.84-13.63ZM8.3 15.23c-1.18 0-2.16-1.08-2.16-2.42s.94-2.43 2.16-2.43 2.18 1.1 2.16 2.43c0 1.34-.95 2.42-2.16 2.42Zm7.98 0c-1.18 0-2.15-1.08-2.15-2.42s.94-2.43 2.15-2.43c1.22 0 2.19 1.1 2.16 2.43 0 1.34-.94 2.42-2.16 2.42Z"/></svg>`,
  x:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z"/></svg>`,
  roblox:  `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.9 0 0 19.1 19.1 24 24 4.9 4.9 0Zm5.26 8.89 4.95 1.27-1.27 4.95-4.95-1.27 1.27-4.95Z"/></svg>`,
  steam:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="10.2"/><circle cx="15.6" cy="8.6" r="3.3" fill="currentColor" stroke="none"/><circle cx="7.9" cy="15.6" r="2.5" fill="currentColor" stroke="none"/><path d="M7.9 15.6 15.6 8.6" stroke-linecap="round"/></svg>`,
  mail:    `<svg viewBox="0 0 24 24" ${P}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>`,
};

// Ambient motion — [glyph, left%, size, delay, dur] (hearts) etc.
const HEARTS = [
  ["💜", 8, 13, 0, 9], ["💭", 26, 10, 1.8, 11], ["🤍", 48, 11, 3.4, 10],
  ["💜", 68, 9, 5.1, 12], ["💫", 86, 12, 2.4, 9.5], ["🤍", 36, 8, 6.6, 13],
];
const SPARKS = [
  ["✦", 13, 26, 11, 0, 5.5], ["✧", 31, 68, 8, 2.1, 6.5],
  ["✦", 77, 34, 9, 3.6, 6], ["✧", 90, 72, 7, 1.2, 7.2],
];
const NOTES = [
  ["♪", 12, 88, 13, 0, 11], ["♫", 54, 94, 11, 4.3, 13], ["♪", 82, 90, 12, 7.8, 12],
];
const CLOUDS = [
  ["#6d5a9e", 280, 8, 58, 0], ["#8f7ab8", 200, 14, 26, -6], ["#4b3f7d", 340, 20, 72, -14],
  ["#a48fd0", 160, 11, 12, -3], ["#5c4b92", 240, 17, 44, -9],
];

const DECO_L = "°*·♪", DECO_R = "♪·*°";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const mmss = (s) =>
  String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.floor(s % 60)).padStart(2, "0");

const SpeakerIcon = ({ muted }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    {muted ? (
      <>
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    )}
  </svg>
);

export default function WhitePage() {
  const [gateGone, setGateGone] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [durations, setDurations] = useState({}); // index -> seconds
  const [meterP, setMeterP] = useState(0);
  const [toastMsg, setToastMsg] = useState("");

  const audioRef = useRef(null);
  const rootRef = useRef(null);
  const shellRef = useRef(null);
  const canvasRef = useRef(null);
  const ghostWrapRef = useRef(null);
  const decoRef = useRef(null);

  const curRef = useRef(0);
  const pendingPlayRef = useRef(false);
  const lastVolRef = useRef(0.55);
  const toastTimerRef = useRef(null);
  const meterTimerRef = useRef(null);

  const song = SONGS[cur];

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(""), 1800);
  }, []);

  // ── playback ──────────────────────────────────────────────────────────
  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const selectSong = useCallback((i, autoplay = true) => {
    pendingPlayRef.current = autoplay;
    curRef.current = i;
    setCur(i);
  }, []);

  // Load the audio source whenever the current track changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = song.src;
    setCurrentTime(0);
    setDuration(durations[cur] || 0);
    if (pendingPlayRef.current) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  // Audio element listeners (ended advances to the next track)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      setCurrentTime(a.currentTime);
      if (a.duration && isFinite(a.duration)) setDuration(a.duration);
    };
    const onMeta = () => setDuration(a.duration);
    const onEnded = () => selectSong((curRef.current + 1) % SONGS.length, true);
    const onError = () => { setPlaying(false); toast("could not play that file"); };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
    };
  }, [selectSong, toast]);

  // Keep the audio element volume in sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Probe every track's real duration once
  useEffect(() => {
    const probes = SONGS.map((s, i) => {
      const probe = new Audio();
      probe.preload = "metadata";
      probe.src = s.src;
      const onMeta = () => setDurations((d) => ({ ...d, [i]: probe.duration }));
      probe.addEventListener("loadedmetadata", onMeta);
      return probe;
    });
    return () => probes.forEach((p) => { p.src = ""; });
  }, []);

  const onTrackClick = (i) => {
    if (i === cur) { playing ? pause() : play(); }
    else selectSong(i, true);
  };

  const onScrub = (e) => {
    const a = audioRef.current;
    if (!a || !a.duration || !isFinite(a.duration)) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * a.duration;
  };

  const onVolInput = (e) => {
    const v = Number(e.target.value) / 100;
    if (v > 0) lastVolRef.current = v;
    setVolume(v);
  };
  const toggleMute = () => setVolume((v) => (v === 0 ? lastVolRef.current : 0));

  // Copy handler (data-copy links), mood pill, konami are wired below
  const onCopy = (val) => {
    navigator.clipboard?.writeText(val).then(() => toast("copied — " + val));
  };

  // ── gate / dream meter ────────────────────────────────────────────────
  const openGate = () => {
    if (gateGone) return;
    setGateGone(true);
    play();
    setTimeout(() => {
      let v = 0;
      meterTimerRef.current = setInterval(() => {
        v += 3;
        if (v >= 100) { v = 100; clearInterval(meterTimerRef.current); }
        setMeterP(v);
      }, 55);
    }, 700);
    drawDeco();
  };

  // ── about modal ───────────────────────────────────────────────────────
  const openAbout = () => setModalOpen(true);
  const closeAbout = () => setModalOpen(false);
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  // ── the decorative °*·♪ line — redrawn to fit its own width ────────────
  const drawDeco = useCallback(() => {
    const deco = decoRef.current;
    if (!deco) return;
    const w = deco.clientWidth;
    if (!w) return;
    const probe = document.createElement("span");
    probe.style.cssText = "visibility:hidden;position:absolute;white-space:pre";
    probe.textContent = "-".repeat(100);
    deco.textContent = "";
    deco.appendChild(probe);
    const chw = probe.getBoundingClientRect().width / 100;
    probe.remove();
    const fill = Math.max(3, Math.floor(w / chw) - DECO_L.length - DECO_R.length - 1);
    deco.textContent = DECO_L + "-".repeat(fill) + DECO_R;
  }, []);

  useEffect(() => {
    drawDeco();
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(drawDeco, 120); };
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(drawDeco);
    return () => { clearTimeout(t); window.removeEventListener("resize", onResize); };
  }, [drawDeco]);

  // ── magik border + ghost eye tracking ─────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll(".magik")];
    const eyes = [...root.querySelectorAll(".eye")];
    const gw = ghostWrapRef.current;
    const PROX = 200;
    let px = -9999, py = -9999, queued = false;

    const paint = () => {
      queued = false;
      for (const c of cards) {
        const r = c.getBoundingClientRect();
        if (r.bottom < -PROX || r.top > innerHeight + PROX) { c.style.setProperty("--on", 0); continue; }
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const ang = (Math.atan2(py - cy, px - cx) * 180 / Math.PI + 90 + 360) % 360;
        const dx = Math.max(r.left - px, 0, px - r.right);
        const dy = Math.max(r.top - py, 0, py - r.bottom);
        const dist = Math.hypot(dx, dy);
        c.style.setProperty("--a", ang.toFixed(1));
        c.style.setProperty("--on", dist > PROX ? 0 : (1 - dist / PROX).toFixed(3));
      }
      if (gw) {
        const r = gw.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const a = Math.atan2(py - cy, px - cx);
        const d = Math.min(Math.hypot(px - cx, py - cy) / 26, 1);
        const ox = Math.cos(a) * 5 * d, oy = Math.sin(a) * 4 * d;
        eyes.forEach((el) => (el.style.transform = `translate(${ox.toFixed(2)}px,${oy.toFixed(2)}px)`));
      }
    };
    const request = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
    const onMove = (e) => { px = e.clientX; py = e.clientY; request(); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", request, { passive: true });
    // also repaint when the scrolling pane moves
    const pane = root.querySelector(".pane");
    pane?.addEventListener("scroll", request, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", request);
      pane?.removeEventListener("scroll", request);
    };
  }, []);

  // ── starfield canvas ──────────────────────────────────────────────────
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let stars = [], W = 0, H = 0, raf;

    const sizeStars = () => {
      W = cv.width = innerWidth * DPR;
      H = cv.height = innerHeight * DPR;
      cv.style.width = innerWidth + "px";
      cv.style.height = innerHeight + "px";
      stars = Array.from({ length: Math.round((innerWidth * innerHeight) / 13000) }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: (Math.random() * 1.5 + 0.4) * DPR,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.9 + 0.25,
        dy: (Math.random() * 0.16 + 0.03) * DPR,
      }));
    };
    sizeStars();
    window.addEventListener("resize", sizeStars);

    const twinkle = () => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        s.tw += 0.014 * s.sp;
        s.y -= s.dy;
        if (s.y < -4) { s.y = H + 4; s.x = Math.random() * W; }
        const a = (Math.sin(s.tw) * 0.5 + 0.5) * 0.6 + 0.12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233,226,255,${a.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(twinkle);
    };
    twinkle();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", sizeStars); };
  }, []);

  // ── scroll reveal (.rise -> .seen) ────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("seen"); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    root.querySelectorAll(".rise").forEach((n, i) => {
      n.style.transitionDelay = i * 80 + "ms";
      io.observe(n);
    });
    return () => io.disconnect();
  }, []);

  // ── konami — dream mode ───────────────────────────────────────────────
  useEffect(() => {
    let seq = [];
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
      seq.push(e.key);
      seq = seq.slice(-KONAMI.length);
      if (seq.join() === KONAMI.join()) {
        document.documentElement.style.setProperty("--lav-hot", "#ffd6f5");
        document.documentElement.style.setProperty("--pink", "#b6f5e8");
        toast("dream mode 🤍");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast]);

  // cleanup timers
  useEffect(() => () => {
    clearTimeout(toastTimerRef.current);
    clearInterval(meterTimerRef.current);
  }, []);

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const tint = { "--tint-a": song.tint[0], "--tint-b": song.tint[1] };

  const socialAttrs = (s) =>
    s.copy
      ? { href: "#", onClick: (e) => { e.preventDefault(); onCopy(s.copy); } }
      : { href: s.href, target: "_blank", rel: "noopener" };

  return (
    <div ref={rootRef} className="white-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        /* Tokens — dream purple, lavender cloud, pastel pink, ghost white */
        .white-root{
          --night:#191527; --deep:#241f38; --plum:#2f2850;
          --card:rgba(58,49,94,.46); --card-hi:rgba(72,61,116,.62);
          --lav:#a99ce8; --lav-hot:#c3b6ff; --pink:#e8b6d4; --mint:#7fe0bd; --ghost:#fdfdff;
          --ink:#f4f2ff; --muted:rgba(244,242,255,.62); --faint:rgba(244,242,255,.36);
          --line:rgba(244,242,255,.13);
          --r:18px; --rail:clamp(300px,29vw,386px);
          --font:'Space Grotesk',ui-sans-serif,system-ui,sans-serif;
          --mono:'Space Mono',ui-monospace,monospace;
          position:relative; min-height:100vh; width:100%;
          background:var(--night); color:var(--ink); font-family:var(--font);
          -webkit-font-smoothing:antialiased; overflow-x:hidden;
        }
        .white-root *{box-sizing:border-box;margin:0;padding:0}
        .white-root a{color:inherit;text-decoration:none}
        .white-root button{font:inherit;color:inherit;background:none;border:none;cursor:pointer}
        .white-root ::selection{background:var(--lav);color:#1a1428}
        .pane::-webkit-scrollbar{width:6px}
        .pane::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:99px}

        /* Dream sky + drifting clouds */
        .sky{position:fixed;inset:0;z-index:0;pointer-events:none;
          background:
            radial-gradient(120% 90% at 18% 0%,#4b3f7d 0%,transparent 58%),
            radial-gradient(110% 80% at 88% 12%,#6d5a9e 0%,transparent 54%),
            radial-gradient(90% 70% at 50% 100%,#3a2f5e 0%,transparent 62%),
            linear-gradient(180deg,#2b2447 0%,#211c33 55%,#191527 100%);}
        .cloud{position:fixed;z-index:0;pointer-events:none;border-radius:50%;
          filter:blur(46px);opacity:.5;left:0;animation:drift linear infinite;}
        @keyframes drift{from{transform:translateX(-32vw)}to{transform:translateX(122vw)}}
        .stars{position:fixed;inset:0;z-index:1;pointer-events:none}

        /* Gate */
        .gate{position:fixed;inset:0;z-index:220;display:grid;place-items:center;
          background:rgba(25,21,39,.9);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          cursor:pointer;transition:opacity .85s ease,visibility .85s;}
        .gate.gone{opacity:0;visibility:hidden;pointer-events:none}
        .gate-in{display:flex;flex-direction:column;align-items:center;gap:20px}
        .gate-word{font-family:var(--mono);font-size:11.5px;letter-spacing:.36em;
          text-transform:uppercase;color:var(--faint);animation:pulse 2.4s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
        .shell{filter:blur(15px);opacity:0;transition:filter 1.1s ease,opacity 1.1s ease}
        .shell.in{filter:none;opacity:1}

        /* Magik border — cursor-tracked conic edge */
        .magik{--a:0;--on:0;--spread:115;position:relative;isolation:isolate;border-radius:var(--r);
          background:var(--card);border:1px solid var(--line);
          backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
          transition:background .35s ease,transform .4s cubic-bezier(.16,1,.3,1);}
        .magik::after{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;
          border-radius:inherit;padding:1px;
          background:conic-gradient(from calc((var(--a) - var(--spread)*.5)*1deg),
            transparent 0deg,var(--lav-hot),var(--pink),var(--mint),
            transparent calc(var(--spread)*1deg));
          -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
                  mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
          -webkit-mask-composite:xor;mask-composite:exclude;opacity:var(--on);transition:opacity .5s ease;}
        .magik::before{content:"";position:absolute;inset:-3px;z-index:0;pointer-events:none;
          border-radius:inherit;
          background:conic-gradient(from calc((var(--a) - var(--spread)*.5)*1deg),
            transparent 0deg,var(--lav),var(--pink),transparent calc(var(--spread)*1deg));
          filter:blur(20px);opacity:calc(var(--on)*.55);transition:opacity .5s ease;}
        .magik > *{position:relative;z-index:3}

        /* Layout */
        .shell{position:relative;z-index:10;display:flex;min-height:100vh}
        .rail{width:var(--rail);flex-shrink:0;position:sticky;top:0;height:100vh;
          display:flex;flex-direction:column;justify-content:center;
          padding:40px 34px;border-right:1px solid var(--line);
          background:linear-gradient(180deg,rgba(25,21,39,.2),rgba(25,21,39,.55));
          backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);}

        .ghost-wrap{position:relative;width:118px;height:118px;margin-bottom:22px}
        .ghost-halo{position:absolute;inset:-12px;border-radius:50%;
          background:conic-gradient(from 0deg,var(--lav-hot),var(--pink),var(--mint),var(--lav-hot));
          filter:blur(11px);opacity:.65;animation:spin 9s linear infinite;}
        @keyframes spin{to{transform:rotate(1turn)}}
        .ghost{position:relative;width:100%;height:100%;animation:bob 4.6s ease-in-out infinite;
          transition:transform .4s cubic-bezier(.16,1,.3,1);}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .ghost-wrap:hover .ghost{transform:scale(1.06) rotate(-4deg)}
        .ghost svg{width:100%;height:100%;display:block;filter:drop-shadow(0 8px 22px rgba(0,0,0,.4))}
        .eye{transition:transform .12s ease-out}
        .status-dot{position:absolute;right:6px;bottom:6px;z-index:5;width:26px;height:26px;
          border-radius:50%;background:var(--night);border:5px solid var(--night);display:grid;place-items:center;}
        .status-dot i{width:11px;height:11px;border-radius:50%;background:#8b8fa3;display:block}
        .zzz{position:absolute;font-family:var(--mono);font-weight:700;color:var(--lav-hot);
          opacity:0;pointer-events:none;animation:zfloat 4.4s ease-in-out infinite}
        @keyframes zfloat{0%{opacity:0;transform:translate(0,0) rotate(0) scale(.7)}
          22%{opacity:.85}100%{opacity:0;transform:translate(30px,-52px) rotate(18deg) scale(1.15)}}

        .name{font-size:clamp(46px,6.4vw,68px);font-weight:700;letter-spacing:-.045em;line-height:.98;
          background:linear-gradient(100deg,var(--ghost) 8%,var(--lav-hot) 46%,var(--pink));
          background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;
          animation:flow 9s ease infinite;user-select:none;cursor:default;}
        @keyframes flow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        .handles{margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;
          font-family:var(--mono);font-size:12px;color:var(--muted);}
        .tag{padding:3px 9px;border-radius:99px;font-size:11px;background:rgba(169,156,232,.16);
          border:1px solid rgba(169,156,232,.3);color:var(--lav-hot);}
        .dot-sep{opacity:.4}
        .bio{margin-top:16px;font-size:14px;line-height:1.65;color:var(--muted)}
        .bio b{color:var(--ink);font-weight:600}
        .plaque{margin-top:18px;padding:12px 15px;border-radius:12px;
          background:rgba(169,156,232,.12);border:1px solid rgba(169,156,232,.22);
          font-family:var(--mono);font-size:12.5px;line-height:1.7;color:var(--lav-hot);}
        .plaque span{display:block}
        .plaque span::before{content:"› ";opacity:.55}
        .mood{margin-top:14px;display:inline-flex;align-items:center;gap:8px;padding:9px 14px;
          border-radius:99px;align-self:flex-start;background:rgba(244,242,255,.06);
          border:1px solid var(--line);font-size:12.5px;color:var(--muted);
          transition:transform .3s cubic-bezier(.16,1,.3,1),background .3s;}
        .mood:hover{transform:translateY(-2px);background:rgba(244,242,255,.1)}
        .rail-social{display:flex;gap:8px;margin-top:20px;flex-wrap:wrap}
        .ico{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;
          background:rgba(244,242,255,.05);border:1px solid var(--line);color:var(--muted);
          transition:transform .3s cubic-bezier(.16,1,.3,1),background .3s,color .3s,border-color .3s;}
        .ico:hover{transform:translateY(-5px) scale(1.08) rotate(-6deg);
          background:var(--lav-hot);color:#241f38;border-color:var(--lav-hot)}
        .ico svg{width:17px;height:17px}

        /* Pane / bento */
        .pane{flex:1;min-width:0;height:100vh;overflow-y:auto;padding:38px 40px 80px}
        .bento{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;align-content:start;}
        .b-hero{grid-column:span 6}
        .b-half{grid-column:span 3}
        @media (max-width:1180px){.b-half{grid-column:span 6}}
        .card{padding:20px}
        .card:hover{background:var(--card-hi)}
        .c-label{font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;
          color:var(--faint);margin-bottom:12px;display:flex;align-items:center;gap:7px;}
        .c-label::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--lav-hot)}

        /* Song card */
        .song{position:relative;overflow:hidden;padding:0;--tint-a:#1f6f5c;--tint-b:#123f45;}
        .song-bg{position:absolute;inset:0;z-index:0;
          background:linear-gradient(115deg,var(--tint-a),var(--tint-b) 62%,#1a1830);
          opacity:.85;transition:background .8s ease;}
        .song-bg::after{content:"";position:absolute;inset:0;
          background:radial-gradient(90% 120% at 88% 50%,rgba(255,255,255,.14),transparent 60%);}
        .song-in{position:relative;z-index:3;display:flex;align-items:center;gap:20px;padding:22px 24px}
        .song-meta{flex:1;min-width:0}
        .song-title{display:flex;align-items:center;gap:10px;font-size:21px;font-weight:700;
          letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .song-title .sp{width:20px;height:20px;flex-shrink:0;color:#1ed760}
        .song-sub{margin-top:5px;font-size:13.5px;color:rgba(255,255,255,.74);line-height:1.5}
        .song-sub b{color:#fff;font-weight:600}
        .bar{margin-top:14px;height:4px;border-radius:99px;background:rgba(255,255,255,.22);
          overflow:hidden;cursor:pointer;}
        .bar-fill{height:100%;width:0%;border-radius:99px;
          background:linear-gradient(90deg,#1ed760,#6ee7a8);transition:width .25s linear;}
        .times{margin-top:7px;display:flex;justify-content:space-between;align-items:center;gap:12px;
          font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.7);}
        .vol{display:flex;align-items:center;gap:7px;opacity:.72;transition:opacity .25s}
        .vol:hover{opacity:1}
        .vol button{display:grid;place-items:center;padding:0;color:#fff;cursor:pointer}
        .vol svg{width:14px;height:14px;display:block}
        .vol-range{-webkit-appearance:none;appearance:none;width:68px;height:3px;border-radius:99px;
          cursor:pointer;background:rgba(255,255,255,.3);outline:none;}
        .vol-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:10px;height:10px;
          border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.45);}
        .vol-range::-moz-range-thumb{width:10px;height:10px;border:0;border-radius:50%;background:#fff;
          box-shadow:0 1px 4px rgba(0,0,0,.45);}
        @media (max-width:520px){.vol-range{width:48px}}
        .art{position:relative;width:96px;height:96px;flex-shrink:0;border-radius:12px;overflow:hidden;
          box-shadow:0 10px 30px rgba(0,0,0,.45);background:linear-gradient(140deg,var(--tint-a),var(--tint-b));
          display:grid;place-items:center;transition:background .8s ease;}
        .art img{width:100%;height:100%;object-fit:cover;display:block}
        .art-play{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.3);
          opacity:0;transition:opacity .3s,background .3s;}
        .song.playing .art-play{opacity:.72}
        .art:hover .art-play{opacity:1;background:rgba(0,0,0,.45)}
        .art-play svg{width:26px;height:26px;color:#fff;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))}
        .eq{display:flex;align-items:flex-end;gap:2.5px;height:15px;flex-shrink:0}
        .eq i{width:3px;border-radius:2px;background:#1ed760;height:30%}
        .song.playing .eq i{animation:bounce .9s ease-in-out infinite}
        .eq i:nth-child(1){animation-delay:0s}
        .eq i:nth-child(2){animation-delay:.22s}
        .eq i:nth-child(3){animation-delay:.44s}
        .eq i:nth-child(4){animation-delay:.12s}
        @keyframes bounce{0%,100%{height:25%}50%{height:100%}}

        /* Playlist */
        .track{display:flex;align-items:center;gap:12px;padding:10px 11px;border-radius:12px;
          cursor:pointer;transition:background .25s,transform .25s cubic-bezier(.16,1,.3,1);}
        .track:hover{background:rgba(244,242,255,.07);transform:translateX(4px)}
        .track.on{background:rgba(169,156,232,.16)}
        .track-n{font-family:var(--mono);font-size:11px;color:var(--faint);width:16px;flex-shrink:0;}
        .track.on .track-n{color:var(--lav-hot)}
        .track-art{width:36px;height:36px;border-radius:8px;flex-shrink:0;object-fit:cover;display:block;
          box-shadow:0 3px 10px rgba(0,0,0,.3);}
        .track-meta{min-width:0;flex:1}
        .track-t{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .track-a{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .track-d{font-family:var(--mono);font-size:11px;color:var(--faint);flex-shrink:0}

        /* About tile */
        .about-tile{display:flex;align-items:center;gap:16px;padding:22px;cursor:pointer;width:100%;text-align:left;}
        .about-tile:hover{background:var(--card-hi);transform:translateY(-3px)}
        .blob{width:52px;height:52px;flex-shrink:0;display:grid;place-items:center;
          background:rgba(244,242,255,.09);color:var(--ink);
          border-radius:44% 56% 52% 48% / 50% 44% 56% 50%;
          transition:background .5s,color .5s,border-radius .9s ease,transform .5s;}
        .blob svg{width:25px;height:25px}
        .about-tile:hover .blob{background:var(--lav-hot);color:#241f38;transform:rotate(8deg);
          border-radius:56% 44% 46% 54% / 44% 56% 44% 56%;}
        .at-t{font-size:17px;font-weight:700}
        .at-d{font-size:12.5px;color:var(--muted);margin-top:2px}
        .at-go{margin-left:auto;color:var(--faint);transition:transform .3s,color .3s}
        .about-tile:hover .at-go{transform:translateX(4px);color:var(--lav-hot)}

        /* Dreaming status */
        .dream{position:relative;overflow:hidden;display:flex;flex-direction:column;min-height:172px}
        .dream-mid{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:auto 0 15px;flex-wrap:wrap;}
        .dream-t{display:flex;align-items:center;gap:9px;font-size:23px;font-weight:700}
        .dream-word{background:linear-gradient(100deg,var(--pink),var(--lav-hot) 48%,var(--mint));
          background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;
          animation:flow 6s ease infinite;}
        .beat{display:inline-block;font-size:17px;animation:beat 1.5s ease-in-out infinite}
        .beat:last-child{animation-delay:.14s}
        @keyframes beat{0%,100%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}
          42%{transform:scale(1.16)}56%{transform:scale(1)}}
        .dream-p{font-family:var(--mono);font-weight:700;font-size:31px;line-height:1;color:var(--lav-hot);
          letter-spacing:-.02em;text-shadow:0 0 24px rgba(195,182,255,.55);animation:glowpulse 3.2s ease-in-out infinite;}
        .dream-p .pct{font-size:16px;opacity:.6;margin-left:1px}
        @keyframes glowpulse{0%,100%{text-shadow:0 0 20px rgba(195,182,255,.4)}
          50%{text-shadow:0 0 30px rgba(232,182,212,.75)}}

        .dream-hearts{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;border-radius:inherit}
        .dream-hearts span{position:absolute;bottom:-18px;opacity:0;animation:heartrise linear infinite;}
        @keyframes heartrise{0%{opacity:0;transform:translateY(0) scale(.55) rotate(0)}
          18%{opacity:.5}100%{opacity:0;transform:translateY(-185px) scale(1.05) rotate(24deg)}}
        .spark-field{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;border-radius:inherit}
        .spark-field i{position:absolute;font-style:normal;color:var(--lav-hot);opacity:0;
          text-shadow:0 0 9px rgba(195,182,255,.75);animation:sparkbreathe ease-in-out infinite;}
        @keyframes sparkbreathe{0%,100%{opacity:0;transform:scale(.4) rotate(0deg)}
          40%{opacity:.6;transform:scale(1.15) rotate(95deg)}70%{opacity:.22;transform:scale(.85) rotate(140deg)}}
        .note-field{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;border-radius:inherit}
        .note-field i{position:absolute;font-style:normal;color:var(--mint);opacity:0;animation:notesway linear infinite;}
        @keyframes notesway{0%{opacity:0;transform:translate(0,0) rotate(-10deg)}14%{opacity:.34}
          35%{transform:translate(15px,-52px) rotate(8deg)}62%{transform:translate(-9px,-104px) rotate(-7deg)}
          86%{opacity:.12}100%{opacity:0;transform:translate(12px,-168px) rotate(10deg)}}
        .meter{height:7px;border-radius:99px;background:rgba(244,242,255,.12);overflow:hidden}
        .meter-fill{height:100%;width:0;border-radius:99px;
          background:linear-gradient(90deg,var(--pink),var(--lav-hot),var(--mint));background-size:200% 100%;
          animation:flow 4s ease infinite;transition:width 2s cubic-bezier(.16,1,.3,1);}
        .meter-deco{margin-top:9px;font-family:var(--mono);font-size:10.5px;color:var(--faint);
          letter-spacing:.05em;white-space:nowrap;overflow:hidden;}

        /* Favourite / Mahiru */
        .waifu{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;min-height:300px;}
        .waifu .waifu-vid{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:cover;
          object-position:50% 6%;transform:scale(1.06);transition:transform 1.1s cubic-bezier(.16,1,.3,1);}
        .waifu:hover .waifu-vid{transform:scale(1.12)}
        .waifu .waifu-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;
          background:linear-gradient(180deg,rgba(25,21,39,.62) 0%,rgba(25,21,39,.12) 38%,rgba(25,21,39,.88) 100%);}
        .waifu .c-label{position:absolute;top:20px;left:20px;margin:0;z-index:3}
        .waifu .waifu-kanji{position:absolute;right:16px;bottom:14px;z-index:2;
          font-size:clamp(64px,7vw,96px);font-weight:700;line-height:1;letter-spacing:-.04em;
          color:rgba(255,255,255,.16);user-select:none;pointer-events:none;
          text-shadow:0 4px 20px rgba(0,0,0,.3);transition:transform .6s cubic-bezier(.16,1,.3,1),color .6s;}
        .waifu:hover .waifu-kanji{transform:rotate(-4deg) scale(1.05);color:rgba(232,182,212,.3)}
        .waifu-body{position:relative;z-index:3;padding-top:6px}
        .wing-inline{height:1.25em;width:auto;vertical-align:-.22em;margin-left:2px;
          filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));}
        .waifu-t{font-size:20px;font-weight:700;text-shadow:0 2px 12px rgba(0,0,0,.5)}
        .waifu-s{font-size:12.5px;color:rgba(244,242,255,.8);margin-top:3px;text-shadow:0 2px 10px rgba(0,0,0,.5)}

        /* Socials in bento */
        .links{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:11px}
        .link{display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:13px;
          background:rgba(244,242,255,.04);border:1px solid var(--line);
          transition:background .3s,transform .3s cubic-bezier(.16,1,.3,1)}
        .link:hover{background:rgba(244,242,255,.09);transform:translateY(-3px)}
        .link .ico{pointer-events:none;width:34px;height:34px}
        .link:hover .ico{transform:none;background:var(--lav-hot);color:#241f38;border-color:var(--lav-hot)}
        .link-t{font-size:13.5px;font-weight:600}
        .link-h{font-family:var(--mono);font-size:11px;color:var(--faint)}

        .white-foot{margin-top:22px;padding-top:20px;border-top:1px solid var(--line);
          font-family:var(--mono);font-size:11px;color:var(--faint);
          display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;}

        /* About modal */
        .modal{position:fixed;inset:0;z-index:180;display:grid;place-items:center;padding:26px;
          background:rgba(18,15,29,.72);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
          opacity:0;visibility:hidden;transition:opacity .4s ease,visibility .4s;}
        .modal.open{opacity:1;visibility:visible}
        .sheet{width:min(620px,100%);max-height:82vh;overflow-y:auto;padding:34px;border-radius:22px;
          background:linear-gradient(165deg,rgba(64,54,104,.96),rgba(37,31,59,.98));
          border:1px solid rgba(195,182,255,.24);box-shadow:0 30px 80px rgba(0,0,0,.55);
          transform:translateY(26px) scale(.97);transition:transform .45s cubic-bezier(.16,1,.3,1);}
        .modal.open .sheet{transform:none}
        .sheet::-webkit-scrollbar{width:5px}
        .sheet::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:99px}
        .sheet-top{display:flex;align-items:flex-start;gap:16px;margin-bottom:22px}
        .sheet h2{font-size:27px;font-weight:700;letter-spacing:-.025em}
        .sheet-sub{font-family:var(--mono);font-size:11px;color:var(--faint);
          letter-spacing:.15em;text-transform:uppercase;margin-top:4px}
        .x{margin-left:auto;width:36px;height:36px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;
          background:rgba(244,242,255,.08);color:var(--muted);transition:background .25s,color .25s,transform .25s;}
        .x:hover{background:var(--pink);color:#241f38;transform:rotate(90deg)}
        .sheet p{font-size:14.5px;line-height:1.8;color:var(--muted);margin-bottom:14px}
        .sheet p:last-child{margin-bottom:0}
        .sheet strong{color:var(--ink);font-weight:600}
        .hl{background:linear-gradient(90deg,var(--lav-hot),var(--pink));
          -webkit-background-clip:text;background-clip:text;color:transparent;font-weight:600;}
        .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:22px 0 4px;}
        .fact{padding:13px;border-radius:13px;background:rgba(244,242,255,.05);border:1px solid var(--line)}
        .fact-k{font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
        .fact-v{font-size:14px;font-weight:600;margin-top:4px}

        /* Toast */
        .toast{position:fixed;left:50%;bottom:26px;transform:translate(-50%,20px);z-index:250;
          padding:10px 18px;border-radius:99px;background:var(--lav-hot);color:#241f38;
          font-family:var(--mono);font-size:11px;opacity:0;pointer-events:none;transition:opacity .3s,transform .3s;}
        .toast.on{opacity:1;transform:translate(-50%,0)}

        .rise{opacity:0;transform:translateY(24px);
          transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
        .rise.seen{opacity:1;transform:none}

        @media (max-width:900px){
          .shell{flex-direction:column}
          .rail{width:100%;height:auto;position:relative;padding:48px 24px 32px;
            border-right:none;border-bottom:1px solid var(--line);justify-content:flex-start}
          .pane{height:auto;overflow:visible;padding:26px 24px 70px}
          .song-in{flex-direction:column;align-items:flex-start;gap:16px}
          .art{width:100%;height:180px}
        }
        @media (max-width:430px){
          .rail{padding:40px 18px 26px}
          .pane{padding:22px 18px 64px}
          .sheet{padding:24px}
        }
        @media (prefers-reduced-motion:reduce){
          .white-root *,.white-root *::before,.white-root *::after{animation:none !important;transition-duration:.01ms !important}
          .rise{opacity:1;transform:none}
          .shell{filter:none;opacity:1}
        }
      `}</style>

      <div className="sky" />
      <canvas ref={canvasRef} className="stars" />

      {CLOUDS.map(([col, size, dur, top, delay], i) => (
        <div key={i} className="cloud" style={{
          background: col, width: size, height: size * 0.55,
          top: `${top}vh`, animationDuration: `${dur}s`, animationDelay: `${delay}s`,
        }} />
      ))}

      <div className={`gate${gateGone ? " gone" : ""}`} onClick={openGate}>
        <div className="gate-in">
          <div className="gate-word">click to wake up</div>
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" />

      <div ref={shellRef} className={`shell${gateGone ? " in" : ""}`}>

        {/* ── RAIL ── */}
        <aside className="rail">
          <div className="ghost-wrap" ref={ghostWrapRef}>
            <div className="ghost-halo" />
            <div className="ghost">
              <svg viewBox="0 0 120 120" aria-label="White">
                <circle cx="60" cy="60" r="56" fill="#fdfdff" />
                <g>
                  <ellipse className="eye" cx="45" cy="54" rx="8.5" ry="15" fill="#17121f" />
                  <ellipse className="eye" cx="76" cy="54" rx="8.5" ry="15" fill="#17121f" />
                </g>
              </svg>
            </div>
            <div className="status-dot" title="invisible"><i /></div>
            <span className="zzz" style={{ right: -4, top: 6, fontSize: 13, animationDelay: "0s" }}>z</span>
            <span className="zzz" style={{ right: 2, top: 14, fontSize: 10, animationDelay: "1.5s" }}>z</span>
            <span className="zzz" style={{ right: -8, top: 20, fontSize: 8, animationDelay: "3s" }}>z</span>
          </div>

          <h1 className="name">White</h1>

          <div className="handles">
            <span>white1ist</span>
            <span className="dot-sep">•</span>
            <span className="tag">Dreaming</span>
          </div>

          <p className="bio">
            Hello call me <b>White</b>.<br />
            I usually sleep in the morning.
          </p>

          <div className="plaque">
            <span>Wake up</span>
            <span>Keep dreaming</span>
          </div>

          <div className="mood" onClick={() => toast("you can't. that's the point. 🤍")}>
            <span>it's quiet in here. it always has been.</span>
          </div>

          <div className="rail-social">
            {SOCIALS.map((s) => (
              <a key={s.title} className="ico" title={s.title} {...socialAttrs(s)}
                 dangerouslySetInnerHTML={{ __html: ICONS[s.icon] || "" }} />
            ))}
          </div>
        </aside>

        {/* ── BENTO ── */}
        <main className="pane">
          <div className="bento">

            {/* song */}
            <div className={`magik song b-hero rise${playing ? " playing" : ""}`} style={tint}>
              <div className="song-bg" />
              <div className="song-in">
                <div className="art" style={tint}>
                  <img src={song.art} alt={`${song.title} cover`} />
                  <div className="art-play" onClick={(e) => { e.stopPropagation(); playing ? pause() : play(); }}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      {playing ? (
                        <>
                          <rect x="6" y="5" width="4" height="14" rx="1" />
                          <rect x="14" y="5" width="4" height="14" rx="1" />
                        </>
                      ) : (
                        <path d="M8 5v14l11-7z" />
                      )}
                    </svg>
                  </div>
                </div>
                <div className="song-meta">
                  <div className="song-title">
                    <svg className="sp" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
                    </svg>
                    <span>{song.title}</span>
                    <span className="eq"><i /><i /><i /><i /></span>
                  </div>
                  <div className="song-sub">
                    by <b>{song.artist}</b><br />
                    on <b>{song.album}</b>
                  </div>
                  <div className="bar" onClick={onScrub}>
                    <div className="bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="times">
                    <span>{mmss(currentTime)}</span>
                    <span className="vol">
                      <button aria-label="Mute" onClick={toggleMute}>
                        <SpeakerIcon muted={volume === 0} />
                      </button>
                      <input className="vol-range" type="range" min="0" max="100"
                             value={Math.round(volume * 100)} onChange={onVolInput} aria-label="Volume" />
                    </span>
                    <span>{mmss(duration || durations[cur] || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* about */}
            <button className="magik about-tile b-half rise" onClick={openAbout}>
              <span className="spark-field">
                {SPARKS.map(([g, l, t, size, delay, dur], i) => (
                  <i key={i} style={{ left: `${l}%`, top: `${t}%`, fontSize: size,
                    animationDelay: `${delay}s`, animationDuration: `${dur}s` }}>{g}</i>
                ))}
              </span>
              <span className="blob">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8.2" r="3.6" />
                  <path d="M4.8 19.4a7.2 7.2 0 0 1 14.4 0" />
                </svg>
              </span>
              <span>
                <span className="at-t">About me</span>
                <span className="at-d" style={{ display: "block" }}>the whole thing. click me.</span>
              </span>
              <span className="at-go">→</span>
            </button>

            {/* dreaming meter */}
            <div className="magik card dream b-half rise">
              <div className="dream-hearts">
                {HEARTS.map(([e, left, size, delay, dur], i) => (
                  <span key={i} style={{ left: `${left}%`, fontSize: size,
                    animationDelay: `${delay}s`, animationDuration: `${dur}s` }}>{e}</span>
                ))}
              </div>
              <div className="c-label">status</div>
              <div className="dream-mid">
                <div className="dream-t">
                  <span className="beat">💜</span>
                  <span className="dream-word">Dreaming</span>
                  <span className="beat">💜</span>
                </div>
                <div className="dream-p"><span>{meterP}</span><span className="pct">%</span></div>
              </div>
              <div className="meter"><div className="meter-fill" style={{ width: gateGone ? "100%" : 0 }} /></div>
              <div className="meter-deco" ref={decoRef} />
            </div>

            {/* playlist */}
            <div className="magik card b-half rise">
              <div className="note-field">
                {NOTES.map(([g, l, t, size, delay, dur], i) => (
                  <i key={i} style={{ left: `${l}%`, top: `${t}%`, fontSize: size,
                    animationDelay: `${delay}s`, animationDuration: `${dur}s` }}>{g}</i>
                ))}
              </div>
              <div className="c-label">on repeat</div>
              <div>
                {SONGS.map((s, i) => (
                  <div key={i} className={`track${i === cur ? " on" : ""}`} onClick={() => onTrackClick(i)}>
                    <span className="track-n">{i + 1}</span>
                    <img className="track-art" src={s.art} alt="" loading="lazy" />
                    <span className="track-meta">
                      <span className="track-t">{s.title}</span><br />
                      <span className="track-a">{s.artist}</span>
                    </span>
                    <span className="track-d">{durations[i] ? mmss(durations[i]) : "--:--"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* favourite character */}
            <div className="magik card waifu b-half rise">
              <video className="waifu-vid" src="/images/67667.webm" autoPlay loop muted playsInline preload="auto" />
              <div className="waifu-scrim" />
              <div className="c-label">favourite</div>
              <div className="waifu-kanji">天使</div>
              <div className="waifu-body">
                <div className="waifu-t">Mahiru Shiina</div>
                <div className="waifu-s">椎名真昼 <img className="wing-inline" src="/images/wing-marry.gif" alt="wing" /></div>
              </div>
            </div>

            {/* socials */}
            <div className="magik card b-hero rise">
              <div className="c-label">elsewhere</div>
              <div className="links">
                {SOCIALS.map((s) => (
                  <a key={s.title} className="link" {...socialAttrs(s)}>
                    <span className="ico" dangerouslySetInnerHTML={{ __html: ICONS[s.icon] || "" }} />
                    <span>
                      <span className="link-t">{s.title}</span><br />
                      <span className="link-h">{s.handle}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>

          <footer className="white-foot">
            <span>© {new Date().getFullYear()} White — handmade, no framework.</span>
            <span>keep dreaming 🤍</span>
          </footer>
        </main>
      </div>

      {/* ── ABOUT MODAL ── */}
      <div className={`modal${modalOpen ? " open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) closeAbout(); }}>
        <div className="sheet" role="dialog" aria-modal="true" aria-label="About White">
          <div className="sheet-top">
            <div>
              <h2>About me</h2>
              <div className="sheet-sub">the long version</div>
            </div>
            <button className="x" aria-label="Close" onClick={closeAbout}>✕</button>
          </div>

          <p>
            Hello — call me <strong>White</strong>. I'm usually somewhere between
            awake and <span className="hl">not really</span>, which is where most of my
            good ideas happen anyway.
          </p>
          <p>
            I've been on Discord since 2018 and I've spent an unreasonable amount of
            that time in voice channels saying nothing. I'm bad at starting conversations and
            surprisingly fine once one exists.
          </p>
          <p>
            I like quiet things: pastel skies, songs that loop until they stop meaning
            anything, and characters who are kinder than they need to be. Music is
            basically load-bearing for me — check what's on repeat.
          </p>
          <p>
            Ask me anything. Worst case I read it and forget to reply. 🤍
          </p>

          <div className="facts">
            <div className="fact"><div className="fact-k">name</div><div className="fact-v">White</div></div>
            <div className="fact"><div className="fact-k">nick</div><div className="fact-v">Poom</div></div>
            <div className="fact"><div className="fact-k">birth</div><div className="fact-v">Dec 2005</div></div>
            <div className="fact"><div className="fact-k">status</div><div className="fact-v">Dreaming</div></div>
          </div>
        </div>
      </div>

      <div className={`toast${toastMsg ? " on" : ""}`}>{toastMsg}</div>
    </div>
  );
}
