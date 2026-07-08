import InlineText from "./InlineText.jsx";
import { resolveSpeaker } from "../lib/speakers.js";

// Conversation between lore characters. Standalone and reusable — pass a
// `lines` array directly (the story reader gets one from :::dialogue blocks):
//   [{ kind: 'line', speaker: 'Sentinel', tone: 'softly'|null, text: '...' },
//    { kind: 'direction', text: '...' }]
// Speaker name/color/portrait resolve from src/data/characters.js; unknown
// speakers fall back to gray with an initial-letter avatar.

function Portrait({ speaker }) {
  if (speaker.image) {
    return (
      <img
        src={speaker.image}
        alt=""
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2"
        style={{ borderColor: `${speaker.color}99` }}
      />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-full flex-shrink-0 border-2 flex items-center justify-center font-bold text-lg bg-stone-900"
      style={{ borderColor: `${speaker.color}99`, color: speaker.color }}
    >
      {speaker.name.charAt(0).toUpperCase()}
    </div>
  );
}

function SpeechGroup({ speakerName, tone, texts }) {
  const speaker = resolveSpeaker(speakerName);
  return (
    <div className="flex gap-3 items-start">
      <Portrait speaker={speaker} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-sm tracking-wide" style={{ color: speaker.color }}>
            {speaker.name}
          </span>
          {tone && <span className="text-xs italic text-stone-500">({tone})</span>}
        </div>
        <div className="space-y-1.5">
          {texts.map((text, i) => (
            <div
              key={i}
              className="bg-stone-900/70 border rounded-xl rounded-tl-sm px-4 py-2.5 text-stone-300 leading-relaxed w-fit max-w-full"
              style={{ borderColor: `${speaker.color}59` }}
            >
              <InlineText text={text} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DialogueBox({ lines }) {
  // group consecutive lines from the same speaker under one portrait
  const groups = [];
  for (const line of lines) {
    if (line.kind === "direction") {
      groups.push({ kind: "direction", text: line.text });
      continue;
    }
    const prev = groups[groups.length - 1];
    if (prev?.kind === "speech" && prev.speaker === line.speaker && !line.tone) {
      prev.texts.push(line.text);
    } else {
      groups.push({ kind: "speech", speaker: line.speaker, tone: line.tone, texts: [line.text] });
    }
  }

  return (
    <div className="my-6 space-y-4 bg-stone-950/40 border border-violet-800/20 rounded-2xl p-4 md:p-5">
      {groups.map((group, i) =>
        group.kind === "direction" ? (
          <div key={i} className="text-center italic text-stone-500 text-sm py-1">
            <InlineText text={group.text} />
          </div>
        ) : (
          <SpeechGroup key={i} speakerName={group.speaker} tone={group.tone} texts={group.texts} />
        )
      )}
    </div>
  );
}
