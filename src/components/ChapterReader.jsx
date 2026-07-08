import { Sparkles } from "lucide-react";
import InlineText from "./InlineText.jsx";
import DialogueBox from "./DialogueBox.jsx";
import { DEFAULT_SETTINGS } from "../lib/storyStorage.js";

const HEADING_CLASSES = {
  1: "text-3xl md:text-4xl font-bold text-violet-200 mt-10 mb-4",
  2: "text-2xl md:text-3xl font-bold text-violet-200 mt-10 mb-4",
  3: "text-xl md:text-2xl font-semibold text-violet-300 mt-8 mb-3",
};

const SceneBreak = () => (
  <div className="flex items-center gap-4 my-8">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent" />
    <Sparkles className="w-4 h-4 text-violet-500/50" />
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent" />
  </div>
);

const BLOCK_TYPES = ["heading", "break", "quote", "dialogue"];

// Renders the block list produced by parseBlocks() in src/lib/chapterParser.js.
// Font size / line height come from reader settings and cascade from the root;
// each block carries data-block-index so search results can scroll to it.
export default function ChapterReader({ blocks, settings = DEFAULT_SETTINGS }) {
  const firstParagraphIndex = blocks.findIndex((b) => !BLOCK_TYPES.includes(b.type));
  return (
    <div style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeight }}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} data-block-index={i} className={HEADING_CLASSES[block.level] || HEADING_CLASSES[3]}>
                <InlineText text={block.text} />
              </h2>
            );
          case "break":
            return (
              <div key={i} data-block-index={i}>
                <SceneBreak />
              </div>
            );
          case "quote":
            return (
              <blockquote key={i} data-block-index={i} className="border-l-2 border-violet-600/40 pl-4 my-6 italic text-stone-400">
                <InlineText text={block.text} />
              </blockquote>
            );
          case "dialogue":
            return (
              <div key={i} data-block-index={i}>
                <DialogueBox lines={block.lines} />
              </div>
            );
          default: {
            const dropCap = i === firstParagraphIndex;
            return (
              <p
                key={i}
                data-block-index={i}
                className={`text-stone-300 my-4 ${
                  dropCap
                    ? "first-letter:text-[1.8em] first-letter:font-bold first-letter:text-violet-300"
                    : "indent-8"
                }`}
              >
                <InlineText text={block.text} />
              </p>
            );
          }
        }
      })}
    </div>
  );
}
