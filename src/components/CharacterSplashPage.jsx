import { useState, useEffect } from "react";
import useTipRotation from "../hooks/useTipRotation.js";
import useRevealOnHover from "../hooks/useRevealOnHover.js";
import "../styles/character-page.css";

const BG_IMAGE_RE = /\.(png|jpe?g|webp|gif|avif)$/i;

// Full-screen splash used by the simple character pages (Jenny, Livvy):
// background image/video, radial overlay, hover/focus-reveal title, rotating tip.
export default function CharacterSplashPage({
  bgPath,
  bgColor = "#0c0a1a",
  title,
  akaTitle,
  tips,
  tipDurationSeconds = 30,
}) {
  const [loaded, setLoaded] = useState(false);
  const { tip, tipVisible } = useTipRotation(tips, tipDurationSeconds);
  const { revealed: showAka, visible: titleVisible, bind: titleBind } = useRevealOnHover();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1700);
    return () => clearTimeout(t);
  }, []);

  const bgIsImage = BG_IMAGE_RE.test(bgPath || "");

  return (
    <div style={{
      width: "100%", height: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: bgColor, overflow: "hidden",
      position: "relative", fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {bgPath && bgIsImage && (
        <img src={bgPath} alt="" className="csp-bg" />
      )}
      {bgPath && !bgIsImage && (
        <video src={bgPath} autoPlay loop muted playsInline className="csp-bg" />
      )}
      {!bgPath && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: bgColor }} />
      )}

      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: bgPath
          ? `radial-gradient(ellipse at center, ${bgColor}77 0%, ${bgColor}cc 70%, ${bgColor}ee 100%)`
          : "transparent",
      }} />

      <div style={{
        position: "relative", zIndex: 2, textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
      }}>
        <h1
          {...(akaTitle ? titleBind : {})}
          className={loaded ? "" : "csp-enter-top"}
          style={{
            fontSize: 52, fontWeight: 700, color: "#ffffff",
            letterSpacing: "-0.03em", lineHeight: 1.1,
            fontFamily: "'DM Sans', sans-serif",
            textShadow: "0 0 10px #000000cc, 0 0 30px #000000aa, 0 2px 4px #000000ee",
            cursor: "default",
            opacity: loaded ? (titleVisible ? 1 : 0) : undefined,
            transition: loaded ? "opacity 0.2s ease-in-out" : "none",
          }}
        >
          {showAka && akaTitle ? akaTitle : title}
        </h1>

        <div style={{ minHeight: 52, maxWidth: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p
            className={loaded ? "" : "csp-enter-bottom"}
            style={{
              fontSize: 16, color: "#d4d0e0", maxWidth: 500,
              lineHeight: 1.6, fontWeight: 400,
              textShadow: "0 0 8px #000000cc, 0 0 20px #000000aa, 0 1px 3px #000000ee",
              opacity: loaded ? (tipVisible ? 1 : 0) : undefined,
              transition: loaded ? "opacity 0.5s ease-in-out" : "none",
            }}
          >
            {tip}
          </p>
        </div>
      </div>
    </div>
  );
}
