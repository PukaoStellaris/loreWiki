// Formats seconds as m:ss, or h:mm:ss past an hour. Guards against the NaN the
// audio element reports before metadata lands.
export function fmt(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const s = String(total % 60).padStart(2, "0");
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

// Folds a string down to something searchable. NFKD collapses compatibility
// forms — so ｆｕｌｌ matches full and （phony） matches (phony) — and splits
// accents off their base letter, which the mark strip then removes so "Renai"
// finds "Renaï". The same strip also drops Japanese dakuten, which is applied
// to query and title alike: か then matches が, never the reverse-breaking case.
export function normalize(text) {
  return String(text ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\p{Diacritic}/gu, "");
}

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
