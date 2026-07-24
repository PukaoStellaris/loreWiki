import { useCallback, useState } from "react";
import { ACCENT, ACCENT_DEEP, LOGO_IMAGE_PATH } from "../../lib/player/config";
import Icon from "./Icon";

// Renders its own container; the gradient placeholder fades out once the image
// lands, so a cached logo never flashes a coloured square.
export function LogoIcon({ size = 32, radius = 8 }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // An image restored from cache can finish decoding before React attaches
  // onLoad, so the already-complete case is caught as the node is attached.
  const attachImg = useCallback((node) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  if (!LOGO_IMAGE_PATH || failed) {
    return (
      <div style={{
        width: size, height: size, borderRadius: radius, flexShrink: 0, color: "#fff",
        background: `linear-gradient(135deg, ${ACCENT_DEEP}, ${ACCENT})`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="music" size={size * 0.55} />
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: radius, overflow: "hidden", flexShrink: 0,
      background: loaded ? "transparent" : `linear-gradient(135deg, ${ACCENT_DEEP}, ${ACCENT})`,
      transition: "background 0.3s",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <img
        ref={attachImg}
        src={LOGO_IMAGE_PATH}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{
          width: size, height: size, objectFit: "contain", borderRadius: radius,
          opacity: loaded ? 1 : 0, transition: "opacity 0.3s",
        }}
      />
    </div>
  );
}

export default LogoIcon;
