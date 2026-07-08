import { useEffect, useRef, useState, useCallback } from "react";

// =============================================================================
// DEMO CONFIG — the default "beatmap" shown before a real one is loaded via
// the link box. Loaded maps replace this at runtime (see loadBeatmap below).
// =============================================================================
const DEFAULT_MAP = {
  title: "Uchouten Vivace",
  artist: "yuikonnu",
  mapper: "zaabokim",
  diff: "[Full Love]",
  stars: 5.19,
  keys: 4,
  bpm: 266,
  od: 8.6,
  hp: 8.4,
  ranked: false,
  cover: "/images/SuZuran QwQ.jpg",
};

// =============================================================================
// STYLE CONFIG — everything below is safe to tweak per-render
// =============================================================================
const STYLE = {
  fontFamily: "'Exo 2', 'Segoe UI', sans-serif",

  // Solid fill drawn behind the cover art so images with transparent
  // backgrounds don't show the scene through them.
  coverBgColor: "#2a2050",

  // Bar fills — a single color string or a top→bottom gradient stop list.
  odColors: ["#3ddc6b", "#00ff51"],
  hpColors: ["#e0384a", "#ff0019"],

  // Rotating ring cluster, anchored at screen center.
  ringInnerRadius: 190,
  ringStep: 145,
  ringCount: 4,

  // Two stacked frame borders drawn at the canvas edge.
  borderOuter: { width: 8, color: "#000000" },
  borderInner: { width: 5, colors: ["#c4b5fd", "#ed95ff", "#ff91ff"] },

  // Large triangle particles drifting upward, behind the rest of the scene.
  triangles: { count: 25, color: "196,181,253", minSize: 50, maxSize: 100 },
};

const W = 1280;
const H = 720;
const INTRO_MS = 750;
const FADE_IN_MS = 500;       // black screen fades in to the reveal at the very start
const STAGGER_DELAY_MS = 250; // bars + title wait this long after the cover starts, then fade/slide in together
const STAGGER_MS = 800;
const FADE_START_MS = 6000;   // reveal holds until this point, then fades out
const FADE_DURATION_MS = 900;
const HOLD_BLACK_MS = 500;    // stay on black before the recording stops
const RECORD_MS = FADE_START_MS + FADE_DURATION_MS + HOLD_BLACK_MS;

const BG_MAIN = "#0c0a1a";
const ACCENT = "#c4b5fd";
const GOLD = "#f2b33d";
const GREEN = "#3ddc6b";

// Card layout shared between the draw loop and the offscreen sprite builders
const COVER_SIZE = 260;
const COVER_X = W / 2 - COVER_SIZE / 2;
const COVER_Y = 200;
const BAR_W = 22;
const BAR_H = 220;
const COVER_GLOW_PAD = 48; // room for the 28px blur halo around the cover border
const BAR_GLOW_PAD = 24;   // room for the 14px blur halo around the bar fill

const font = (weight, size) => `${weight} ${size}px ${STYLE.fontFamily}`;

function makeGradient(ctx, x0, y0, x1, y1, colors) {
  if (typeof colors === "string") return colors;
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c));
  return g;
}

function pickMimeType() {
  const candidates = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  for (const c of candidates) {
    if (window.MediaRecorder?.isTypeSupported?.(c)) return c;
  }
  return null;
}

// eased 0..1 -> 0..1
const easeOutBack = (x) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeInCubic = (x) => x * x * x;
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function drawTriangle(ctx, cx, cy, size) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size * 0.87, cy + size * 0.5);
  ctx.lineTo(cx - size * 0.87, cy + size * 0.5);
  ctx.closePath();
  ctx.fill();
}

