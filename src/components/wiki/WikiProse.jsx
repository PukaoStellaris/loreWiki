import { resolveEntity } from "../../lib/loreIndex.js";

// Renders wiki description prose with [[Name]] / [[target|display]] cross-links.
// Resolved links are clickable in the entity's color; unresolved render as plain text.
function ProseLine({ text, onNavigate }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/);
  return parts.map((part, i) => {
    const link = part.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/);
    if (!link) return part;
    const target = link[1].trim();
    const display = (link[2] ?? target).trim();
    const entry = resolveEntity(target);
    if (!entry) return display;
    return (
      <button
        key={i}
        onClick={() => onNavigate(entry.category, entry.id)}
        className="inline border-b border-dotted border-violet-500/40 hover:border-current transition-colors cursor-pointer"
        style={{ color: entry.color }}
        onMouseEnter={(e) => { e.currentTarget.style.textShadow = `0 0 12px ${entry.color}59`; }}
        onMouseLeave={(e) => { e.currentTarget.style.textShadow = "none"; }}
      >
        {display}
      </button>
    );
  });
}

export default function WikiProse({ text, onNavigate }) {
  return (
    <div className="mt-6 space-y-4">
      {text.split("\n\n").map((p, i) => (
        <p
          key={i}
          className={`indent-8 text-stone-300 leading-relaxed ${i === 0 ? "first-letter:text-2xl first-letter:text-violet-400 first-letter:mr-1" : ""}`}
        >
          <ProseLine text={p} onNavigate={onNavigate} />
        </p>
      ))}
    </div>
  );
}
