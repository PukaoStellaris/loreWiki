import { useEffect, useRef } from "react";
import { ACCENT, ACCENT_DEEP, ACCENT_HOVER } from "../../lib/player/config";

// Frequency bins above roughly 12 kHz carry almost nothing in this library and
// just leave a dead flat stretch on the right, so the top of the range is cut.
const USED_BINS = 0.62;
const BAR_COUNT = 64;
const FALL_RATE = 0.045;

/**
 * Frequency-bar visualizer driven by the player's AnalyserNode.
 *
 * Rendering lives entirely inside a rAF loop writing to a canvas — it never
 * touches React state, so an animating visualizer costs no re-renders. The
 * analyser is created on demand, because routing the element through WebAudio
 * has real consequences (see usePlayer) and is not worth doing unasked.
 */
export function Visualizer({ ensureAnalyser, getAnalyser, active, isPlaying, height = 56 }) {
  const canvasRef = useRef(null);
  const peaksRef = useRef(new Float32Array(BAR_COUNT));

  useEffect(() => {
    if (active) ensureAnalyser();
  }, [active, ensureAnalyser]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf;
    let bins = null;
    const peaks = peaksRef.current;

    // Match the backing store to the device pixel ratio, or the bars come out
    // soft on any high-DPI display.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height: h } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const analyser = getAnalyser();
      const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
      if (!cssW || !cssH) return;

      if (analyser) {
        if (!bins || bins.length !== analyser.frequencyBinCount) {
          bins = new Uint8Array(analyser.frequencyBinCount);
        }
        analyser.getByteFrequencyData(bins);
      }

      ctx.clearRect(0, 0, cssW, cssH);

      const usable = bins ? Math.floor(bins.length * USED_BINS) : 0;
      const gap = 2;
      const barW = (cssW - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      if (barW <= 0) return;

      const gradient = ctx.createLinearGradient(0, cssH, 0, 0);
      gradient.addColorStop(0, `${ACCENT_DEEP}55`);
      gradient.addColorStop(0.55, `${ACCENT_HOVER}cc`);
      gradient.addColorStop(1, ACCENT);

      for (let i = 0; i < BAR_COUNT; i++) {
        let value = 0;
        if (usable) {
          // Logarithmic bin mapping — linear bins crowd every musical detail
          // into the leftmost fifth of the display.
          const from = Math.floor(Math.pow(i / BAR_COUNT, 1.7) * usable);
          const to = Math.max(from + 1, Math.floor(Math.pow((i + 1) / BAR_COUNT, 1.7) * usable));
          let sum = 0;
          for (let b = from; b < to && b < bins.length; b++) sum += bins[b];
          value = sum / (to - from) / 255;
        }

        // Decay gives the bars weight; without it they flicker.
        peaks[i] = value > peaks[i] ? value : Math.max(0, peaks[i] - FALL_RATE);
        const barH = Math.max(2, peaks[i] * cssH);
        const x = i * (barW + gap);

        ctx.fillStyle = gradient;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, cssH - barH, barW, barH, Math.min(barW / 2, 2));
          ctx.fill();
        } else {
          ctx.fillRect(x, cssH - barH, barW, barH);
        }
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, getAnalyser]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        height, flexShrink: 0, padding: "0 20px",
        opacity: isPlaying ? 1 : 0.35,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

export default Visualizer;