// Draws img cropped to fill the dw×dh destination rect (CSS object-fit: cover),
// instead of stretching it to match the target aspect ratio.
function drawImageCover(ctx, img, dx, dy, dw, dh) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const targetRatio = dw / dh;
  const srcRatio = iw / ih;
  let sx, sy, sw, sh;
  if (srcRatio > targetRatio) {
    sh = ih;
    sw = ih * targetRatio;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = iw / targetRatio;
    sx = 0;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// =============================================================================
// Offscreen layers — built once, blitted per frame. Everything that used to be
// a per-frame gradient or shadowBlur lives here.
// =============================================================================
function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

// Opaque background: base radial gradient with the cover art blurred over it.
function buildBgLayer(coverImg) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 780);
  grad.addColorStop(0, "#1a1030");
  grad.addColorStop(1, BG_MAIN);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  if (coverImg) {
    // Downscale first so the blur has little work to do, overscan so the
    // blurred edges never show inside the frame.
    const small = makeCanvas(64, 64);
    const sctx = small.getContext("2d");
    sctx.fillStyle = STYLE.coverBgColor;
    sctx.fillRect(0, 0, 64, 64);
    drawImageCover(sctx, coverImg, 0, 0, 64, 64);
    ctx.save();
    ctx.filter = "blur(24px)";
    ctx.globalAlpha = 0.45;
    ctx.drawImage(small, -80, -80, W + 160, H + 160);
    ctx.restore();
    ctx.fillStyle = "rgba(12,10,26,0.5)";
    ctx.fillRect(0, 0, W, H);
  }
  return c;
}

function buildVignetteLayer() {
  const c = makeCanvas(W, H);
  const ctx = c.getContext("2d");
  const vg = ctx.createRadialGradient(W / 2, H / 2, 260, W / 2, H / 2, 760);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
  return c;
}

// Glow-only halo around the cover border. The stroke is drawn off-canvas with
// a shadow offset so only the shadow lands on the sprite — the crisp border
// itself is stroked per frame so pulsing the glow doesn't dim it.
function buildCoverGlowSprite() {
  const size = COVER_SIZE + COVER_GLOW_PAD * 2;
  const c = makeCanvas(size, size);
  const ctx = c.getContext("2d");
  ctx.shadowColor = "rgba(196,181,253,0.55)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetX = size;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 3;
  roundRect(ctx, COVER_GLOW_PAD - size, COVER_GLOW_PAD, COVER_SIZE, COVER_SIZE, 6);
  ctx.stroke();
  return c;
}

// Full-height glowing bar fill; the draw loop crops the visible bottom slice.
function buildBarGlowSprite(colors) {
  const c = makeCanvas(BAR_W + BAR_GLOW_PAD * 2, BAR_H + BAR_GLOW_PAD * 2);
  const ctx = c.getContext("2d");
  ctx.fillStyle = makeGradient(ctx, BAR_GLOW_PAD, BAR_GLOW_PAD, BAR_GLOW_PAD, BAR_GLOW_PAD + BAR_H, colors);
  ctx.shadowColor = typeof colors === "string" ? colors : colors[0];
  ctx.shadowBlur = 14;
  roundRect(ctx, BAR_GLOW_PAD, BAR_GLOW_PAD, BAR_W, BAR_H, 8);
  ctx.fill();
  return c;
}

// Shrinks the font size until text fits maxWidth (floor 16px), then sets ctx.font.
function fitFont(ctx, text, weight, baseSize, maxWidth) {
  ctx.font = font(weight, baseSize);
  const w = ctx.measureText(text).width;
  if (w > maxWidth) ctx.font = font(weight, Math.max(16, baseSize * (maxWidth / w)));
}

