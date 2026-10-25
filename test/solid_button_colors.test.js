import { describe, expect, test } from "bun:test";
import { getSolidButtonInteractionColor } from "../src/core/components/ui/button/solid_button_colors";
import { generateUiThemeFromPrimaryColor } from "../src/core/components/ui/utils/theme/generate_ui_theme";
import { accentThemeSeeds } from "../src/core/components/ui/utils/theme/accent_theme";

const colors = {
  primary: "#2563eb", primaryForeground: "#ffffff",
  destructive: "#ba1a1a", destructiveForeground: "#ffffff",
};
const hover = { hovered: true, pressed: false, disabled: false };
const press = { hovered: true, pressed: true, disabled: false };

// 捕获 hover/按下相同、按下被 hover 覆盖，以及错误使用 accent 的回归。
test("实色按钮按自身色调区分 hover 和按下，省略 variant 仍使用 primary", () => {
  expect(getSolidButtonInteractionColor(colors, undefined, hover)).toBe("#326cec");
  expect(getSolidButtonInteractionColor(colors, "default", press)).toBe("#3f76ed");
  expect(getSolidButtonInteractionColor(colors, "destructive", hover)).toBe("#be2828");
  expect(getSolidButtonInteractionColor(colors, "destructive", press)).toBe("#c23535");
});

test("黑字按钮逐步提亮，hover 退出后按下仍优先", () => {
  const bright = { ...colors, primary: "#00d5e8", primaryForeground: "#000000" };
  expect(getSolidButtonInteractionColor(bright, null, hover)).toBe("#0fd8e9");
  expect(getSolidButtonInteractionColor(bright, "default", { ...press, hovered: false })).toBe("#1fdaeb");
});

test("禁用/loading、空闲状态和其他 variants 不增加交互覆盖", () => {
  for (const variant of [undefined, "default", "destructive"]) {
    expect(getSolidButtonInteractionColor(colors, variant, { ...press, disabled: true })).toBeUndefined();
    expect(getSolidButtonInteractionColor(colors, variant, { ...hover, hovered: false })).toBeUndefined();
  }
  for (const variant of ["outline", "secondary", "ghost", "icon", "link"]) {
    expect(getSolidButtonInteractionColor(colors, variant, press)).toBeUndefined();
  }
});

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((offset) => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
describe("主题配色", () => {
  test("所有预设和亮色自定义主色在两种模式均逐步变浅，结果不带透明度", () => {
    for (const seed of [...Object.values(accentThemeSeeds), "#00d5e8", "#facc15"]) {
      const theme = generateUiThemeFromPrimaryColor(seed);
      for (const mode of ["light", "dark"]) {
        for (const [variant, background] of [
          ["default", "primary"],
          ["destructive", "destructive"],
        ]) {
          let previous = luminance(theme[mode][background]);
          for (const state of [hover, press]) {
            const result = getSolidButtonInteractionColor(theme[mode], variant, state);
            expect(result).toMatch(/^#[0-9a-f]{6}$/);
            const current = luminance(result);
            expect(current).toBeGreaterThan(previous);
            previous = current;
          }
        }
      }
    }
  });
});

test("自定义 RGB/HSL 和短 hex 颜色可计算，透明或无法解析的色值保留调用方背景", () => {
  expect(getSolidButtonInteractionColor({ ...colors, primary: "rgb(37, 99, 235)", primaryForeground: "hsl(0, 0%, 100%)" }, "default", hover)).toBe("#326cec");
  expect(getSolidButtonInteractionColor({ ...colors, primary: "#fff", primaryForeground: "#000" }, "default", press)).toBe("#ffffff");
  for (const primary of ["rgba(37, 99, 235, 0.5)", "#2563eb80", "var(--custom-primary)"]) {
    expect(getSolidButtonInteractionColor({ ...colors, primary }, "default", press)).toBeUndefined();
  }
});

test("提亮方向不随文字颜色改变", () => {
  for (const primaryForeground of ["#ffffff", "#000000", "#757575"]) {
    const custom = { ...colors, primary: "#101010", primaryForeground };
    expect(getSolidButtonInteractionColor(custom, "default", hover)).toBe("#1e1e1e");
    expect(getSolidButtonInteractionColor(custom, "default", press)).toBe("#2d2d2d");
  }
});

test("合法的自定义命名色、空格 RGB 和不透明八位 hex 仍提供交互色", () => {
  for (const primary of ["red", "rgb(255 0 0)", "#ff0000ff"]) {
    expect(getSolidButtonInteractionColor({ ...colors, primary }, "default", hover)).toBe("#ff0f0f");
    expect(getSolidButtonInteractionColor({ ...colors, primary }, "default", press)).toBe("#ff1f1f");
  }
});
