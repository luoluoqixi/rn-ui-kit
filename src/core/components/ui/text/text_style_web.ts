import type { CSSProperties } from "react";
import { StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

// Expo 扩展的 ViewStyle.userSelect 比 TextStyle 更宽，容器与文字均可经过 DOM 样式转换。
type WebStyleInput = {
  [Key in keyof TextStyle | keyof ViewStyle]?:
    | (Key extends keyof TextStyle ? TextStyle[Key] : never)
    | (Key extends keyof ViewStyle ? ViewStyle[Key] : never);
};

/** Normalize the shared RN text-style shortcuts at the DOM boundary. */
export function textWebStyle(style?: StyleProp<WebStyleInput>): CSSProperties {
  const { lineHeight, paddingHorizontal, paddingVertical, marginHorizontal, marginVertical,
    fontVariant, transform, transformOrigin, textShadowOffset, textShadowRadius, textShadowColor,
    includeFontPadding: _, textAlignVertical: _vertical, writingDirection, textAlign,
    ...rest } = StyleSheet.flatten(style) ?? {};
  const px = (value: string | number) => typeof value === "number" ? value + "px" : value;
  const css = { ...rest,
    ...(lineHeight == null ? {} : { lineHeight: lineHeight + "px" }),
    ...(paddingHorizontal == null ? {} : { paddingInline: paddingHorizontal }),
    ...(paddingVertical == null ? {} : { paddingBlock: paddingVertical }),
    ...(marginHorizontal == null ? {} : { marginInline: marginHorizontal }),
    ...(marginVertical == null ? {} : { marginBlock: marginVertical }),
    ...(fontVariant ? { fontVariant: fontVariant.join(" ") } : {}),
    ...(textAlign ? { textAlign: textAlign === "auto" ? "start" : textAlign } : {}),
    ...(writingDirection && writingDirection !== "auto" ? { direction: writingDirection } : {}),
  } as CSSProperties;
  if (transform) css.transform = typeof transform === "string" ? transform : transform.flatMap(entry => Object.entries(entry).map(([name, value]) => {
    const formatted = Array.isArray(value) ? value.join(",") : name.startsWith("translate") || name === "perspective" ? px(value) : String(value);
    const cssName = name === "matrix" && Array.isArray(value) && value.length === 16 ? "matrix3d" : name;
    return cssName + "(" + formatted + ")";
  })).join(" ");
  if (transformOrigin) css.transformOrigin = typeof transformOrigin === "string" ? transformOrigin : transformOrigin.map(px).join(" ");
  if (textShadowOffset || textShadowRadius || textShadowColor) css.textShadow = [
    px(textShadowOffset?.width ?? 0), px(textShadowOffset?.height ?? 0), px(textShadowRadius ?? 0), textShadowColor ?? "currentColor",
  ].join(" ");
  return css;
}
