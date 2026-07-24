import { TEXT_DIM, TEXT_MUTED } from "../../lib/player/config";
import Icon from "./Icon";
import SongRow, { ROW_COLUMNS } from "./SongRow";

export function TrackList({
  title, songs, currentId, isPlaying, liked, actions, playlists, inPlaylistId,
  subscribeTime, duration, emptyMessage, onPlayAll, onShuffleAll,
}) {
  return (
    <section aria-label={title} style={{ paddingBottom: 24 }}>
      <div style={{ padding: "14px 28px 10px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 13, color: TEXT_DIM }}>
          {songs.length} track{songs.length === 1 ? "" : "s"}
        </span>
        <div style={{ flex: 1 }} />
        {songs.length > 0 && (
          <>
            <button className="pill-btn" onClick={onPlayAll}>
              <Icon name="play" size={13} /> Play
            </button>
            <button className="pill-btn" onClick={onShuffleAll}>
              <Icon name="shuffle" size={13} /> Shuffle
            </button>
          </>
        )}
      </div>

      {songs.length === 0 ? (
        <p style={{ padding: "40px 28px", color: TEXT_MUTED, fontSize: 14 }}>{emptyMessage}</p>
      ) : (
        <>
          <div
            aria-hidden="true"
            style={{
              display: "grid", gridTemplateColumns: ROW_COLUMNS, gap: 0,
              padding: "6px 28px", fontSize: 11, color: TEXT_MUTED, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.06em",
              borderBottom: "1px solid #1e1a3a55",
            }}
          >
            <span />
            <span style={{ paddingLeft: 12 }}>Title</span>
            <span style={{ textAlign: "right" }}>Time</span>
            <span />
          </div>

          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {songs.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                isCurrent={song.id === currentId}
                // Only the playing row ever receives a true here, so toggling
                // play/pause re-renders one row instead of the whole library.
                isPlaying={song.id === currentId && isPlaying}
                isLiked={liked.has(song.id)}
                actions={actions}
                playlists={playlists}
                inPlaylistId={inPlaylistId}
                subscribeTime={subscribeTime}
                duration={song.id === currentId ? duration : 0}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default TrackList;
