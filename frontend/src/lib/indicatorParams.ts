// An indicator's parameters in its settings (rows of name and value, typed as text), and in the legend.

/** One parameter in the settings: its name and the value as typed. */
export interface ParamRow {
  key: string;
  value: string;
}

/** The settings' rows for a set of parameters. */
export function rowsFromParams(params: Record<string, unknown> | null | undefined): ParamRow[] {
  return Object.entries(params ?? {}).map(([key, value]) => ({ key, value: String(value) }));
}

/** The parameters the rows say: booleans and numbers are typed before other text values. Rows without a name are left out. */
export function paramsFromRows(rows: ParamRow[]): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  for (const { key, value } of rows) {
    const name = key.trim();
    if (!name) continue;
    const text = value.trim();
    if (text === "true" || text === "false") {
      params[name] = text === "true";
      continue;
    }
    const number = Number(text);
    params[name] = text !== "" && !Number.isNaN(number) ? number : value;
  }
  return params;
}

/** Do two sets of parameters say the same (a value typed as "20" and the number 20 are the same)? */
export function sameParams(a: Record<string, unknown> | null | undefined, b: Record<string, unknown> | null | undefined): boolean {
  const left = Object.entries(a ?? {});
  const right = b ?? {};
  if (left.length !== Object.keys(right).length) return false;
  return left.every(([key, value]) => key in right && String(value) === String(right[key]));
}

/**
 * What the legend shows after an indicator's name, as TradingView does ("SMA 50"): the values of its parameters,
 * the simple ones, at most four of them.
 */
export function paramText(params: Record<string, unknown> | null | undefined): string {
  const shown = Object.values(params ?? {})
    .filter((v) => typeof v === "number" || typeof v === "boolean" || (typeof v === "string" && v.length > 0 && v.length <= 12))
    .slice(0, 4)
    .map((v) => String(v));
  return shown.join(" ");
}
