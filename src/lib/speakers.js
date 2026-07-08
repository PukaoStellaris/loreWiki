// Resolves speaker names and color-span names against the lore characters.
// Name-key resolution lives in loreIndex.js (shared with the wiki).
import { resolveEntity, DEFAULT_CHARACTER_COLOR } from "./loreIndex.js";

export const NAMED_COLORS = {
  violet: "#a78bfa",
  gold: "#fbbf24",
  crimson: "#f87171",
  azure: "#38bdf8",
  emerald: "#34d399",
  void: "#a1a1aa",
  silver: "#e2e8f0",
};

export const DEFAULT_COLOR = DEFAULT_CHARACTER_COLOR;
const UNKNOWN_COLOR = "#a8a29e"; // stone-400

// -> { name, color, image, known } — unknown speakers degrade to gray + no portrait
export function resolveSpeaker(rawName) {
  const name = rawName.trim();
  const hit = resolveEntity(name);
  if (hit?.category === "characters") return { name, color: hit.color, image: hit.image, known: true };
  return { name, color: UNKNOWN_COLOR, image: null, known: false };
}

// {name} color spans: character → named palette → literal hex → default violet
export function resolveColor(rawName) {
  const name = rawName.trim();
  const hit = resolveEntity(name);
  if (hit?.category === "characters") return hit.color;
  if (NAMED_COLORS[name.toLowerCase()]) return NAMED_COLORS[name.toLowerCase()];
  if (/^#[0-9a-f]{3,8}$/i.test(name)) return name;
  return DEFAULT_COLOR;
}
