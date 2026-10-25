import { expect, test } from "bun:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { transformFileSync } from "@babel/core";
import { createRequire } from "node:module";
import { useSolidButtonInteraction } from "../src/core/components/ui/button/use_solid_button_interaction";

// 使用安装的 React Native 原始 flattenStyle，避免 RNW 忽略 undefined 而漏掉 Native 回归。
const require = createRequire(import.meta.url);
const compiled = transformFileSync(require.resolve("react-native/Libraries/StyleSheet/flattenStyle"), {
  babelrc: false,
  configFile: false,
  presets: [require.resolve("@react-native/babel-preset")],
});
const nativeModule = { exports: {} };
new Function("module", "exports", "require", compiled.code)(nativeModule, nativeModule.exports, require);
const flattenStyle = nativeModule.exports.default;
const colors = { primary: "#2563eb", destructive: "#ba1a1a" };

function resolveInteractionStyle(variant, pressed, disabled = false, theme = colors) {
  let style;
  function Probe() {
    const interaction = useSolidButtonInteraction({ colors: theme, variant, disabled });
    style = interaction.backgroundStyle(pressed);
    return null;
  }
  renderToStaticMarkup(<Probe />);
  return style;
}

test("Native 空闲和禁用按钮保留 className 生成的背景", () => {
  for (const [variant, backgroundColor] of [[undefined, colors.primary], ["default", colors.primary], ["destructive", colors.destructive], ["secondary", "#eeeeee"]]) {
    for (const [pressed, disabled] of [[false, false], [false, true], [true, true]]) {
      const interaction = resolveInteractionStyle(variant, pressed, disabled);
      expect(flattenStyle([{ backgroundColor }, interaction]).backgroundColor).toBe(backgroundColor);
    }
  }
});

test("Native 按下只覆盖实色按钮，其他 variant 和动态颜色保留底色", () => {
  expect(flattenStyle([{ backgroundColor: colors.primary }, resolveInteractionStyle("default", true)]).backgroundColor).toBe("#3f76ed");
  expect(flattenStyle([{ backgroundColor: colors.destructive }, resolveInteractionStyle("destructive", true)]).backgroundColor).toBe("#c23535");
  for (const variant of ["outline", "secondary", "ghost", "icon", "link"]) {
    expect(flattenStyle([{ backgroundColor: "#eeeeee" }, resolveInteractionStyle(variant, true)]).backgroundColor).toBe("#eeeeee");
  }
  const dynamic = { primary: "var(--primary)", destructive: "#ba1a1a" };
  expect(flattenStyle([{ backgroundColor: "#2563eb" }, resolveInteractionStyle("default", true, false, dynamic)]).backgroundColor).toBe("#2563eb");
});
