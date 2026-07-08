import { useMemo, useState } from "react";
import { Network } from "lucide-react";
import { characters } from "../../data/characters.js";
import { resolveCharacter } from "../../lib/loreIndex.js";

const UNRESOLVED_COLOR = "#a8a29e"; // stone-400
const CX = 240;
const CY = 240;
const RING_RADIUS = 170;

// Outbound bonds merged with inbound ones (characters who list this one), deduped.
function buildEdges(character) {
  const edges = [];
  const seen = new Set();
  const add = (name, relation) => {
    const entry = resolveCharacter(name);
    if (entry?.id === character.id) return;
    const key = entry ? entry.id : name.trim().toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ name: entry ? entry.name : name, relation, entry });
  };
  for (const rel of character.relationships ?? []) add(rel.name, rel.relation);
  for (const other of characters) {
    if (other.id === character.id) continue;
    for (const rel of other.relationships ?? []) {
      if (resolveCharacter(rel.name)?.id === character.id) add(other.name, rel.relation);
    }
  }
  return edges;
}

function Node({ x, y, r, entry, label, onClick, onHover }) {
  const color = entry ? entry.color : UNRESOLVED_COLOR;
  const clipId = `clip-${x.toFixed(0)}-${y.toFixed(0)}`;
  return (
    <g
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <circle cx={x} cy={y} r={r + 6} fill={color} opacity={0.12} />
      <circle cx={x} cy={y} r={r} fill="#1c1917" stroke={color} strokeWidth={2} />
      {entry?.image ? (
        <>
          <clipPath id={clipId}>
            <circle cx={x} cy={y} r={r - 2} />
          </clipPath>
          <image
            href={entry.image}
            x={x - (r - 2)}
            y={y - (r - 2)}
            width={(r - 2) * 2}
            height={(r - 2) * 2}
            clipPath={`url(#${clipId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        </>
      ) : (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize={r * 0.9}
          fontFamily="Cinzel, serif"
        >
          {label.charAt(0)}
        </text>
      )}
    </g>
  );
}

export default function RelationshipGraph({ character, onNavigate }) {
  const edges = useMemo(() => buildEdges(character), [character]);
  const [hovered, setHovered] = useState(null);
  const center = resolveCharacter(character.name) ?? { name: character.name, color: character.color, image: null };

  if (!edges.length) return null;

  // Crowded webs get smaller nodes on two interleaved rings so neighbors don't overlap.
  const count = edges.length;
  const nodeR = count > 12 ? 22 : count > 8 ? 26 : 30;
  const posFor = (i) => {
    const angle = (-90 + (i * 360) / count) * (Math.PI / 180);
    const radius = count > 10 ? (i % 2 === 0 ? 148 : 200) : RING_RADIUS;
    return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) };
  };

  return (
    <div className="mt-8 pt-6 border-t border-violet-700/30">
      <h2 className="text-xl font-bold text-violet-200 mb-4 flex items-center gap-2">
        <Network className="w-5 h-5 text-violet-500" /> Bonds Web
      </h2>
      <div className="bg-stone-900/50 rounded-xl border border-violet-700/20 p-2">
        <svg viewBox="0 0 480 480" className="w-full max-w-lg mx-auto block">
          {edges.map((edge, i) => {
            const { x, y } = posFor(i);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke="#7c3aed"
                strokeWidth={1.5}
                opacity={hovered === i ? 0.7 : 0.25}
              />
            );
          })}
          <circle cx={CX} cy={CY} r={56} fill={center.color} opacity={0.15} style={{ filter: "blur(6px)" }} />
          <Node x={CX} y={CY} r={44} entry={center} label={center.name} />
          <text
            x={CX}
            y={CY + 62}
            textAnchor="middle"
            fill="#ddd6fe"
            fontSize={14}
            fontFamily="Cinzel, serif"
            fontWeight="bold"
          >
            {center.name}
          </text>
          {edges.map((edge, i) => {
            const { x, y } = posFor(i);
            return (
              <g key={i}>
                <Node
                  x={x}
                  y={y}
                  r={nodeR}
                  entry={edge.entry}
                  label={edge.name}
                  onClick={edge.entry ? () => onNavigate("characters", edge.entry.id) : undefined}
                  onHover={(on) => setHovered(on ? i : null)}
                />
                <text
                  x={x}
                  y={y + nodeR + 14}
                  textAnchor="middle"
                  fill={edge.entry ? "#c4b5fd" : "#a8a29e"}
                  fontSize={11}
                  fontFamily="Cinzel, serif"
                >
                  {edge.name}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="min-h-[2.5rem] px-4 pb-2 text-center text-sm italic text-stone-400">
          {hovered !== null ? (
            <>
              <span className="font-semibold not-italic" style={{ color: edges[hovered].entry?.color ?? UNRESOLVED_COLOR }}>
                {edges[hovered].name}
              </span>
              <span className="text-violet-600/50 mx-2">✦</span>
              {edges[hovered].relation}
            </>
          ) : (
            "Hover a bond to reveal its nature"
          )}
        </div>
      </div>
    </div>
  );
}
