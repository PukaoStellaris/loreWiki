// localStorage persistence for the story reader. All access goes through
// try/catch so private browsing degrades to in-memory defaults.
const PROGRESS_KEY = "story_reader_progress";
const SETTINGS_KEY = "story_reader_settings";
const READ_KEY = "story_read_chapters";
const BOOKMARKS_KEY = "story_reader_bookmarks";

export const DEFAULT_SETTINGS = { fontSize: 18, lineHeight: 2.0 };

export function loadJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

export const loadProgress = () => loadJSON(PROGRESS_KEY, null);
export const saveProgress = (chapterId, scrollY) => saveJSON(PROGRESS_KEY, { chapterId, scrollY });

export const loadSettings = () => ({ ...DEFAULT_SETTINGS, ...loadJSON(SETTINGS_KEY, {}) });
export const saveSettings = (settings) => saveJSON(SETTINGS_KEY, settings);

export const loadReadChapters = () => loadJSON(READ_KEY, []);
export const saveReadChapters = (ids) => saveJSON(READ_KEY, ids);

// Bookmarks whose chapter no longer exists are dropped on load.
export const loadBookmarks = (validChapterIds) =>
  loadJSON(BOOKMARKS_KEY, []).filter((b) => validChapterIds.has(b.chapterId));
export const saveBookmarks = (bookmarks) => saveJSON(BOOKMARKS_KEY, bookmarks);
