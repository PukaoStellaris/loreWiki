// localStorage wrappers that never throw. Private-mode Safari and full quotas
// both raise on access, and a music player has no business dying over that.

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try { localStorage.removeItem(key); } catch { /* nothing to clean up */ }
}

export const KEYS = {
  liked: "va-liked",
  settings: "va-settings",
  session: "va-session",
  playlists: "va-playlists",
  migrated: "va-id-migration",
};
