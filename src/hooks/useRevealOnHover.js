import { useState, useEffect, useRef } from "react";

// Fade-out → swap → fade-in reveal used by the character page titles.
// Spread `bind` onto the element; it covers hover and keyboard focus.
export default function useRevealOnHover(fadeMs = 200) {
  const [revealed, setRevealed] = useState(false);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const swap = (to) => {
    setVisible(false);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { setRevealed(to); setVisible(true); }, fadeMs);
  };

  return {
    revealed,
    visible,
    bind: {
      onMouseEnter: () => swap(true),
      onMouseLeave: () => swap(false),
      onFocus: () => swap(true),
      onBlur: () => swap(false),
      tabIndex: 0,
    },
  };
}
