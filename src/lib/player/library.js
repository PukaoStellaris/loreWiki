import { musicTracks } from "virtual:music-manifest";
import { LIBRARY_OVERRIDES } from "./config";
import { normalize } from "./format";
import { KEYS, readJSON, writeJSON, remove } from "./storage";

// Builds the library from the build-time manifest. Titles, artists, durations
// and cover art already came out of each file's tags during the Vite build, so
// nothing here touches the network — an entry in LIBRARY_OVERRIDES simply wins
// over the embedded tags, and the filename is the last resort.
function buildLibrary() {
  const overrides = new Map(LIBRARY_OVERRIDES.map(o => [o.file, o]));

  return musicTracks.map(track => {
    const override = overrides.get(track.file) || {};
    const fromFilename = track.file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    return {
      id: track.id,
      file: track.file,
      url: track.url,
      title: override.title || track.title || fromFilename,
      artist: override.artist || track.artist || "Unknown Artist",
      album: track.album || null,
      duration: track.duration || 0,
      cover: track.cover || null,
      isUpload: false,
    };
  });
}

export const LIBRARY_SONGS = buildLibrary();

// Track ids used to be the track's position in the directory listing, which
// meant adding a single file renumbered everything after it and silently moved
// every liked song onto the wrong track. Ids are content-stable now; this
// remaps one existing save from the old scheme and then never runs again.
export function migrateLegacyIds() {
  if (readJSON(KEYS.migrated, false)) return;

  const legacy = readJSON(KEYS.liked, null);
  if (Array.isArray(legacy) && legacy.length) {
    const byLegacyId = new Map(musicTracks.map(t => [t.legacyId, t.id]));
    const remapped = legacy
      .map(id => byLegacyId.get(id))
      .filter(Boolean);
    writeJSON(KEYS.liked, remapped);
  }

  // Durations came from probing every file over the network and were cached
  // under the same unstable ids. They ship in the manifest now.
  remove("va-durations");
  writeJSON(KEYS.migrated, true);
}

// Pre-folded search text, computed once per song rather than on every keystroke.
const searchIndex = new Map();
function searchTextFor(song) {
  let text = searchIndex.get(song.id);
  if (text === undefined) {
    text = normalize(`${song.title} ${song.artist} ${song.album || ""}`);
    searchIndex.set(song.id, text);
  }
  return text;
}

export function searchSongs(songs, query) {
  const q = normalize(query).trim();
  if (!q) return songs;
  const terms = q.split(/\s+/);
  return songs.filter(song => {
    const text = searchTextFor(song);
    return terms.every(term => text.includes(term));
  });
}

// Fisher-Yates over a copy, with `firstId` lifted to the front so the track the
// user just clicked stays the one that plays.
export function shuffled(ids, firstId) {
  const out = ids.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (firstId) {
    const at = out.indexOf(firstId);
    if (at > 0) {
      out.splice(at, 1);
      out.unshift(firstId);
    }
  }
  return out;
}
