import { useState } from "react";
import { DEFAULT_APPEARANCE, DEFAULT_TOOL_APPEARANCE, type ChartAppearance, type CrosshairAxis, type CrosshairStyle } from "../lib/appearance";

interface Props {
  value: ChartAppearance;
  onClose: () => void;
  onSave: (value: ChartAppearance) => void;
}

const crosshairStyles: { value: CrosshairStyle; label: string }[] = [
  { value: 0, label: "Solid" },
  { value: 1, label: "Dotted" },
  { value: 2, label: "Dashed" },
  { value: 3, label: "Large dashed" },
  { value: 4, label: "Sparse dotted" },
];

const normalize = (value: ChartAppearance): ChartAppearance => ({
  ...DEFAULT_APPEARANCE,
  ...value,
  tools: { ...DEFAULT_TOOL_APPEARANCE, ...value.tools },
});

export function AppearanceDialog({ value, onClose, onSave }: Props) {
  const [draft, setDraft] = useState(() => normalize(value));
  const [tab, setTab] = useState<"symbol" | "canvas" | "tools">("canvas");
  const set = <K extends keyof ChartAppearance>(key: K, next: ChartAppearance[K]) =>
    setDraft((current) => ({ ...current, [key]: next }));
  const setTool = <K extends keyof ChartAppearance["tools"]>(key: K, next: ChartAppearance["tools"][K]) =>
    setDraft((current) => ({ ...current, tools: { ...current.tools, [key]: next } }));

  return (
    <div className="appearance-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section className="appearance" role="dialog" aria-modal="true" aria-labelledby="appearance-title">
        <header className="appearance-head">
          <h2 id="appearance-title">Settings</h2>
          <button className="appearance-close" onClick={onClose} aria-label="Close settings">×</button>
        </header>
        <div className="appearance-body">
          <nav className="appearance-tabs" aria-label="Chart settings">
            <button className={tab === "symbol" ? "active" : ""} onClick={() => setTab("symbol")}>◐ <span>Symbol</span></button>
            <button className={tab === "canvas" ? "active" : ""} onClick={() => setTab("canvas")}>⌁ <span>Canvas</span></button>
          </nav>
          {tab === "canvas" ? (
            <div className="appearance-fields">
              <h3>Chart basic styles</h3>
              <label>Background <input type="color" value={draft.background} onChange={(e) => set("background", e.target.value)} /></label>
              <label className="appearance-check"><span>Grid lines</span><input type="checkbox" checked={draft.gridVisible} onChange={(e) => set("gridVisible", e.target.checked)} /></label>
              <label>Grid color <input type="color" value={draft.grid} onChange={(e) => set("grid", e.target.value)} /></label>
              <label>Scale lines <input type="color" value={draft.scaleLines} onChange={(e) => set("scaleLines", e.target.value)} /></label>
              <label>Text <input type="color" value={draft.text} onChange={(e) => set("text", e.target.value)} /></label>
              <label>Crosshair <input type="color" value={draft.crosshair} onChange={(e) => set("crosshair", e.target.value)} /></label>
              <label>Crosshair labels <input type="color" value={draft.crosshairLabel} onChange={(e) => set("crosshairLabel", e.target.value)} /></label>
              <label>Crosshair style
                <select value={draft.crosshairStyle} onChange={(e) => set("crosshairStyle", Number(e.target.value) as CrosshairStyle)}>
                  {crosshairStyles.map((style) => <option key={style.value} value={style.value}>{style.label}</option>)}
                </select>
              </label>
              <label>Crosshair orientation
                <select value={draft.crosshairAxis} onChange={(e) => set("crosshairAxis", e.target.value as CrosshairAxis)}>
                  <option value="both">Vertical + horizontal</option>
                  <option value="vertical">Vertical only</option>
                  <option value="horizontal">Horizontal only</option>
                </select>
              </label>
              <label>Crosshair orientation
                <select value={draft.crosshairAxis} onChange={(e) => set("crosshairAxis", e.target.value as CrosshairAxis)}>
                  <option value="both">Vertical + horizontal</option>
                  <option value="vertical">Vertical only</option>
                  <option value="horizontal">Horizontal only</option>
                </select>
              <label>Crosshair orientation
                <select value={draft.crosshairAxis} onChange={(e) => set("crosshairAxis", e.target.value as CrosshairAxis)}>
                  <option value="both">Vertical + horizontal</option>
                  <option value="vertical">Vertical only</option>
                  <option value="horizontal">Horizontal only</option>
                </select>
              <label>Crosshair orientation
                <select value={draft.crosshairAxis} onChange={(e) => set("crosshairAxis", e.target.value as CrosshairAxis)}>
                  <option value="both">Vertical + horizontal</option>
                  <option value="vertical">Vertical only</option>
                  <option value="horizontal">Horizontal only</option>
                </select>
              <label>Mouse cursor
                <select value={draft.cursor} onChange={(e) => set("cursor", e.target.value as ChartAppearance["cursor"])}>
                  <option value="crosshair">Crosshair</option>
                  <option value="default">Arrow</option>
                </select>
              </label>
            </div>
          ) : tab === "symbol" ? (
            <div className="appearance-fields">
              <h3>Candles</h3>
              <label>Up body <input type="color" value={draft.up} onChange={(e) => set("up", e.target.value)} /></label>
              <label>Down body <input type="color" value={draft.down} onChange={(e) => set("down", e.target.value)} /></label>
              <label>Up border <input type="color" value={draft.borderUp} onChange={(e) => set("borderUp", e.target.value)} /></label>
              <label>Down border <input type="color" value={draft.borderDown} onChange={(e) => set("borderDown", e.target.value)} /></label>
              <label>Up wick <input type="color" value={draft.wickUp} onChange={(e) => set("wickUp", e.target.value)} /></label>
              <label>Down wick <input type="color" value={draft.wickDown} onChange={(e) => set("wickDown", e.target.value)} /></label>
            </div>
          ) : (
            <div className="appearance-fields">
              <h3>Position box defaults</h3>
              <label>Target line <input type="color" value={draft.tools.targetColor} onChange={(e) => setTool("targetColor", e.target.value)} /></label>
              <label>Target section <input type="color" value={draft.tools.targetFill} onChange={(e) => setTool("targetFill", e.target.value)} /></label>
              <label>Stop line <input type="color" value={draft.tools.stopColor} onChange={(e) => setTool("stopColor", e.target.value)} /></label>
              <label>Stop section <input type="color" value={draft.tools.stopFill} onChange={(e) => setTool("stopFill", e.target.value)} /></label>
              <label>Entry line <input type="color" value={draft.tools.entryColor} onChange={(e) => setTool("entryColor", e.target.value)} /></label>
              <label className="appearance-check"><span>Position box labels</span><input type="checkbox" checked={draft.tools.showLabels} onChange={(e) => setTool("showLabels", e.target.checked)} /></label>
            </div>
          )}
        </div>
        <footer className="appearance-actions">
          <button className="appearance-cancel" onClick={onClose}>Cancel</button>
          <button className="appearance-save" onClick={() => { onSave(draft); onClose(); }}>OK</button>
        </footer>
      </section>
    </div>
  );
}