// =============================================================================
// Beatmap loading — data comes from the Mino mirror API (catboy.best) and
// covers/audio previews from osu!'s asset hosts, all routed through same-origin
// /osu-* proxy paths (vite server.proxy in dev, vercel.json rewrites in prod)
// so the canvas never taints and the preview audio can be recorded.
// =============================================================================
function parseBeatmapLink(text) {
  const s = text.trim();
  const set = s.match(/beatmapsets\/(\d+)/);
  const diff = s.match(/#\w+\/(\d+)/) || s.match(/\bbeatmaps\/(\d+)/) || s.match(/\/b\/(\d+)/);
  if (set) return { setId: +set[1], beatmapId: diff ? +diff[1] : null };
  if (diff) return { setId: null, beatmapId: +diff[1] };
  if (/^\d+$/.test(s)) return { setId: +s, beatmapId: null };
  return null;
}

async function fetchBeatmap({ setId, beatmapId }) {
  if (!setId) {
    // bare difficulty link — resolve its set first
    const res = await fetch(`/osu-api/v2/b/${beatmapId}`);
    if (!res.ok) throw new Error(`beatmap lookup failed (${res.status})`);
    setId = (await res.json()).beatmapset_id;
  }
  const res = await fetch(`/osu-api/v2/s/${setId}`);
  if (!res.ok) throw new Error(`beatmapset lookup failed (${res.status})`);
  const set = await res.json();
  const diffs = set.beatmaps || [];
  if (!diffs.length) throw new Error("beatmapset has no difficulties");
  const diff = diffs.find((b) => b.id === beatmapId)
    || [...diffs].sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0];
  return {
    title: set.title,
    artist: set.artist,
    mapper: diff.owners?.[0]?.username || set.creator,
    diff: `[${diff.version}]`,
    stars: diff.difficulty_rating,
    keys: diff.mode === "mania" ? Math.round(diff.cs) : null,
    bpm: Math.round(diff.bpm || set.bpm) || 120,
    od: diff.accuracy,
    hp: diff.drain,
    ranked: ["ranked", "approved", "qualified", "loved"].includes(set.status),
    statusText: set.status ? set.status[0].toUpperCase() + set.status.slice(1) : null,
    cover: `/osu-cover/beatmaps/${set.id}/covers/list@2x.jpg`,
    preview: `/osu-preview/${set.id}.mp3`,
  };
}

