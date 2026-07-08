// Unified name → lore-entry resolution across all four wiki datasets.
// Characters register first and win key collisions; keys are lowercased
// id, full name, and (characters only) first/last name words.
import { characters } from "../data/characters.js";
import { worldMap } from "../data/worldMap.js";
import { magicSystem } from "../data/magicSystem.js";
import { history } from "../data/history.js";

export const DEFAULT_CHARACTER_COLOR = "#c4b5fd";
export const DEFAULT_ENTITY_COLOR = "#a78bfa";

const realImage = (image) => (image && !image.includes("place.png") ? image : null);

const byKey = new Map();

function register(key, entry) {
  const k = key.toLowerCase();
  if (!byKey.has(k)) byKey.set(k, entry);
}

function addDataset(items, category) {
  for (const item of items) {
    const entry = {
      id: item.id,
      category,
      name: item.name,
      color: category === "characters" ? item.color || DEFAULT_CHARACTER_COLOR : DEFAULT_ENTITY_COLOR,
      image: realImage(item.image),
      item,
    };
    register(item.id, entry);
    register(item.name, entry);
    if (category === "characters") {
      const words = item.name.split(" ");
      register(words[0], entry);
      register(words[words.length - 1], entry);
    }
  }
}

addDataset(characters, "characters");
addDataset(worldMap, "worldMap");
addDataset(magicSystem, "magicSystem");
addDataset(history, "history");

// -> { id, category, name, color, image, item } | null
export function resolveEntity(rawName) {
  const key = rawName.trim().toLowerCase();
  return byKey.get(key) ?? byKey.get(key.replace(/\s+/g, "-")) ?? null;
}

// Characters only. Also tolerates honorifics ("General Mirai", "Cardinal Vesta")
// by falling back to the last word of the name.
export function resolveCharacter(rawName) {
  const direct = resolveEntity(rawName);
  if (direct?.category === "characters") return direct;
  const words = rawName.trim().toLowerCase().split(/\s+/);
  const hit = byKey.get(words[words.length - 1]);
  return hit?.category === "characters" ? hit : null;
}
