import { describe, expect, test } from "bun:test";

import {
  accentThemeNames,
  accentThemeSeeds,
  resolveGeneratedAccentTheme,
} from "../src/core/components/ui/utils/theme/accent_theme";
import { generateUiThemeFromPrimaryColor } from "../src/core/components/ui/utils/theme/generate_ui_theme";

const semanticColorKeys = [
  ...Array.from({ length: 12 }, (_, index) => "accent" + String(index + 1).padStart(2, "0")),
  "background", "foreground", "surface", "surfaceForeground",
  "surfaceSecondary", "surfaceSecondaryForeground", "surfaceTertiary", "surfaceTertiaryForeground",
  "overlay", "overlayForeground", "backdrop", "muted", "accent", "accentForeground",
  "default", "defaultForeground", "success", "successForeground", "warning", "warningForeground",
  "danger", "dangerForeground", "fieldBackground", "fieldForeground", "fieldPlaceholder", "fieldBorder",
  "segment", "segmentForeground", "border", "separator", "focus", "link",
];

function relativeLuminance(color) {
  const channels = [0, 2, 4].map((offset) => Number.parseInt(color.slice(offset + 1, offset + 3), 16) / 255);
  const [r, g, b] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

describe("generateUiThemeFromPrimaryColor", () => {
  test("generates every semantic color for both schemes", () => {
    const theme = generateUiThemeFromPrimaryColor("#2563eb");

    expect(Object.keys(theme)).toEqual(["light", "dark"]);
    for (const scheme of [theme.light, theme.dark]) {
      expect(Object.keys(scheme).sort()).toEqual([...semanticColorKeys].sort());
      for (const value of Object.values(scheme)) {
        expect(value).toMatch(/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i);
      }
    }
  });

  test("accepts short hex and surrounding whitespace", () => {
    expect(generateUiThemeFromPrimaryColor("  #abc  ")).toEqual(
      generateUiThemeFromPrimaryColor("#aabbcc"),
    );
  });

  test("rejects unsupported or malformed colors", () => {
    for (const value of ["", "red", "rgb(0, 0, 0)", "#12", "#abcd", "#12345678", null]) {
      expect(() => generateUiThemeFromPrimaryColor(value)).toThrow(TypeError);
    }
  });

  test("keeps text readable on HeroUI surfaces for preset and difficult custom seeds", () => {
    for (const seed of [...Object.values(accentThemeSeeds), "#facc15", "#00d5e8", "#888888", "#fff", "#000"]) {
      const theme = generateUiThemeFromPrimaryColor(seed);
      for (const colors of [theme.light, theme.dark]) {
        for (const [foreground, background] of [
          ["foreground", "background"], ["surfaceForeground", "surface"],
          ["surfaceSecondaryForeground", "surfaceSecondary"], ["surfaceTertiaryForeground", "surfaceTertiary"],
          ["overlayForeground", "overlay"], ["accentForeground", "accent"],
          ["defaultForeground", "default"], ["dangerForeground", "danger"],
          ["successForeground", "success"], ["warningForeground", "warning"],
          ["fieldForeground", "fieldBackground"], ["fieldPlaceholder", "fieldBackground"],
          ["muted", "overlay"], ["muted", "surface"], ["muted", "surfaceSecondary"],
        ]) {
          expect(contrastRatio(colors[foreground], colors[background])).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  test("accent changes leave neutral backgrounds independent", () => {
    const blue = generateUiThemeFromPrimaryColor("#2563eb");
    const pink = generateUiThemeFromPrimaryColor("#db2777");
    for (const mode of ["light", "dark"]) {
      for (const key of ["background", "surface", "surfaceSecondary", "surfaceTertiary", "overlay", "fieldBackground"]) {
        expect(blue[mode][key]).toBe(pink[mode][key]);
      }
      expect(blue[mode].accent).not.toBe(pink[mode].accent);
    }
  });

  test("keeps bright light-theme primaries close to the selected color", () => {
    const theme = generateUiThemeFromPrimaryColor("#00d5e8");

    expect(theme.light.accent).toBe("#00d5e8");
    expect(theme.light.accentForeground).toBe("#000000");
    expect(contrastRatio(theme.light.accentForeground, theme.light.accent)).toBeGreaterThanOrEqual(
      4.5,
    );
  });
});

describe("default accent themes", () => {
  test("are generated from their seed colors", () => {
    for (const name of accentThemeNames) {
      const generated = generateUiThemeFromPrimaryColor(accentThemeSeeds[name]);
      expect(resolveGeneratedAccentTheme(name)).toEqual(generated);
    }
  });

  test("reuses statically generated theme objects", () => {
    expect(resolveGeneratedAccentTheme("ocean")).toBe(resolveGeneratedAccentTheme("ocean"));
  });

  test("generates and caches custom hex accent themes", () => {
    const generated = resolveGeneratedAccentTheme("#12abef");
    expect(generated).toEqual(generateUiThemeFromPrimaryColor("#12abef"));
    expect(resolveGeneratedAccentTheme(" #12ABEF ")).toBe(generated);
  });

  test("falls back for unknown and inherited property names", () => {
    expect(resolveGeneratedAccentTheme("unknown")).toBe(resolveGeneratedAccentTheme("ocean"));
    expect(resolveGeneratedAccentTheme("toString")).toBe(resolveGeneratedAccentTheme("ocean"));
  });
});

// 色阶缺失、明暗顺序反转或 hover 比选中更强时应失败。
describe("主色强调层级", () => {
  test("所有预设和自定义颜色的层级按强调程度递增，hover 弱于选中", () => {
    for (const seed of [...Object.values(accentThemeSeeds), "#00d5e8", "#ffffff", "#000000"]) {
      const theme = generateUiThemeFromPrimaryColor(seed);
      for (const mode of ["light", "dark"]) {
        const colors = theme[mode];
        const luminances = Array.from({ length: 12 }, (_, i) => {
          const value = colors[`accent${String(i + 1).padStart(2, "0")}`];
          expect(value).toMatch(/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i);
          return relativeLuminance(value);
        });
        for (let i = 1; i < luminances.length; i++) {
          if (mode === "light") expect(luminances[i]).toBeLessThan(luminances[i - 1]);
          else expect(luminances[i]).toBeGreaterThan(luminances[i - 1]);
        }
        if (mode === "light") expect(luminances[2]).toBeGreaterThan(relativeLuminance(colors.accent04));
        else expect(luminances[2]).toBeLessThan(relativeLuminance(colors.accent04));
        expect(contrastRatio(colors.foreground, colors.accent03)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
