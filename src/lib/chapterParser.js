// Chapter markup parser — pure functions, no dependencies.
//
// Supported markup:
//   Frontmatter   ---\ntitle: ...\nchapter: N\n---   (must start on line 1)
//   Blocks        # / ## / ### headings · --- or *** scene break · > blockquote
//                 · :::dialogue ... ::: · anything else = paragraph
//   Inline        **bold** · *italic* · {name}colored text{/} · \* \{ escapes
//   Dialogue      "Speaker: text" · "Speaker (tone): text" · "> stage direction"

export function parseFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return { meta: {}, body: raw };
  const meta = {};
  let i = 1;
  for (; i < lines.length; i++) {
    if (lines[i].trim() === "---") { i++; break; }
    const colon = lines[i].indexOf(":");
    if (colon === -1) continue;
    const key = lines[i].slice(0, colon).trim();
    let value = lines[i].slice(colon + 1).trim();
    if (/^".*"$/.test(value) || /^'.*'$/.test(value)) value = value.slice(1, -1);
    meta[key] = key === "chapter" ? Number(value) : value;
  }
  return { meta, body: lines.slice(i).join("\n") };
}

function parseDialogueLines(rawLines) {
  const lines = [];
  for (const raw of rawLines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("> ") || line === ">") {
      lines.push({ kind: "direction", text: line.replace(/^>\s?/, "") });
      continue;
    }
    const colon = line.indexOf(":");
    if (colon > 0) {
      let speaker = line.slice(0, colon).trim();
      let tone = null;
      const toneMatch = speaker.match(/^(.*?)\s*\((.*)\)$/);
      if (toneMatch) { speaker = toneMatch[1]; tone = toneMatch[2]; }
      lines.push({ kind: "line", speaker, tone, text: line.slice(colon + 1).trim() });
    } else if (lines.length && lines[lines.length - 1].kind === "line") {
      // continuation of the previous speech line
      lines[lines.length - 1].text += " " + line;
    } else {
      lines.push({ kind: "direction", text: line });
    }
  }
  return lines;
}

export function parseBlocks(body) {
  const lines = body.split(/\r?\n/);
  const blocks = [];
  let para = [];
  let quote = [];
  let dialogue = null; // collecting raw dialogue lines when non-null

  const flushPara = () => {
    if (para.length) { blocks.push({ type: "paragraph", text: para.join(" ") }); para = []; }
  };
  const flushQuote = () => {
    if (quote.length) { blocks.push({ type: "quote", text: quote.join(" ") }); quote = []; }
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (dialogue !== null) {
      if (line === ":::") {
        blocks.push({ type: "dialogue", lines: parseDialogueLines(dialogue) });
        dialogue = null;
      } else {
        dialogue.push(raw);
      }
      continue;
    }

    if (line === ":::dialogue") {
      flushPara(); flushQuote();
      dialogue = [];
      continue;
    }
    if (!line) { flushPara(); flushQuote(); continue; }
    if (line === "---" || line === "***") {
      flushPara(); flushQuote();
      blocks.push({ type: "break" });
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushPara(); flushQuote();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      continue;
    }
    if (line.startsWith("> ") || line === ">") {
      flushPara();
      quote.push(line.replace(/^>\s?/, ""));
      continue;
    }
    flushQuote();
    para.push(line);
  }

  // unterminated dialogue block: render what we collected
  if (dialogue !== null) blocks.push({ type: "dialogue", lines: parseDialogueLines(dialogue) });
  flushPara(); flushQuote();
  return blocks;
}

// Tokenizes inline markup into [{type:'text',value} | {type:'em'|'strong'|'color', children, name?}]
export function parseInline(text) {
  const tokens = [];
  let buf = "";
  let i = 0;
  const flush = () => { if (buf) { tokens.push({ type: "text", value: buf }); buf = ""; } };

  while (i < text.length) {
    const ch = text[i];
    if (ch === "\\" && i + 1 < text.length) { buf += text[i + 1]; i += 2; continue; }

    if (ch === "{") {
      const close = text.indexOf("}", i + 1);
      const name = close !== -1 ? text.slice(i + 1, close).trim() : null;
      if (name && name !== "/") {
        const end = text.indexOf("{/}", close + 1);
        const inner = end === -1 ? text.slice(close + 1) : text.slice(close + 1, end);
        flush();
        tokens.push({ type: "color", name, children: parseInline(inner) });
        i = end === -1 ? text.length : end + 3;
        continue;
      }
    }

    if (ch === "*") {
      const isBold = text[i + 1] === "*";
      const marker = isBold ? "**" : "*";
      const end = text.indexOf(marker, i + marker.length);
      if (end !== -1 && end > i + marker.length) {
        flush();
        const inner = text.slice(i + marker.length, end);
        tokens.push({ type: isBold ? "strong" : "em", children: parseInline(inner) });
        i = end + marker.length;
        continue;
      }
    }

    buf += ch;
    i++;
  }
  flush();
  return tokens;
}
