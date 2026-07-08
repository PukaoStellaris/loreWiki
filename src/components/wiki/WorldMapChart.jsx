import { useMemo, useState } from "react";

// SVG "arcane star chart" — locations as glowing nodes on a starfield with
// ley-lines between connected locations. Coordinates come from each entry's
// `map: {x, y}` (percent, 0–100); entries without coords are skipped.
const W = 1000;
const H = 620;
const toPx = ({ x, y }) => ({ px: (x / 100) * W, py: (y / 100) * H });

// Deterministic PRNG so the starfield is stable across renders.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STARS = (() => {
  const rand = mulberry32(333);
  return Array.from({ length: 120 }, (_, i) => ({
    x: rand() * W,
    y: rand() * H,
    r: 0.5 + rand(),
    opacity: 0.15 + rand() * 0.5,
    twinkle: i % 7 === 0,
  }));
})();

function FloatingStarNode({ px, py, color }) {
  // 4-point star for floating locations (e.g. the Astral Spire)
  const s = 14;
  const d = `M ${px} ${py - s} Q ${px + 3} ${py - 3} ${px + s} ${py} Q ${px + 3} ${py + 3} ${px} ${py + s} Q ${px - 3} ${py + 3} ${px - s} ${py} Q ${px - 3} ${py - 3} ${px} ${py - s} Z`;
  return <path d={d} fill={color} stroke="#e9d5ff" strokeWidth={1} />;
}

export default function WorldMapChart({ locations, onSelectItem, searchQuery = "" }) {
  const [hovered, setHovered] = useState(null);
  const placed = useMemo(() => locations.filter((l) => l.map), [locations]);

  const leyLines = useMemo(() => {
    const seen = new Set();
    const lines = [];
    for (const loc of placed) {
      for (const targetId of loc.connections ?? []) {
        const target = placed.find((l) => l.id === targetId);
        if (!target) continue;
        const key = [loc.id, target.id].sort().join("~");
        if (seen.has(key)) continue;
        seen.add(key);
        lines.push([loc, target]);
      }
    }
    return lines;
  }, [placed]);

  const query = searchQuery.trim().toLowerCase();
  const matches = (loc) => !query || loc.name.toLowerCase().includes(query) || (loc.type ?? "").toLowerCase().includes(query);
  const hoveredLoc = placed.find((l) => l.id === hovered);

  if (!placed.length) return null;

  return (
    <div className="relative mb-8">
      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-violet-500/60 rounded-tl-lg z-10" />
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-violet-500/60 rounded-tr-lg z-10" />
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-violet-500/60 rounded-bl-lg z-10" />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-violet-500/60 rounded-br-lg z-10" />

      <div className="relative rounded-xl overflow-hidden border border-violet-700/40">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="map-bg" cx="50%" cy="45%" r="75%">
              <stop offset="0%" stopColor="#1e1035" />
              <stop offset="60%" stopColor="#120b1f" />
              <stop offset="100%" stopColor="#0c0a09" />
            </radialGradient>
            <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          <rect width={W} height={H} fill="url(#map-bg)" />

          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e9d5ff" opacity={s.opacity} className={s.twinkle ? "map-twinkle" : undefined} />
          ))}

          {leyLines.map(([a, b], i) => {
            const pa = toPx(a.map);
            const pb = toPx(b.map);
            const mx = (pa.px + pb.px) / 2;
            const my = (pa.py + pb.py) / 2 - 30;
            return (
              <path
                key={i}
                d={`M ${pa.px} ${pa.py} Q ${mx} ${my} ${pb.px} ${pb.py}`}
                fill="none"
                stroke="#7c3aed"
                strokeWidth={1.5}
                strokeDasharray="2 6"
                opacity={0.35}
              />
            );
          })}

          {placed.map((loc) => {
            const { px, py } = toPx(loc.map);
            const active = hovered === loc.id;
            const dim = !matches(loc);
            return (
              <g
                key={loc.id}
                onClick={() => onSelectItem(loc)}
                onMouseEnter={() => setHovered(loc.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
                opacity={dim ? 0.3 : 1}
              >
                <circle cx={px} cy={py} r={active ? 30 : 22} fill="#a78bfa" opacity={active ? 0.35 : 0.15} filter="url(#node-glow)" />
                {loc.floating ? (
                  <FloatingStarNode px={px} py={py} color="#a78bfa" />
                ) : (
                  <>
                    <circle cx={px} cy={py} r={12} fill="none" stroke="#a78bfa" strokeWidth={2} className="map-pulse" style={{ transformOrigin: `${px}px ${py}px` }} />
                    <circle cx={px} cy={py} r={5} fill="#e9d5ff" />
                  </>
                )}
                <text x={px} y={py + 34} textAnchor="middle" fill="#ddd6fe" fontSize={15} fontFamily="Cinzel, serif" fontWeight="bold">
                  {loc.name}
                </text>
                <text x={px} y={py + 52} textAnchor="middle" fill="#a8a29e" fontSize={11}>
                  {loc.type}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredLoc && (
          <div
            className="absolute z-20 pointer-events-none bg-stone-900/95 border border-violet-600/40 rounded-lg px-3 py-2 text-sm shadow-xl -translate-x-1/2"
            style={{ left: `${hoveredLoc.map.x}%`, top: `calc(${(hoveredLoc.map.y / 100) * 100}% - 4.5rem)` }}
          >
            <p className="font-bold text-violet-200 whitespace-nowrap">{hoveredLoc.name}</p>
            <p className="text-stone-400 text-xs whitespace-nowrap">
              {hoveredLoc.type}
              {hoveredLoc.infobox?.Status ? ` · ${hoveredLoc.infobox.Status}` : ""}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes map-twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.7; } }
        .map-twinkle { animation: map-twinkle 4s ease-in-out infinite; }
        @keyframes map-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.25); } }
        .map-pulse { animation: map-pulse 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
