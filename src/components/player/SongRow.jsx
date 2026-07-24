import { memo, useEffect, useRef, useState } from "react";
import { ACCENT, ACCENT_DEEP, BORDER, TEXT, TEXT_DIM } from "../../lib/player/config";
import { clamp, fmt } from "../../lib/player/format";
import AlbumArt from "./AlbumArt";
import Icon from "./Icon";

export const ROW_COLUMNS = "44px 1fr 68px 76px";

// The thin line under the playing row. It subscribes to the player's time feed
// and writes its own width, which keeps four updates a second away from the
// list of eighty-odd rows above it.
function RowProgress({ subscribeTime, duration }) {
  const fillRef = useRef(null);

  useEffect(() => subscribeTime((time, total) => {
    const d = Number.isFinite(total) && total > 0 ? total : duration;
    if (fillRef.current) fillRef.current.style.width = `${d > 0 ? clamp(time / d, 0, 1) * 100 : 0}%`;
  }), [subscribeTime, duration]);

  return (
    <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 28, right: 28, height: 2, background: BORDER, borderRadius: 1 }}>
      <div ref={fillRef} style={{ width: "0%", height: "100%", background: `linear-gradient(90deg, ${ACCENT_DEEP}, ${ACCENT})`, borderRadius: 1 }} />
    </div>
  );
}

function RowMenu({ song, playlists, actions, onClose, inPlaylistId }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.querySelector("button")?.focus();
    const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    const node = ref.current;
    node?.addEventListener("keydown", onKey);
    return () => node?.removeEventListener("keydown", onKey);
  }, [onClose]);

  const run = (fn) => () => { fn(); onClose(); };

  return (
    <>
      <div className="menu-scrim" onClick={onClose} />
      <div className="row-menu" ref={ref} role="menu" aria-label={`Actions for ${song.title}`}>
        <button role="menuitem" className="menu-item" onClick={run(() => actions.playNext(song))}>Play next</button>
        <button role="menuitem" className="menu-item" onClick={run(() => actions.addToQueue(song))}>Add to queue</button>
        {inPlaylistId && (
          <button role="menuitem" className="menu-item" onClick={run(() => actions.removeFromPlaylist(inPlaylistId, song))}>
            Remove from this playlist
          </button>
        )}
        {song.isUpload && (
          <button role="menuitem" className="menu-item" onClick={run(() => actions.removeUpload(song))}>
            Remove upload
          </button>
        )}
        <div className="menu-label">Add to playlist</div>
        {playlists.map(p => (
          <button key={p.id} role="menuitem" className="menu-item" onClick={run(() => actions.addToPlaylist(p.id, song))}>
            {p.name}
          </button>
        ))}
        <button role="menuitem" className="menu-item menu-item-accent" onClick={run(() => actions.newPlaylistWith(song))}>
          New playlist…
        </button>
      </div>
    </>
  );
}

/**
 * One row in the track list.
 *
 * Memoised, and deliberately given only primitives plus a stable `actions`
 * object: rows that are neither playing nor open stay referentially identical
 * across a render and skip reconciliation entirely.
 */
export const SongRow = memo(function SongRow({
  song, isCurrent, isPlaying, isLiked, actions, playlists, inPlaylistId,
  subscribeTime, duration,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <li
      className={`song-row${isCurrent ? " current" : ""}`}
      style={{ gridTemplateColumns: ROW_COLUMNS }}
      aria-current={isCurrent ? "true" : undefined}
    >
      <button
        className="row-art"
        onClick={() => (isCurrent ? actions.toggle() : actions.play(song))}
        aria-label={isCurrent && isPlaying ? `Pause ${song.title}` : `Play ${song.title} by ${song.artist}`}
      >
        <AlbumArt song={song} size={40} />
        <span className="row-play" aria-hidden="true">
          <Icon name={isCurrent && isPlaying ? "pause" : "play"} size={16} />
        </span>
      </button>

      <div style={{ minWidth: 0, paddingLeft: 12 }}>
        <div className="row-title" style={{ color: isCurrent ? ACCENT : TEXT }}>{song.title}</div>
        <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {song.artist}
        </div>
      </div>

      <span style={{ textAlign: "right", color: TEXT_DIM, fontSize: 13, fontFamily: "'Space Mono', monospace" }}>
        {fmt(song.duration)}
      </span>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2, position: "relative" }}>
        <button
          className={`ctrl-btn row-action${isLiked ? " active" : ""}`}
          onClick={() => actions.toggleLike(song.id)}
          aria-pressed={isLiked}
          aria-label={isLiked ? `Unlike ${song.title}` : `Like ${song.title}`}
        >
          <Icon name={isLiked ? "heartFill" : "heart"} size={16} />
        </button>
        <button
          className={`ctrl-btn row-action${menuOpen ? " active" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label={`More actions for ${song.title}`}
        >
          <Icon name="grip" size={16} />
        </button>
        {menuOpen && (
          <RowMenu
            song={song}
            playlists={playlists}
            actions={actions}
            inPlaylistId={inPlaylistId}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>

      {isCurrent && <RowProgress subscribeTime={subscribeTime} duration={duration} />}
    </li>
  );
});

export default SongRow;
