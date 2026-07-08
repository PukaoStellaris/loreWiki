import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { searchChapters } from "../lib/storySearch.js";

// Sidebar search across all chapters. While a query is active the results
// list replaces `children` (the chapter TOC); clearing restores it.
export default function StorySearch({ onJump, roman, children }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setResults(searchChapters(query)), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const active = query.trim().length > 0;

  return (
    <>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the Chronicle..."
          className="w-full pl-9 pr-9 py-2 bg-stone-800/80 border border-violet-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder-stone-500 text-stone-200 text-sm"
        />
        {active && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-600 hover:text-violet-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!active ? (
        children
      ) : results.length === 0 ? (
        <p className="text-stone-500 text-sm text-center italic py-8">No echoes found in the Chronicle.</p>
      ) : (
        <div className="space-y-2">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => onJump(r.chapterId, r.blockIndex)}
              className="w-full text-left px-3 py-2.5 rounded-xl border border-transparent hover:bg-stone-800/50 hover:border-violet-800/30 transition-all"
            >
              <p className="text-xs text-violet-500/70 tracking-widest uppercase mb-1">
                {roman(r.chapterNumber)} · {r.chapterTitle}
              </p>
              <p className="text-sm text-stone-400 leading-snug">
                {r.snippet.before}
                <span className="text-violet-300 bg-violet-500/20 rounded px-0.5">{r.snippet.match}</span>
                {r.snippet.after}
              </p>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
