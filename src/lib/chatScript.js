// Chat-studio script parser. Same line conventions as the story's
// :::dialogue blocks, plus two chat-only extensions:
//
//   Speaker: text                  message bubble
//   Speaker (tone): text           tone shows as a small italic label
//   Speaker [photo]: /images/x.png photo message (url or /images/... path)
//   Speaker [sticker]: sentinel    sticker — a character name (their portrait)
//                                  or an image url, rendered big with no bubble
//   > text                         centered system line / stage direction
//   ??? Option A | Option B        choice chips — the picked one is sent
//                                  by the POV speaker and playback continues
//
// -> [{ kind:'message', speaker, tone, text, media:'photo'|'sticker'|null } |
//     { kind:'direction', text } |
//     { kind:'options', options: [...] }]
export function parseChatScript(raw) {
  const events = [];
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("???")) {
      const options = line.slice(3).split("|").map((o) => o.trim()).filter(Boolean);
      if (options.length) events.push({ kind: "options", options });
      continue;
    }

    if (line.startsWith("> ") || line === ">") {
      events.push({ kind: "direction", text: line.replace(/^>\s?/, "") });
      continue;
    }

    const colon = line.indexOf(":");
    if (colon > 0) {
      let speaker = line.slice(0, colon).trim();
      let tone = null;
      let media = null;
      const mediaMatch = speaker.match(/\[(photo|sticker)\]$/i);
      if (mediaMatch) {
        media = mediaMatch[1].toLowerCase();
        speaker = speaker.replace(/\s*\[(photo|sticker)\]$/i, "").trim();
      }
      const toneMatch = speaker.match(/^(.*?)\s*\((.*)\)$/);
      if (toneMatch) { speaker = toneMatch[1]; tone = toneMatch[2]; }
      events.push({ kind: "message", speaker, tone, media, text: line.slice(colon + 1).trim() });
      continue;
    }

    // bare line continues the previous message, mirroring the story parser
    const prev = events[events.length - 1];
    if (prev?.kind === "message" && !prev.media) prev.text += " " + line;
    else events.push({ kind: "direction", text: line });
  }
  return events;
}

// Distinct speaker names in script order (for the POV dropdown).
export function scriptSpeakers(events) {
  const seen = new Set();
  const out = [];
  for (const e of events) {
    if (e.kind !== "message") continue;
    const key = e.speaker.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e.speaker);
  }
  return out;
}
