export type CrosshairStyle = 0 | 1 | 2 | 3 | 4;

export interface ChartAppearance {
  background: string;
  gridVisible: boolean;
  grid: string;
  text: string;
  scaleLines: string;
  crosshair: string;
  crosshairLabel: string;
  up: string;
  down: string;
  borderUp: string;
  borderDown: string;
  wickUp: string;
  wickDown: string;
  cursor: "crosshair" | "default";
  crosshairStyle: CrosshairStyle;
}

export const DEFAULT_APPEARANCE: ChartAppearance = {
  gridVisible: true,
  background: "#131722",
  grid: "#20242f",
  text: "#b2b5be",
  scaleLines: "#2e2e2e",
  crosshair: "#9598a1",
  crosshairLabel: "#4c525e",
  up: "#089981",
  down: "#f23645",
  borderUp: "#089981",
  borderDown: "#f23645",
  wickUp: "#089981",
  wickDown: "#f23645",
  cursor: "crosshair",
  crosshairStyle: 2,
};
