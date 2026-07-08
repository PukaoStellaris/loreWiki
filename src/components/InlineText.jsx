import { parseInline } from "../lib/chapterParser.js";
import { resolveColor } from "../lib/speakers.js";

function renderTokens(tokens) {
  return tokens.map((token, i) => {
    switch (token.type) {
      case "em":
        return <em key={i}>{renderTokens(token.children)}</em>;
      case "strong":
        return <strong key={i}>{renderTokens(token.children)}</strong>;
      case "color": {
        const color = resolveColor(token.name);
        return (
          <span key={i} style={{ color, textShadow: `0 0 12px ${color}59` }}>
            {renderTokens(token.children)}
          </span>
        );
      }
      default:
        return token.value;
    }
  });
}

// Renders chapter inline markup: **bold**, *italic*, {name}colored{/}.
export default function InlineText({ text }) {
  return <>{renderTokens(parseInline(text))}</>;
}
