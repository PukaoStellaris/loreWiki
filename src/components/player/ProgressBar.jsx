import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, fmt } from "../../lib/player/format";
import { SEEK_STEP_SECONDS, TEXT_DIM } from "../../lib/player/config";

const PAGE_STEP_SECONDS = 30;

/**
 * Scrubber for the now-playing bar.
 *
 * The fill and the elapsed clock are written straight to the DOM from the
 * player's time feed, so a playing track costs zero React renders per frame.
 * Only the accessible value is state, and that updates about once a second.
 */
export function ProgressBar({ subscribeTime, duration, seek, disabled }) {
  const barRef = useRef(null);
  const fillRef = useRef(null);
  const elapsedRef = useRef(null);
  const draggingRef = useRef(false);
  const [ariaTime, setAriaTime] = useState(0);
  const [hover, setHover] = useState(null);

  const paint = useCallback((time, total) => {
    const d = Number.isFinite(total) && total > 0 ? total : duration;
    const pct = d > 0 ? clamp(time / d, 0, 1) * 100 : 0;
    if (fillRef.current) fillRef.current.style.width = `${pct}%`;
    if (elapsedRef.current) elapsedRef.current.textContent = fmt(time);
  }, [duration]);

  useEffect(() => {
    let lastAria = 0;
    return subscribeTime((time, total) => {
      if (draggingRef.current) return;
      paint(time, total);
      if (Math.abs(time - lastAria) >= 1) {
        lastAria = time;
        setAriaTime(time);
      }
    });
  }, [subscribeTime, paint]);

  const timeAt = useCallback((clientX) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect?.width || !duration) return null;
    return clamp((clientX - rect.left) / rect.width, 0, 1) * duration;
  }, [duration]);

  const onPointerDown = (e) => {
    if (disabled || e.button !== 0) return;
    const time = timeAt(e.clientX);
    if (time === null) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    paint(time, duration);
    setAriaTime(time);
  };

  const onPointerMove = (e) => {
    const time = timeAt(e.clientX);
    if (time === null) return;
    // Rounded, so the preview label only re-renders once per second of travel
    // instead of once per pointer event.
    setHover(prev => (prev === Math.round(time) ? prev : Math.round(time)));
    if (!draggingRef.current) return;
    paint(time, duration);
    setAriaTime(time);
  };

  const endDrag = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const time = timeAt(e.clientX);
    if (time !== null) seek(time);
  };

  const onKeyDown = (e) => {
    if (disabled || !duration) return;
    const step = { ArrowRight: SEEK_STEP_SECONDS, ArrowLeft: -SEEK_STEP_SECONDS, PageUp: PAGE_STEP_SECONDS, PageDown: -PAGE_STEP_SECONDS }[e.key];
    if (step !== undefined) {
      e.preventDefault();
      seek(clamp(ariaTime + step, 0, duration));
      return;
    }
    if (e.key === "Home") { e.preventDefault(); seek(0); }
    else if (e.key === "End") { e.preventDefault(); seek(duration); }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 600 }}>
      <span
        ref={elapsedRef}
        style={{ fontSize: 11, color: TEXT_DIM, fontFamily: "'Space Mono', monospace", minWidth: 40, textAlign: "right" }}
      >
        0:00
      </span>

      <div
        ref={barRef}
        className="progress-bar"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration) || 0}
        aria-valuenow={Math.round(ariaTime) || 0}
        aria-valuetext={`${fmt(ariaTime)} of ${fmt(duration)}`}
        aria-disabled={disabled || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKeyDown}
      >
        {/* Width is owned by `paint`. React never rewrites it because the JSX
            value below is identical on every render. */}
        <div ref={fillRef} className="progress-fill" style={{ width: "0%" }} />
        {hover !== null && duration > 0 && (
          <span className="scrub-tip" style={{ left: `${clamp(hover / duration, 0, 1) * 100}%` }}>
            {fmt(hover)}
          </span>
        )}
      </div>

      <span style={{ fontSize: 11, color: TEXT_DIM, fontFamily: "'Space Mono', monospace", minWidth: 40 }}>
        {fmt(duration)}
      </span>
    </div>
  );
}

export default ProgressBar;
