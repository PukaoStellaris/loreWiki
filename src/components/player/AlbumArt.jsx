import { memo, useState } from "react";
import Icon from "./Icon";

const ART_COLORS = ["#c4b5fd", "#f9a8d4", "#93c5fd", "#fcd34d", "#6ee7b7", "#fca5a5", "#a78bfa", "#67e8f9"];

// Deterministic per-track colours. Ids are content hashes now, so this sums the
// characters rather than indexing by a number that no longer exists.
function hueIndex(id) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum = (sum + id.charCodeAt(i)) % 4096;
  return sum;
}

// Shows real cover art when a track carries it, and a stable gradient otherwise.
// Cover URLs come from the build-time manifest, so they are plain cacheable
// files — no object URLs to leak, and lazy loading keeps long lists cheap.
export const AlbumArt = memo(function AlbumArt({ song, size = 48 }) {
  const [failed, setFailed] = useState(false);

  if (song.cover && !failed) {
    return (
      <img
        src={song.cover}
        alt=""
        loading="lazy"
        decoding="async"
        width={size}
        height={size}
        onError={() => setFailed(true)}
        style={{ width: size, height: size, minWidth: size, borderRadius: 6, objectFit: "cover", display: "block" }}
      />
    );
  }

  const i = hueIndex(song.id);
  const bg = ART_COLORS[i % ART_COLORS.length];
  const bg2 = ART_COLORS[(i + 3) % ART_COLORS.length];
  return (
    <div
      aria-hidden="true"
      style={{
        width: size, height: size, minWidth: size, borderRadius: 6,
        background: `linear-gradient(135deg, ${bg}44, ${bg2}66)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${bg}33`, position: "relative", overflow: "hidden",
        color: bg,
      }}
    >
      <div style={{
        position: "absolute", width: size * 0.6, height: size * 0.6,
        borderRadius: "50%", background: `${bg}22`,
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        border: `2px solid ${bg}44`,
      }} />
      <div style={{ position: "relative" }}><Icon name="music" size={size * 0.35} /></div>
    </div>
  );
});

export default AlbumArt;
