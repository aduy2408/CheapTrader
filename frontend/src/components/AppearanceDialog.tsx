import { useState } from "react";
import type { ChartAppearance, CrosshairStyle } from "../lib/appearance";

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

export function AppearanceDialog({ value, onClose, onSave }: Props) {
  const [draft, setDraft] = useState(value);
  const [tab, setTab] = useState<"symbol" | "canvas">("canvas");
  const set = <K extends keyof ChartAppearance>(key: K, next: ChartAppearance[K]) =>
    setDraft((current) => ({ ...current, [key]: next }));

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
              <label>Grid lines <input type="color" value={draft.grid} onChange={(e) => set("grid", e.target.value)} /></label>
              <label>Scale lines <input type="color" value={draft.scaleLines} onChange={(e) => set("scaleLines", e.target.value)} /></label>
              <label>Text <input type="color" value={draft.text} onChange={(e) => set("text", e.target.value)} /></label>
              <label>Crosshair <input type="color" value={draft.crosshair} onChange={(e) => set("crosshair", e.target.value)} /></label>
              <label>Crosshair labels <input type="color" value={draft.crosshairLabel} onChange={(e) => set("crosshairLabel", e.target.value)} /></label>
              <label>Crosshair style
                <select value={draft.crosshairStyle} onChange={(e) => set("crosshairStyle", Number(e.target.value) as CrosshairStyle)}>
                  {crosshairStyles.map((style) => <option key={style.value} value={style.value}>{style.label}</option>)}
                </select>
              </label>
              <label>Mouse cursor
                <select value={draft.cursor} onChange={(e) => set("cursor", e.target.value as ChartAppearance["cursor"])}>
                  <option value="crosshair">Crosshair</option>
                  <option value="default">Arrow</option>
                </select>
              </label>
            </div>
          ) : (
            <div className="appearance-fields">
              <h3>Candles</h3>
              <label>Up body <input type="color" value={draft.up} onChange={(e) => set("up", e.target.value)} /></label>
              <label>Down body <input type="color" value={draft.down} onChange={(e) => set("down", e.target.value)} /></label>
              <label>Up wick <input type="color" value={draft.wickUp} onChange={(e) => set("wickUp", e.target.value)} /></label>
              <label>Down wick <input type="color" value={draft.wickDown} onChange={(e) => set("wickDown", e.target.value)} /></label>
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
