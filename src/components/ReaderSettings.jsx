import { useState } from "react";
import { Type, Minus, Plus } from "lucide-react";
import { DEFAULT_SETTINGS } from "../lib/storyStorage.js";

const FONT_MIN = 15;
const FONT_MAX = 24;
const LINE_HEIGHTS = [1.6, 1.8, 2.0, 2.2];
const LINE_LABELS = { 1.6: "Compact", 1.8: "Normal", 2.0: "Relaxed", 2.2: "Airy" };

const StepButton = ({ onClick, disabled, children, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="p-2 rounded-lg border border-violet-700/30 text-violet-400 hover:text-violet-200 hover:border-violet-500/50 disabled:opacity-30 disabled:pointer-events-none transition-all"
  >
    {children}
  </button>
);

// Font size / line spacing controls, persisted by the parent on every change.
export default function ReaderSettings({ settings, onChange }) {
  const [open, setOpen] = useState(false);

  const set = (patch) => onChange({ ...settings, ...patch });
  const lineIndex = LINE_HEIGHTS.indexOf(settings.lineHeight);
  const stepLine = (dir) => {
    const next = LINE_HEIGHTS[Math.min(LINE_HEIGHTS.length - 1, Math.max(0, (lineIndex === -1 ? 2 : lineIndex) + dir))];
    set({ lineHeight: next });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Reader settings"
        className={`p-2 rounded-lg border transition-colors ${open ? "text-violet-300 border-violet-500/50 bg-violet-900/30" : "text-violet-500 border-violet-800/30 bg-stone-800/50 hover:text-violet-300"}`}
      >
        <Type className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-40 w-64 bg-stone-900/95 backdrop-blur border border-violet-700/40 rounded-xl shadow-2xl p-4 space-y-4">
          <div>
            <p className="text-violet-500/70 text-xs tracking-widest uppercase mb-2">Font Size</p>
            <div className="flex items-center justify-between gap-2">
              <StepButton label="Smaller text" disabled={settings.fontSize <= FONT_MIN} onClick={() => set({ fontSize: settings.fontSize - 1 })}>
                <Minus className="w-4 h-4" />
              </StepButton>
              <span className="text-stone-300 font-medium">{settings.fontSize} px</span>
              <StepButton label="Larger text" disabled={settings.fontSize >= FONT_MAX} onClick={() => set({ fontSize: settings.fontSize + 1 })}>
                <Plus className="w-4 h-4" />
              </StepButton>
            </div>
          </div>

          <div>
            <p className="text-violet-500/70 text-xs tracking-widest uppercase mb-2">Line Spacing</p>
            <div className="flex items-center justify-between gap-2">
              <StepButton label="Tighter lines" disabled={lineIndex <= 0} onClick={() => stepLine(-1)}>
                <Minus className="w-4 h-4" />
              </StepButton>
              <span className="text-stone-300 font-medium">{LINE_LABELS[settings.lineHeight] ?? settings.lineHeight}</span>
              <StepButton label="Looser lines" disabled={lineIndex === LINE_HEIGHTS.length - 1} onClick={() => stepLine(1)}>
                <Plus className="w-4 h-4" />
              </StepButton>
            </div>
          </div>

          <button
            onClick={() => onChange({ ...DEFAULT_SETTINGS })}
            className="w-full text-center text-xs text-violet-500 hover:text-violet-300 transition-colors pt-1"
          >
            Reset to defaults
          </button>
        </div>
      )}
    </div>
  );
}
