import { useState } from "react";
import { BG_PANEL, BORDER, TEXT, TEXT_DIM, TEXT_MUTED } from "../../lib/player/config";
import { fmt } from "../../lib/player/format";
import AlbumArt from "./AlbumArt";
import Icon from "./Icon";

const UP_NEXT_LIMIT = 50;

function SectionLabel({ children, action }) {
  return (
    <div style={{
      padding: "14px 14px 8px", fontSize: 11, fontWeight: 600, color: TEXT_MUTED,
      textTransform: "uppercase", letterSpacing: "0.08em",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ flex: 1 }}>{children}</span>
      {action}
    </div>
  );
}

function QueueEntry({ song, label, onPlay, right }) {
  return (
    <div className="queue-row">
      <button className="queue-main" onClick={onPlay} aria-label={`Play ${song.title} by ${song.artist}`}>
        <span style={{ fontSize: 11, color: TEXT_MUTED, minWidth: 18, textAlign: "right", fontFamily: "'Space Mono', monospace" }}>
          {label}
        </span>
        <AlbumArt song={song} size={32} />
        <span style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
          <span className="row-title" style={{ fontSize: 13, color: TEXT, display: "block" }}>{song.title}</span>
          <span style={{ fontSize: 11, color: TEXT_DIM, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {song.artist}
          </span>
        </span>
        <span style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>
          {fmt(song.duration)}
        </span>
      </button>
      {right}
    </div>
  );
}

/**
 * Up-next panel.
 *
 * Two lists, deliberately: tracks the user queued by hand come first and can be
 * reordered or dropped, and the remainder of the playing context follows below
 * as a read-only preview.
 */
export function QueuePanel({
  userQueue, upNext, onPlayQueued, onRemoveQueued, onMoveQueued, onClearQueue, onPlaySong, onClose,
}) {
  const [dragIndex, setDragIndex] = useState(null);

  const move = (from, to) => {
    if (to < 0 || to >= userQueue.length || from === to) return;
    onMoveQueued(from, to);
  };

  return (
    <aside
      aria-label="Play queue"
      style={{
        width: 280, minWidth: 280, background: BG_PANEL, borderLeft: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "12px 8px 4px 16px", borderBottom: `1px solid ${BORDER}55` }}>
        <h2 style={{ flex: 1, fontSize: 13, fontWeight: 600, margin: 0 }}>Up next</h2>
        <button className="ctrl-btn" onClick={onClose} aria-label="Close queue panel">
          <Icon name="close" size={16} />
        </button>
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {userQueue.length > 0 && (
          <>
            <SectionLabel
              action={
                <button className="link-btn" onClick={onClearQueue}>Clear</button>
              }
            >
              Queued by you
            </SectionLabel>
            {userQueue.map((song, i) => (
              <div
                key={`${song.id}-${i}`}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null) move(dragIndex, i);
                  setDragIndex(null);
                }}
                style={{ opacity: dragIndex === i ? 0.4 : 1 }}
              >
                <QueueEntry
                  song={song}
                  label={i + 1}
                  onPlay={() => onPlayQueued(i)}
                  right={
                    <div className="queue-actions">
                      {/* Dragging is the fast path; these keep reordering
                          reachable without a pointer. */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <button
                          className="nudge-btn" disabled={i === 0}
                          onClick={() => move(i, i - 1)} aria-label={`Move ${song.title} up`}
                        >▲</button>
                        <button
                          className="nudge-btn" disabled={i === userQueue.length - 1}
                          onClick={() => move(i, i + 1)} aria-label={`Move ${song.title} down`}
                        >▼</button>
                      </div>
                      <button
                        className="ctrl-btn"
                        onClick={() => onRemoveQueued(i)}
                        aria-label={`Remove ${song.title} from the queue`}
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  }
                />
              </div>
            ))}
          </>
        )}

        <SectionLabel>{userQueue.length ? "Then from this list" : "Next from this list"}</SectionLabel>
        {upNext.length === 0 ? (
          <p style={{ padding: "8px 16px 20px", fontSize: 12, color: TEXT_MUTED }}>
            Nothing further queued.
          </p>
        ) : (
          upNext.slice(0, UP_NEXT_LIMIT).map((song, i) => (
            <QueueEntry key={`${song.id}-${i}`} song={song} label={i + 1} onPlay={() => onPlaySong(song)} />
          ))
        )}
        {upNext.length > UP_NEXT_LIMIT && (
          <p style={{ padding: "4px 16px 20px", fontSize: 11, color: TEXT_MUTED }}>
            + {upNext.length - UP_NEXT_LIMIT} more
          </p>
        )}
      </div>
    </aside>
  );
}

export default QueuePanel;
