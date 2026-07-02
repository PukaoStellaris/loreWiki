import { useState, useEffect } from "react";

// Cycles through tips with a fade-out/fade-in between each.
// Tips may be plain strings or { text, duration } objects (duration in seconds);
// strings fall back to defaultDurationSeconds.
export default function useTipRotation(tips, defaultDurationSeconds = 8, fadeMs = 500) {
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  useEffect(() => {
    if (tips.length <= 1) return;
    let outer = null;
    let inner = null;
    const durationOf = (tip) =>
      typeof tip === "object" && tip.duration ? tip.duration : defaultDurationSeconds;
    const schedule = (idx) => {
      outer = setTimeout(() => {
        setTipVisible(false);
        inner = setTimeout(() => {
          const next = (idx + 1) % tips.length;
          setTipIndex(next);
          setTipVisible(true);
          schedule(next);
        }, fadeMs);
      }, durationOf(tips[idx]) * 1000);
    };
    schedule(0);
    return () => { clearTimeout(outer); clearTimeout(inner); };
  }, [tips, defaultDurationSeconds, fadeMs]);

  const raw = tips[tipIndex];
  return { tip: typeof raw === "object" ? raw.text : raw, tipVisible, tipIndex };
}
