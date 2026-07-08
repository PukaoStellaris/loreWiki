import React from "react";
import { Moon, ChevronRight } from "lucide-react";

// Vertical glowing timeline for the History category. Events arrive already
// filtered by search and in chronological (array) order.
const excerpt = (text) => {
  const first = text
    .split("\n\n")[0]
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1");
  return first.length > 140 ? first.slice(0, 140).trimEnd() + "…" : first;
};

export default function HistoryTimeline({ events, onSelectItem }) {
  return (
    <div className="relative">
      {/* rail + glow twin */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/10 via-violet-500/60 to-violet-500/10" />
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 blur-sm bg-violet-600/20" />

      <div className="space-y-10 pb-4">
        {events.map((event, i) => {
          const showEra = event.era && event.era !== events[i - 1]?.era;
          const left = i % 2 === 0;
          return (
            <React.Fragment key={event.id}>
              {showEra && (
                <div className="relative flex justify-start md:justify-center pl-14 md:pl-0">
                  <span className="relative z-10 flex items-center gap-2 px-4 py-1 rounded-full bg-violet-900/60 border border-violet-600/40 text-violet-300 text-xs tracking-widest uppercase">
                    <Moon className="w-3 h-3" /> {event.era}
                  </span>
                </div>
              )}
              <div className="relative">
                {/* node dot on the rail */}
                <div className="absolute left-6 md:left-1/2 top-8 -translate-x-1/2 z-10">
                  <span className="block w-4 h-4 rounded-full bg-violet-500 shadow-[0_0_12px_#a78bfa] ring-4 ring-violet-500/20" />
                </div>
                <div className={`pl-14 md:pl-0 md:w-1/2 ${left ? "md:pr-10" : "md:ml-auto md:pl-10"}`}>
                  <button onClick={() => onSelectItem(event)} className="group w-full text-left relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <div className="relative bg-gradient-to-br from-stone-800/90 via-stone-800/80 to-stone-900/90 rounded-xl overflow-hidden border border-violet-700/30 group-hover:border-violet-500/50 transition-all duration-500 shadow-lg">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                      <div className="flex items-start p-5 gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-900/50 to-stone-900 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-500 border border-violet-700/30 overflow-hidden">
                          <img src={event.image} className="rounded-lg object-cover w-full h-full" alt={event.name} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-violet-500/70 text-xs tracking-widest uppercase">{event.infobox?.["Time Period"] ?? event.era}</p>
                          <h3 className="font-bold text-violet-100 text-lg group-hover:text-violet-300 transition-colors">{event.name}</h3>
                          <p className="text-stone-400 text-sm mt-1 italic">{excerpt(event.description)}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-violet-600/50 group-hover:text-violet-400 group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
