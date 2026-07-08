// Client-side full-text search across chapters. The index is built once at
// module load (chapters are static imports) with one entry per parsed block,
// which is what makes jump-to-result possible.
import { chapters } from "./chapters.js";
import { parseBlocks } from "./chapterParser.js";

const CONTEXT = 50;

export function stripMarkup(text) {
  return text
    .replace(/\{\/?\s*[^}]*\}/g, "")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function blockText(block) {
  if (block.type === "dialogue") {
    return block.lines
      .map((l) => (l.kind === "line" ? `${l.speaker}: ${l.text}` : l.text))
      .join(" ");
  }
  return block.text ?? "";
}

const index = chapters.map((chapter) => ({
  chapter,
  blocks: parseBlocks(chapter.body).map((block, blockIndex) => ({
    blockIndex,
    text: stripMarkup(blockText(block)),
  })),
}));

// -> [{ chapterId, chapterTitle, chapterNumber, blockIndex, snippet: {before, match, after} }]
export function searchChapters(query, { maxResults = 30, perChapter = 3 } = {}) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];
  for (const { chapter, blocks } of index) {
    let hits = 0;
    for (const block of blocks) {
      if (hits >= perChapter || results.length >= maxResults) break;
      const at = block.text.toLowerCase().indexOf(q);
      if (at === -1) continue;
      const end = at + q.length;
      results.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        chapterNumber: chapter.number,
        blockIndex: block.blockIndex,
        snippet: {
          before: (at > CONTEXT ? "…" : "") + block.text.slice(Math.max(0, at - CONTEXT), at),
          match: block.text.slice(at, end),
          after: block.text.slice(end, end + CONTEXT) + (end + CONTEXT < block.text.length ? "…" : ""),
        },
      });
      hits++;
    }
    if (results.length >= maxResults) break;
  }
  return results;
}
