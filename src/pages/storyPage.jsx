import { useState, useEffect, useMemo, useRef } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Menu, X, Sparkles, CheckCircle2, Circle, Bookmark, BookmarkPlus } from "lucide-react";
import { chapters } from "../lib/chapters.js";
import { parseBlocks } from "../lib/chapterParser.js";
import ChapterReader from "../components/ChapterReader.jsx";
import FloatingParticles from "../components/FloatingParticles.jsx";
import LockScreen from "../components/LockScreen.jsx";
import ReaderSettings from "../components/ReaderSettings.jsx";
import StorySearch from "../components/StorySearch.jsx";
import useSessionAuth from "../hooks/useSessionAuth.js";
import {
  loadProgress, saveProgress, loadSettings, saveSettings,
  loadReadChapters, saveReadChapters, loadBookmarks, saveBookmarks,
} from "../lib/storyStorage.js";

const THEME_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  * { font-family: 'Crimson Text', serif; }
  h1, h2, h3, h4, h5, h6 { font-family: 'Cinzel', serif; }
  @keyframes float {
    0%, 100% { transform: translateY(0px); opacity: 0.3; }
    50% { transform: translateY(-20px); opacity: 0.6; }
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #1c1917; }
  ::-webkit-scrollbar-thumb { background: #4800b4; border-radius: 4px; }
`;

function toRoman(num) {
  if (!Number.isFinite(num) || num < 1) return "?";
  const table = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [value, glyph] of table) {
    while (num >= value) { out += glyph; num -= value; }
  }
  return out;
}

const VALID_CHAPTER_IDS = new Set(chapters.map((c) => c.id));

// Popover for saving a bookmark with an optional label. The reading position
// is snapshotted when the popover opens — focusing the input can scroll the
// page, so reading window.scrollY at save time would be wrong.
const BookmarkAdder = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const anchorRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  const toggle = () => {
    if (!open) {
      anchorRef.current = {
        scrollY: window.scrollY,
        docHeight: Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
      };
    }
    setOpen((o) => !o);
  };

  const save = () => {
    onAdd(label, anchorRef.current);
    setLabel("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label="Add bookmark"
        className={`p-2 rounded-lg border transition-colors ${open ? "text-violet-300 border-violet-500/50 bg-violet-900/30" : "text-violet-500 border-violet-800/30 bg-stone-800/50 hover:text-violet-300"}`}
      >
        <BookmarkPlus className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 w-64 bg-stone-900/95 backdrop-blur border border-violet-700/40 rounded-xl shadow-2xl p-4 space-y-3">
          <p className="text-violet-500/70 text-xs tracking-widest uppercase">Mark this passage</p>
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") save(); }}
            placeholder="Label (optional)"
            className="w-full px-3 py-2 bg-stone-800/80 border border-violet-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 placeholder-stone-500 text-stone-200 text-sm"
          />
          <button
            onClick={save}
            className="w-full py-2 rounded-lg bg-violet-800/40 border border-violet-600/30 text-violet-200 hover:bg-violet-800/60 transition-colors text-sm font-medium"
          >
            Save Bookmark
          </button>
        </div>
      )}
    </div>
  );
};

const ChapterSidebar = ({ activeId, onSelect, readIds, onToggleRead, bookmarks, onJumpBookmark, onRemoveBookmark, onJumpResult, isOpen, onClose }) => (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
    <aside className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-2xl border-r border-violet-800/20`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600/50 via-violet-400/50 to-violet-600/50" />
      <div className="p-6 border-b border-violet-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-700/50 to-violet-900/50 rounded-xl flex items-center justify-center shadow-lg border border-violet-600/30">
              <BookOpen className="w-6 h-6 text-violet-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-violet-200 tracking-wide">The Chronicle</h1>
              <p className="text-violet-600/60 text-xs tracking-widest uppercase">Violet Aegis Story</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-violet-600 hover:text-violet-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <StorySearch onJump={onJumpResult} roman={toRoman}>
          <div className="space-y-2">
            {chapters.map((ch) => {
              const isActive = activeId === ch.id;
              const isRead = readIds.includes(ch.id);
              return (
                <div
                  key={ch.id}
                  className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${isActive ? 'bg-gradient-to-r from-violet-800/40 to-violet-900/20 text-violet-200 border border-violet-600/30' : 'text-stone-400 hover:bg-stone-800/50 hover:text-violet-300 border border-transparent'}`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-500 rounded-r-full" />}
                  <button onClick={() => onSelect(ch.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                    <span className={`text-sm font-bold w-8 flex-shrink-0 ${isActive ? 'text-violet-400' : isRead ? 'text-violet-400/80' : 'text-violet-700/60'}`}>{toRoman(ch.number)}</span>
                    <span className="font-medium truncate">{ch.title}</span>
                  </button>
                  <button
                    onClick={() => onToggleRead(ch.id)}
                    aria-label={isRead ? "Mark as unread" : "Mark as read"}
                    className={`flex-shrink-0 transition-all ${isRead ? 'text-violet-400' : 'text-stone-600 opacity-0 group-hover:opacity-100 hover:text-violet-400'}`}
                  >
                    {isRead ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>

          {bookmarks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-violet-800/30">
              <p className="flex items-center gap-2 text-violet-500/70 text-xs tracking-widest uppercase px-2 mb-2">
                <Bookmark className="w-3.5 h-3.5" /> Bookmarks
              </p>
              <div className="space-y-1">
                {bookmarks.map((bm) => {
                  const chapter = chapters.find((c) => c.id === bm.chapterId);
                  if (!chapter) return null;
                  return (
                    <div key={bm.id} className="group flex items-center gap-2 px-3 py-2 rounded-lg text-stone-400 hover:bg-stone-800/50 transition-all">
                      <button onClick={() => onJumpBookmark(bm)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                        <span className="text-xs font-bold text-violet-700/60 w-6 flex-shrink-0">{toRoman(chapter.number)}</span>
                        <span className="text-sm truncate hover:text-violet-300 transition-colors">{bm.label || chapter.title}</span>
                        <span className="text-xs text-stone-600 flex-shrink-0">{bm.pct}%</span>
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(bm.id)}
                        aria-label="Delete bookmark"
                        className="flex-shrink-0 text-stone-600 opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </StorySearch>
      </nav>
      <div className="p-4 border-t border-violet-800/30">
        <p className="text-stone-500 text-xs text-center italic">Project: Divinity — The Chronicle</p>
      </div>
    </aside>
  </>
);

export default function StoryReader() {
  const { isAuthenticated, login } = useSessionAuth();
  const [activeChapterId, setActiveChapterId] = useState(() => {
    const saved = loadProgress();
    if (saved && VALID_CHAPTER_IDS.has(saved.chapterId)) return saved.chapterId;
    return chapters[0]?.id ?? null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings);
  const [readIds, setReadIds] = useState(loadReadChapters);
  const [bookmarks, setBookmarks] = useState(() => loadBookmarks(VALID_CHAPTER_IDS));
  const [jumpTick, setJumpTick] = useState(0);

  const chapterIndex = chapters.findIndex((c) => c.id === activeChapterId);
  const chapter = chapters[chapterIndex] ?? null;
  const blocks = useMemo(() => (chapter ? parseBlocks(chapter.body) : []), [chapter]);

  const updateSettings = (next) => {
    setSettings(next);
    saveSettings(next);
  };

  const markRead = (id) => {
    setReadIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveReadChapters(next);
      return next;
    });
  };

  const toggleRead = (id) => {
    setReadIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveReadChapters(next);
      return next;
    });
  };

  const addBookmark = (label, anchor) => {
    const bm = {
      id: crypto.randomUUID(),
      chapterId: activeChapterId,
      scrollY: anchor.scrollY,
      pct: Math.min(100, Math.round((anchor.scrollY / anchor.docHeight) * 100)),
      label: label.trim(),
      createdAt: Date.now(),
    };
    setBookmarks((prev) => {
      const next = [...prev, bm];
      saveBookmarks(next);
      return next;
    });
  };

  const removeBookmark = (id) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveBookmarks(next);
      return next;
    });
  };

  // Shared jump mechanism: target is {scrollY} or {blockIndex}, consumed
  // after the destination chapter has rendered.
  const pendingJumpRef = useRef(null);
  const restoredRef = useRef(false);

  const jumpTo = (chapterId, target) => {
    pendingJumpRef.current = target;
    setActiveChapterId(chapterId);
    setSidebarOpen(false);
    setJumpTick((t) => t + 1);
    if (target?.scrollY != null) saveProgress(chapterId, target.scrollY);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    // one-shot restore of saved reading position on first authenticated paint
    if (!restoredRef.current) {
      restoredRef.current = true;
      const saved = loadProgress();
      if (!pendingJumpRef.current && saved?.chapterId === activeChapterId && saved.scrollY > 0) {
        pendingJumpRef.current = { scrollY: saved.scrollY };
      }
    }
    const pending = pendingJumpRef.current;
    if (!pending) return;
    pendingJumpRef.current = null;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (pending.blockIndex != null) {
        const el = document.querySelector(`[data-block-index="${pending.blockIndex}"]`);
        if (!el) return;
        el.scrollIntoView({ block: "center" });
        el.style.transition = "box-shadow 0.4s ease, background-color 0.4s ease";
        el.style.borderRadius = "0.5rem";
        el.style.boxShadow = "0 0 24px #a78bfa40";
        el.style.backgroundColor = "rgba(139, 92, 246, 0.08)";
        setTimeout(() => {
          el.style.boxShadow = "none";
          el.style.backgroundColor = "transparent";
        }, 2000);
      } else if (pending.scrollY != null) {
        window.scrollTo(0, pending.scrollY);
      }
    }));
  }, [isAuthenticated, activeChapterId, jumpTick]);

  // persist scroll position (throttled) + auto-mark chapter read near the bottom
  useEffect(() => {
    if (!isAuthenticated) return;
    let timer = null;
    const onScroll = () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        saveProgress(activeChapterId, window.scrollY);
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
          markRead(activeChapterId);
        }
      }, 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (timer) clearTimeout(timer); };
  }, [isAuthenticated, activeChapterId]);

  const selectChapter = (id) => {
    setActiveChapterId(id);
    setSidebarOpen(false);
    saveProgress(id, 0);
    window.scrollTo(0, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 font-serif">
        <style>{THEME_STYLES}</style>
        <LockScreen onLogin={login} />
      </div>
    );
  }

  const prev = chapters[chapterIndex - 1];
  const next = chapters[chapterIndex + 1];

  return (
    <div className="min-h-screen bg-stone-900 flex relative">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />
      <FloatingParticles />

      <ChapterSidebar
        activeId={activeChapterId}
        onSelect={selectChapter}
        readIds={readIds}
        onToggleRead={toggleRead}
        bookmarks={bookmarks}
        onJumpBookmark={(bm) => jumpTo(bm.chapterId, { scrollY: bm.scrollY })}
        onRemoveBookmark={removeBookmark}
        onJumpResult={(chapterId, blockIndex) => jumpTo(chapterId, { blockIndex })}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-h-screen overflow-x-hidden relative z-10">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-violet-500 hover:text-violet-300 transition-colors bg-stone-800/50 rounded-lg border border-violet-800/30">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-violet-500/60 text-sm tracking-widest uppercase">The Chronicle</span>
          </div>

          {/* fixed so they stay reachable mid-chapter — bookmarking must not require scrolling away from the passage */}
          <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
            <BookmarkAdder onAdd={addBookmark} />
            <ReaderSettings settings={settings} onChange={updateSettings} />
          </div>

          {chapter ? (
            <>
              <header className="text-center mb-10">
                <p className="text-violet-500/60 text-sm tracking-[0.3em] uppercase mb-3">Chapter {toRoman(chapter.number)}</p>
                <h1 className="text-4xl md:text-5xl font-bold text-violet-100">{chapter.title}</h1>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent" />
                  <Sparkles className="w-4 h-4 text-violet-500/50" />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent" />
                </div>
              </header>

              <ChapterReader blocks={blocks} settings={settings} />

              <nav className="flex items-center justify-between gap-4 mt-14 pt-8 border-t border-violet-800/30">
                {prev ? (
                  <button onClick={() => selectChapter(prev.id)} className="group flex items-center gap-2 text-violet-500 hover:text-violet-300 transition-colors min-w-0">
                    <ChevronLeft className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-left min-w-0">
                      <span className="block text-xs text-stone-500 uppercase tracking-widest">Previous</span>
                      <span className="block font-medium truncate">{prev.title}</span>
                    </span>
                  </button>
                ) : <span />}
                {next ? (
                  <button onClick={() => selectChapter(next.id)} className="group flex items-center gap-2 text-violet-500 hover:text-violet-300 transition-colors min-w-0 ml-auto">
                    <span className="text-right min-w-0">
                      <span className="block text-xs text-stone-500 uppercase tracking-widest">Next</span>
                      <span className="block font-medium truncate">{next.title}</span>
                    </span>
                    <ChevronRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : <span />}
              </nav>
            </>
          ) : (
            <p className="text-stone-400 text-center py-20 italic">No chapters yet. The Chronicle awaits its first entry.</p>
          )}
        </div>
      </main>

      <style>{THEME_STYLES}</style>
    </div>
  );
}