export default function OsuRenderPage() {
  const canvasRef = useRef(null);
  const coverImgRef = useRef(null);
  const rafRef = useRef(null);
  const animStartRef = useRef(0);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const drawRef = useRef(null);
  const layersRef = useRef(null);
  const recordingRef = useRef(false);
  const mapRef = useRef(DEFAULT_MAP);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioSrcNodeRef = useRef(null);
  const audioDestRef = useRef(null);

  const [mapData, setMapData] = useState(DEFAULT_MAP);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [coverReady, setCoverReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null); // { url, ext, size }
  const [mimeType] = useState(() => (typeof window !== "undefined" ? pickMimeType() : null));

  // Load the current map's cover (missing image still renders the card) and
  // rebuild the offscreen layers; runs on mount and whenever a beatmap loads.
  useEffect(() => {
    let cancelled = false;
    setCoverReady(false);
    const finish = (img) => {
      if (cancelled) return;
      coverImgRef.current = img;
      layersRef.current = {
        bg: buildBgLayer(img),
        vignette: buildVignetteLayer(),
        coverGlow: buildCoverGlowSprite(),
        odGlow: buildBarGlowSprite(STYLE.odColors),
        hpGlow: buildBarGlowSprite(STYLE.hpColors),
      };
      setCoverReady(true);
    };
    const img = new Image();
    img.onload = () => finish(img);
    img.onerror = () => finish(null);
    img.src = mapData.cover;
    return () => { cancelled = true; };
  }, [mapData]);

  // Wait for Exo 2 before the first frame, with a timeout fallback so an
  // offline machine just renders in Segoe UI instead of hanging.
  useEffect(() => {
    let cancelled = false;
    const load = Promise.all(
      [400, 500, 600, 700].map((w) => document.fonts.load(`${w} 20px 'Exo 2'`))
    ).catch(() => {});
    const timeout = new Promise((res) => setTimeout(res, 1500));
    Promise.race([load, timeout]).then(() => { if (!cancelled) setFontsReady(true); });
    return () => { cancelled = true; };
  }, []);

  const draw = useCallback((now) => {
    const canvas = canvasRef.current;
    const layers = layersRef.current;
    if (!canvas || !layers) return;
    const map = mapRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const t = now - animStartRef.current;
    // content animations run on a clock that only starts once the fade from
    // black has finished; the background layers keep drifting on real time
    const ta = Math.max(0, t - FADE_IN_MS);
    const introT = clamp01(ta / INTRO_MS);
    const pop = easeOutBack(introT);
    const idle = t / 1000;
    const staggerT = clamp01((ta - STAGGER_DELAY_MS) / STAGGER_MS);
    const staggerEase = easeOutBack(staggerT);
    // top row (Ranked / stars header / BPM) drops in from a few px above
    const topT = easeOutCubic(clamp01(ta / 450));
    const topDy = -14 * (1 - topT);
    // outro: content drifts up and shrinks slightly while the black fade lands
    const outroT = clamp01((t - FADE_START_MS) / FADE_DURATION_MS);
    const outroE = easeInCubic(outroT);
    // beat-synced 0..1 pulse driving the ring + cover glow intensity
    const pulse = 0.5 + 0.5 * Math.sin(idle * (map.bpm / 60) * Math.PI * 2);

    // background (pre-rendered: radial gradient + blurred cover art)
    ctx.drawImage(layers.bg, 0, 0);

    // decorative rotating rings, anchored at screen center, gold arcs (osu-style).
    // Each ring grows out from the center to its resting radius — outermost
    // first — and retracts the same way (outer first) during the fade-out.
    const drawRingCluster = (cx, cy, dir) => {
      for (let ring = 0; ring < STYLE.ringCount; ring++) {
        const restRadius = STYLE.ringInnerRadius + ring * STYLE.ringStep;
        const enterT = easeOutCubic(clamp01((ta - (STYLE.ringCount - 1 - ring) * 130) / 650));
        const exitT = easeInCubic(clamp01((t - FADE_START_MS - (STYLE.ringCount - 1 - ring) * 90) / 550));
        const radius = restRadius * enterT * (1 - exitT);
        if (radius < 2) continue;
        const rot = idle * dir * (0.15 + ring * 0.03);
        const segs = 5;
        for (let s = 0; s < segs; s++) {
          const a0 = rot + (s / segs) * Math.PI * 2;
          const a1 = a0 + (Math.PI * 2) / segs - 0.35;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, a0, a1);
          ctx.strokeStyle = `rgba(242,179,61,${(0.55 - ring * 0.1) * enterT * (1 - exitT)})`;
          ctx.lineWidth = 10 - ring;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }
    };
    ctx.save();
    ctx.globalAlpha = (0.42 + 0.12 * pulse) * introT;
    drawRingCluster(W / 2, H / 2, 1);
    ctx.restore();

    // large triangle particles, floating upward fast, behind everything else —
    // fade in as they enter from the bottom, travel past the top border unfaded
    ctx.save();
    const tri = STYLE.triangles;
    for (let i = 0; i < tri.count; i++) {
      const seed = i * 91.7;
      const x = (Math.sin(seed * 1.3) * 0.5 + 0.5) * W;
      const speed = 45 + (i % 5) * 20;
      const size = tri.minSize + (i % 5) * ((tri.maxSize - tri.minSize) / 4);
      const range = H + size * 2;
      const phase = (idle * speed + seed * 5) % range;
      const y = H - phase;
      const sway = Math.sin(idle * 0.4 + seed) * 18;
      const fadeIn = clamp01(phase / 140);
      ctx.fillStyle = `rgba(${tri.color},${fadeIn * 0.05 * introT})`;
      drawTriangle(ctx, x + sway, y, size);
    }
    ctx.restore();

    // ambient drifting particles
    ctx.save();
    const pCount = 40;
    for (let i = 0; i < pCount; i++) {
      const seed = i * 137.5;
      const x = (Math.sin(seed) * 0.5 + 0.5) * W;
      const speed = 20 + (i % 5) * 8;
      const y = H - ((idle * speed + seed * 3) % (H + 40));
      const r = 1 + (i % 3);
      const a = 0.15 + 0.15 * Math.sin(idle + seed);
      ctx.fillStyle = `rgba(196,181,253,${Math.max(0, a)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // vignette (pre-rendered)
    ctx.drawImage(layers.vignette, 0, 0);

    ctx.save();
    ctx.globalAlpha = introT;
    ctx.translate(W / 2, H / 2 - 60);
    const groupScale = (0.9 + 0.1 * pop) * (1 - 0.08 * outroE);
    ctx.scale(groupScale, groupScale);
    ctx.translate(-W / 2, -(H / 2 - 60) - 36 * outroE);

    // stars row (top center) — caps at 10 star icons; anything past 10 SR shows as "+X.X".
    // The number counts up from 0 and each star pops in with its own stagger.
    // The header drops in from a few px above along with Ranked / BPM.
    const starsShown = map.stars * easeOutCubic(clamp01(ta / 1100));
    ctx.save();
    ctx.globalAlpha = introT * topT;
    ctx.translate(0, topDy);
    ctx.textAlign = "center";
    ctx.fillStyle = GOLD;
    ctx.font = font(700, 30);
    ctx.fillText(`${starsShown.toFixed(2)} Stars${map.keys ? ` (${map.keys} Keys)` : ""}`, W / 2, 92);
    ctx.restore();
    const starCount = 10;
    const capped = Math.min(map.stars, starCount);
    const overflow = map.stars - starCount; // final value decides layout so nothing shifts mid-count
    const overflowShown = starsShown - starCount;
    const starGap = 30;
    const starsW = starGap * starCount;
    const starX0 = W / 2 - starsW / 2 - (overflow > 0 ? 22 : 0);
    const starY = 128;
    ctx.textAlign = "center";
    for (let i = 0; i < starCount; i++) {
      const cx = starX0 + (i + 0.5) * starGap;
      const frac = clamp01(capped - i);
      ctx.save();
      ctx.font = font(400, 20);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillText("★", cx, starY);
      const starT = clamp01((ta - 300 - i * 45) / 250);
      if (frac > 0 && starT > 0) {
        const s = 0.5 + 0.5 * easeOutBack(starT);
        ctx.translate(cx, starY - 7);
        ctx.scale(s, s);
        ctx.translate(-cx, -(starY - 7));
        ctx.globalAlpha = starT * frac;
        ctx.fillStyle = GOLD;
        ctx.fillText("★", cx, starY);
      }
      ctx.restore();
    }
    if (overflowShown > 0) {
      ctx.save();
      ctx.textAlign = "left";
      ctx.font = font(700, 18);
      ctx.fillStyle = GOLD;
      ctx.fillText(`+${overflowShown.toFixed(1)}`, starX0 + starsW + 6, starY);
      ctx.restore();
    }

    // Ranked (left) / BPM (right) — drop in from a few px above with the header
    ctx.save();
    ctx.globalAlpha = introT * topT;
    ctx.translate(0, topDy);
    ctx.font = font(600, 22);
    ctx.fillStyle = "#d8d3ea";
    ctx.textAlign = "left";
    ctx.fillText(map.statusText || (map.ranked ? "Ranked" : "Unranked"), 280, 108);
    ctx.textAlign = "right";
    ctx.fillText(`${map.bpm} BPM`, W - 280, 108);
    ctx.restore();

    // cover art — pre-rendered glow halo (pulsing on the beat) + crisp border stroke
    const coverSize = COVER_SIZE;
    const cx0 = COVER_X, cy0 = COVER_Y;
    ctx.save();
    ctx.globalAlpha = introT * (0.75 + 0.25 * pulse);
    ctx.drawImage(layers.coverGlow, cx0 - COVER_GLOW_PAD, cy0 - COVER_GLOW_PAD);
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 3;
    roundRect(ctx, cx0, cy0, coverSize, coverSize, 6);
    ctx.stroke();

    ctx.save();
    roundRect(ctx, cx0 + 2, cy0 + 2, coverSize - 4, coverSize - 4, 5);
    ctx.clip();
    ctx.fillStyle = STYLE.coverBgColor;
    ctx.fillRect(cx0, cy0, coverSize, coverSize);
    if (coverImgRef.current) {
      drawImageCover(ctx, coverImgRef.current, cx0, cy0, coverSize, coverSize);
    }
    ctx.restore();

    // OD (left) / HP (right) bars — slide + fade in from their outer side, slightly
    // after the cover, on the same stagger as the title block below. The glowing
    // fill is a pre-rendered sprite; only the visible bottom slice gets blitted.
    const barW = BAR_W, barH = BAR_H, barY = cy0 + coverSize / 2 - barH / 2;
    const barSlide = 60;
    const fillProgress = clamp01((staggerT - 0.15) / 0.7);
    const drawBar = (x, value, sprite, label, dir) => {
      const fillH = barH * (value / 10) * fillProgress;
      ctx.save();
      ctx.globalAlpha = staggerT;
      ctx.translate(dir * barSlide * (1 - staggerEase), 0);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      roundRect(ctx, x, barY, barW, barH, 8);
      ctx.fill();
      if (fillH > 0) {
        const sw = barW + BAR_GLOW_PAD * 2;
        const sh = fillH + BAR_GLOW_PAD * 2;
        ctx.drawImage(
          sprite,
          0, barH - fillH, sw, sh,
          x - BAR_GLOW_PAD, barY + (barH - fillH) - BAR_GLOW_PAD, sw, sh
        );
      }
      ctx.fillStyle = "#e8e4f0";
      ctx.font = font(600, 18);
      ctx.textAlign = "center";
      ctx.fillText(label, x + barW / 2, barY + barH + 34);
      ctx.font = font(700, 22);
      ctx.fillText((value * fillProgress).toFixed(1), x + barW / 2, barY + barH + 60);
      ctx.restore();
    };
    drawBar(cx0 - 100, map.od, layers.odGlow, "OD", -1);
    drawBar(cx0 + coverSize + 78, map.hp, layers.hpGlow, "HP", 1);

    // title / artist / mapper / diff — same delayed stagger as the bars;
    // long titles shrink to fit instead of overflowing the card
    const titleY0 = cy0 + coverSize + 100;
    const titleMaxW = W - 340;
    ctx.save();
    ctx.globalAlpha = staggerT;
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    fitFont(ctx, map.title, 700, 32, titleMaxW);
    ctx.fillText(map.title, W / 2, titleY0);
    ctx.fillStyle = "#cfc9e8";
    fitFont(ctx, map.artist, 500, 22, titleMaxW);
    ctx.fillText(map.artist, W / 2, titleY0 + 32);
    ctx.font = font(400, 18);
    ctx.fillStyle = "#9d95c2";
    ctx.fillText(`(${map.mapper})`, W / 2, titleY0 + 60);
    ctx.font = font(600, 18);
    ctx.fillStyle = ACCENT;
    ctx.fillText(map.diff, W / 2, titleY0 + 88);
    ctx.restore();

    ctx.restore();

    // frame borders — drawn at full opacity, outside the intro-scaled group
    const bo = STYLE.borderOuter, bi = STYLE.borderInner;
    ctx.save();
    ctx.lineWidth = bo.width;
    ctx.strokeStyle = bo.color;
    ctx.strokeRect(bo.width / 2, bo.width / 2, W - bo.width, H - bo.width);
    const inset = bo.width + bi.width / 2;
    ctx.lineWidth = bi.width;
    layers.borderGrad ??= makeGradient(ctx, 0, 0, W, H, bi.colors);
    ctx.strokeStyle = layers.borderGrad;
    ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);
    ctx.restore();

    // fade in from black at the start, and out to black once the reveal has held for a while
    const fadeInAlpha = 1 - clamp01(t / FADE_IN_MS);
    const fadeOutAlpha = clamp01((t - FADE_START_MS) / FADE_DURATION_MS);
    const blackAlpha = Math.max(fadeInAlpha, fadeOutAlpha);
    if (blackAlpha > 0) {
      ctx.fillStyle = `rgba(0,0,0,${blackAlpha})`;
      ctx.fillRect(0, 0, W, H);
    }

    // preview audio rides the same clocks: full volume through the reveal,
    // fading out with the outro, silenced once the loop halts
    const audio = audioRef.current;
    const finished = t > FADE_START_MS + FADE_DURATION_MS && !recordingRef.current;
    if (audio && !audio.paused) {
      audio.volume = 1 - outroT;
      if (finished) audio.pause();
    }

    // once fully black and not recording there is nothing left to animate —
    // stop scheduling frames; Replay/Record re-kick the loop
    if (!finished) rafRef.current = requestAnimationFrame(drawRef.current);
  }, []);

  useEffect(() => { drawRef.current = draw; }, [draw]);

  useEffect(() => {
    if (!coverReady || !fontsReady) return;
    animStartRef.current = performance.now();
    // a freshly loaded beatmap replays the intro — start its preview with it
    // (allowed audibly because the Load click already activated the page)
    const audio = audioRef.current;
    if (audio && audio.src) {
      audio.currentTime = 0;
      audio.volume = 1;
      audio.play().catch(() => {});
    }
    rafRef.current = requestAnimationFrame(drawRef.current);
    return () => cancelAnimationFrame(rafRef.current);
  }, [coverReady, fontsReady, draw]);

  // restart the animation from t=0, re-kicking the loop if it halted on black;
  // the beatmap preview (when one is loaded) starts over with it
  const restartAnim = () => {
    cancelAnimationFrame(rafRef.current);
    animStartRef.current = performance.now();
    const audio = audioRef.current;
    if (audio && audio.src) {
      audio.currentTime = 0;
      audio.volume = 1;
      audio.play().catch(() => {});
    }
    rafRef.current = requestAnimationFrame(drawRef.current);
  };

  const replay = () => restartAnim();

  const loadBeatmap = async (e) => {
    e.preventDefault();
    const parsed = parseBeatmapLink(link);
    if (!parsed) {
      setLoadError("Couldn't parse that — paste an osu.ppy.sh beatmap link (e.g. https://osu.ppy.sh/beatmapsets/292301).");
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const newMap = await fetchBeatmap(parsed);
      mapRef.current = newMap;
      setMapData(newMap); // reloads cover + layers, which replays the intro
    } catch (err) {
      setLoadError(`Failed to load beatmap: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas || !mimeType || recording) return;
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    const stream = canvas.captureStream(60);

    // mix the beatmap preview into the recording via WebAudio (same-origin
    // proxy keeps it CORS-clean, so the element source actually produces sound)
    const audio = audioRef.current;
    if (audio && audio.src) {
      try {
        audioCtxRef.current ??= new AudioContext();
        const actx = audioCtxRef.current;
        if (actx.state === "suspended") actx.resume();
        if (!audioSrcNodeRef.current) {
          // a media element can only ever have one source node — create once
          audioSrcNodeRef.current = actx.createMediaElementSource(audio);
          audioDestRef.current = actx.createMediaStreamDestination();
          audioSrcNodeRef.current.connect(audioDestRef.current);
          audioSrcNodeRef.current.connect(actx.destination); // keep it audible
        }
        stream.addTrack(audioDestRef.current.stream.getAudioTracks()[0]);
      } catch { /* fall back to a silent recording */ }
    }

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      setResult({ url, ext, size: blob.size });
      recordingRef.current = false;
      setRecording(false);
    };

    recorderRef.current = recorder;
    recordingRef.current = true;
    restartAnim(); // sync the reveal animation with recording start
    recorder.start();
    setRecording(true);

    const t0 = performance.now();
    let lastPct = -1;
    const tick = () => {
      const pct = clamp01((performance.now() - t0) / RECORD_MS);
      const rounded = Math.round(pct * 100);
      if (rounded !== lastPct) { lastPct = rounded; setProgress(pct); }
      if (pct < 1) requestAnimationFrame(tick);
    };
    tick();
    setTimeout(() => recorder.stop(), RECORD_MS);
  };

  return (
    <div style={{
      minHeight: "100vh", background: BG_MAIN, color: "#e8e4f0",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 20, padding: "36px 16px 60px", fontFamily: STYLE.fontFamily,
    }}>
      <div style={{ textAlign: "center", maxWidth: 720 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: ACCENT, letterSpacing: "-0.02em", margin: 0 }}>
          osu! Beatmap Card → Video Render
        </h1>
        <p style={{ color: "#9d95c2", fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
          The card below is drawn frame-by-frame on a &lt;canvas&gt;, no video file involved.
          "Record" captures that canvas live via <code>captureStream()</code> + <code>MediaRecorder</code> and
          hands you a downloadable {mimeType?.includes("mp4") ? "MP4" : "WebM"} — proof that a React/Vite
          page can produce real video output straight from the browser.
        </p>
      </div>

      <form onSubmit={loadBeatmap} style={{
        display: "flex", gap: 10, width: "min(100%, 700px)", alignItems: "center",
      }}>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste an osu! beatmap link — e.g. https://osu.ppy.sh/beatmapsets/292301#osu/657916"
          spellCheck={false}
          style={{
            flex: 1, background: "#141024", border: "1px solid #332a5c", borderRadius: 10,
            padding: "12px 16px", fontSize: 13, color: "#e8e4f0", outline: "none",
            fontFamily: "inherit",
          }}
        />
        <button type="submit" disabled={loading || recording} style={btnStyle(true, loading || recording)}>
          {loading ? "Loading…" : "Load beatmap"}
        </button>
      </form>
      {loadError && (
        <p style={{ color: "#e0384a", fontSize: 13, maxWidth: 700, textAlign: "center" }}>{loadError}</p>
      )}

      <audio ref={audioRef} src={mapData.preview || undefined} preload="auto" style={{ display: "none" }} />

      <div style={{
        width: "min(100%, 900px)", aspectRatio: `${W} / ${H}`, borderRadius: 14,
        overflow: "hidden", border: "1px solid #241c44", boxShadow: "0 20px 60px #00000066",
      }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ width: "100%", height: "100%", display: "block", background: BG_MAIN }}
        />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={replay}
          disabled={recording}
          style={btnStyle(false, recording)}
        >
          Replay intro
        </button>
        <button
          onClick={startRecording}
          disabled={!mimeType || recording}
          style={btnStyle(true, recording)}
        >
          {recording ? `Recording… ${Math.round(progress * 100)}%` : `Record ${(RECORD_MS / 1000).toFixed(1)}s clip`}
        </button>
        {result && (
          <a
            href={result.url}
            download={`osu-render.${result.ext}`}
            style={{ ...btnStyle(false, false), textDecoration: "none", borderColor: GREEN, color: GREEN }}
          >
            Download .{result.ext} ({(result.size / 1024 / 1024).toFixed(2)} MB)
          </a>
        )}
      </div>

      {!mimeType && (
        <p style={{ color: "#e0384a", fontSize: 13 }}>
          This browser doesn't support MediaRecorder video capture — try a recent Chrome or Edge.
        </p>
      )}

      <div style={{
        maxWidth: 700, fontSize: 13, color: "#8b83b0", lineHeight: 1.7,
        borderTop: "1px solid #241c44", paddingTop: 16, marginTop: 8,
      }}>
        <strong style={{ color: "#b3a8d8" }}>How this generalizes:</strong> this demo records in
        real time, which is fine for a short preview but ties render length to wall-clock time and can
        drop frames under load. For frame-accurate, faster-than-real-time exports (e.g. batch-rendering
        one video per beatmap from data), the same canvas-drawing code would instead run inside{" "}
        <a href="https://www.remotion.dev/" target="_blank" rel="noreferrer" style={{ color: ACCENT }}>Remotion</a>,
        which drives the animation by frame number and calls ffmpeg directly instead of capturing a live stream.
      </div>
    </div>
  );
}

function btnStyle(primary, disabled) {
  return {
    background: primary ? ACCENT : "transparent",
    color: primary ? BG_MAIN : "#e8e4f0",
    border: `1px solid ${primary ? ACCENT : "#332a5c"}`,
    borderRadius: 10,
    padding: "12px 22px",
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
    transition: "transform 0.15s",
  };
}
