/** HSL → RGB 辅助函数 */
function hueToRGB(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/** 将 CSS 色值转为 Android ARGB 有符号整数。
 *  支持：hex(#RGB/#RRGGBB/#RRGGBBAA)、rgb/rgba、hsl/hsla。 */
export function toARGB(val: unknown): number | undefined {
  if (typeof val === "number") return val | 0;
  if (typeof val !== "string") return undefined;

  const s = val.trim();

  // ── hex ──────────────────────────────────────────────
  if (s.startsWith("#")) {
    const hex = s.replace("#", "");
    let int: number;
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      int = (0xff << 24) | (r << 16) | (g << 8) | b;
    } else if (hex.length === 6) {
      int = (0xff << 24) | parseInt(hex, 16);
    } else if (hex.length === 8) {
      int = parseInt(hex, 16);
    } else {
      return undefined;
    }
    return int | 0;
  }

  // ── hsl / hsla ───────────────────────────────────────
  const hslMatch = s.match(
    /^hsla?\s*\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*([\d.]+))?\s*\)$/i,
  );
  if (hslMatch) {
    const h = Number.parseFloat(hslMatch[1]) / 360;
    const sPct = Number.parseFloat(hslMatch[2]) / 100;
    const l = Number.parseFloat(hslMatch[3]) / 100;
    const a = hslMatch[4] !== undefined ? Number.parseFloat(hslMatch[4]) : 1;

    let r: number, g: number, b: number;
    if (sPct === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + sPct) : l + sPct - l * sPct;
      const p = 2 * l - q;
      r = hueToRGB(p, q, h + 1 / 3);
      g = hueToRGB(p, q, h);
      b = hueToRGB(p, q, h - 1 / 3);
    }
    const alpha = Math.round(a * 255);
    const int =
      (alpha << 24) |
      (Math.round(r * 255) << 16) |
      (Math.round(g * 255) << 8) |
      Math.round(b * 255);
    return int | 0;
  }

  // ── rgb / rgba ───────────────────────────────────────
  const rgbMatch = s.match(
    /^rgba?\s*\(\s*(\d+(?:\.\d+)?)%?\s*,\s*(\d+(?:\.\d+)?)%?\s*,\s*(\d+(?:\.\d+)?)%?\s*(?:,\s*([\d.]+))?\s*\)$/i,
  );
  if (rgbMatch) {
    const pct = s.includes("%");
    const r = pct
      ? Math.round((Number.parseFloat(rgbMatch[1]) / 100) * 255)
      : Number.parseFloat(rgbMatch[1]);
    const g = pct
      ? Math.round((Number.parseFloat(rgbMatch[2]) / 100) * 255)
      : Number.parseFloat(rgbMatch[2]);
    const b = pct
      ? Math.round((Number.parseFloat(rgbMatch[3]) / 100) * 255)
      : Number.parseFloat(rgbMatch[3]);
    const a =
      rgbMatch[4] !== undefined ? Math.round(Number.parseFloat(rgbMatch[4]) * 255) : 0xff;
    const int =
      (a << 24) | (Math.min(r, 255) << 16) | (Math.min(g, 255) << 8) | Math.min(b, 255);
    return int | 0;
  }

  return undefined;
}
