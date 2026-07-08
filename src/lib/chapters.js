// Chapter discovery: drop a .md file into src/data/chapters/ and it appears
// in the reader, ordered by its `chapter:` frontmatter (filename as tiebreak).
import { parseFrontmatter } from "./chapterParser.js";

const modules = import.meta.glob("../data/chapters/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const chapters = Object.entries(modules)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    const id = path.split("/").pop().replace(/\.md$/, "");
    return {
      id,
      number: Number.isFinite(meta.chapter) ? meta.chapter : Infinity,
      title: meta.title || id,
      body,
    };
  })
  .sort((a, b) => a.number - b.number || a.id.localeCompare(b.id));
