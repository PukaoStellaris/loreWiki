// Mute toggle shared by the character pages. Visual styling comes from each
// page's own `.soundbtn` rules so the button matches the page theme.
export default function SoundButton({ soundOn, onToggle, onLabel = "10%", offLabel = "muted" }) {
  return (
    <button
      className="soundbtn"
      aria-label={soundOn ? "Mute sound" : "Unmute sound"}
      onClick={onToggle}
    >
      {soundOn ? (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      ) : (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
      {soundOn ? onLabel : offLabel}
    </button>
  );
}
