import { useState } from "react";
import { ACCENT, BG_PANEL, BORDER, SPEED_OPTIONS, TEXT, TEXT_DIM, TEXT_MUTED } from "../../lib/player/config";
import { REPEAT_ALL, REPEAT_OFF, REPEAT_ONE } from "../../hooks/usePlayer";
import AlbumArt from "./AlbumArt";
import Icon from "./Icon";
import ProgressBar from "./ProgressBar";

const REPEAT_LABEL = {
  [REPEAT_OFF]: "Repeat off",
  [REPEAT_ALL]: "Repeat all",
  [REPEAT_ONE]: "Repeat one",
};

export function NowPlayingBar({
  player, isLiked, onToggleLike, miniPlayer, onToggleMini, showVisualizer, onToggleVisualizer,
  showQueue, onToggleQueue,
}) {
  const [speedOpen, setSpeedOpen] = useState(false);
  const { currentSong, isPlaying, duration, shuffle, repeat, volume, muted, rate } = player;

  return (
    <div style={{
      height: 84, minHeight: 84, background: BG_PANEL, borderTop: `1px solid ${BORDER}`,
      display: "flex", alignItems: "center", padding: "0 20px", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, width: 260, minWidth: 150 }}>
        {currentSong ? (
          <>
            <AlbumArt song={currentSong} size={50} />
            <div style={{ minWidth: 0 }}>
              <div className="row-title" style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{currentSong.title}</div>
              <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentSong.artist}
              </div>
            </div>
            <button
              className={`ctrl-btn${isLiked ? " active" : ""}`}
              onClick={() => onToggleLike(currentSong.id)}
              aria-pressed={isLiked}
              aria-label={isLiked ? "Unlike this track" : "Like this track"}
              style={{ flexShrink: 0 }}
            >
              <Icon name={isLiked ? "heartFill" : "heart"} size={18} />
            </button>
          </>
        ) : (
          <span style={{ color: TEXT_MUTED, fontSize: 13 }}>No track selected</span>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            className={`ctrl-btn${shuffle ? " active" : ""}`}
            onClick={player.toggleShuffle}
            aria-pressed={shuffle}
            aria-label="Shuffle"
          >
            <Icon name="shuffle" size={16} />
          </button>
          <button className="ctrl-btn" onClick={player.prev} disabled={!currentSong} aria-label="Previous track">
            <Icon name="skipBack" size={18} />
          </button>
          <button
            className="ctrl-btn play-main"
            onClick={player.toggle}
            disabled={!currentSong}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <Icon name={isPlaying ? "pause" : "play"} size={20} />
          </button>
          <button className="ctrl-btn" onClick={player.next} disabled={!currentSong} aria-label="Next track">
            <Icon name="skipFwd" size={18} />
          </button>
          <button
            className={`ctrl-btn${repeat !== REPEAT_OFF ? " active" : ""}`}
            onClick={player.cycleRepeat}
            aria-label={REPEAT_LABEL[repeat]}
            style={{ position: "relative" }}
          >
            <Icon name="repeat" size={16} />
            {repeat === REPEAT_ONE && (
              <span aria-hidden="true" style={{
                position: "absolute", bottom: 2, right: 2, fontSize: 8, fontWeight: 700,
                color: ACCENT, lineHeight: 1,
              }}>1</span>
            )}
          </button>
        </div>

        <ProgressBar
          subscribeTime={player.subscribeTime}
          duration={duration}
          seek={player.seek}
          disabled={!currentSong}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
        <button
          className={`ctrl-btn${showVisualizer ? " active" : ""}`}
          onClick={onToggleVisualizer}
          aria-pressed={showVisualizer}
          aria-label="Visualizer"
        >
          <Icon name="waves" size={18} />
        </button>

        <button
          className={`ctrl-btn${showQueue ? " active" : ""}`}
          onClick={onToggleQueue}
          aria-pressed={showQueue}
          aria-label="Queue"
        >
          <Icon name="queue" size={18} />
        </button>

        <div style={{ position: "relative" }}>
          <button
            className={`ctrl-btn${rate !== 1 ? " active" : ""}`}
            onClick={() => setSpeedOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={speedOpen}
            aria-label={`Playback speed, currently ${rate}x`}
            style={{
              padding: "4px 8px", borderRadius: 6, fontSize: 12,
              fontFamily: "'Space Mono', monospace", fontWeight: 700, minWidth: 44,
            }}
          >
            {rate}x
          </button>
          {speedOpen && (
            <>
              <div className="menu-scrim" onClick={() => setSpeedOpen(false)} />
              <div className="speed-menu" role="menu" aria-label="Playback speed">
                {SPEED_OPTIONS.map(r => (
                  <button
                    key={r}
                    role="menuitemradio"
                    aria-checked={rate === r}
                    className={`speed-opt${rate === r ? " active" : ""}`}
                    onClick={() => { player.setRate(r); setSpeedOpen(false); }}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          className="ctrl-btn"
          onClick={player.toggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          <Icon name={muted || volume === 0 ? "volumeMute" : "volume"} size={18} />
        </button>
        <input
          type="range" min="0" max="1" step="0.01"
          value={muted ? 0 : volume}
          onChange={e => player.setVolume(parseFloat(e.target.value))}
          aria-label="Volume"
          style={{ width: 84 }}
        />

        <button
          className={`ctrl-btn${miniPlayer ? " active" : ""}`}
          onClick={onToggleMini}
          aria-pressed={miniPlayer}
          aria-label={miniPlayer ? "Expand player" : "Collapse to mini player"}
        >
          <Icon name={miniPlayer ? "expand" : "minimize"} size={16} />
        </button>
      </div>
    </div>
  );
}

export default NowPlayingBar;
