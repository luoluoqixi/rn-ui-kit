/// <reference path="../../../../../types/normalize_colors.d.ts" />
import normalizeColor from "@react-native/normalize-colors";

function opaqueChannels(color: string): number[] | undefined {
  const rgba = normalizeColor(color.trim());
  // 不将透明色或无法解析的平台动态颜色强行转换为不透明色。
  if (rgba == null || (rgba & 255) !== 255) return undefined;
  return [(rgba >>> 24) & 255, (rgba >>> 16) & 255, (rgba >>> 8) & 255];
}

/** 混入白色，生成不依赖父背景的不透明交互色。 */
export function mixInteractionColor(
  background: string,
  amount: number,
): string | undefined {
  const channels = opaqueChannels(background);
  if (channels == null) return undefined;
  return `#${channels.map((channel) =>
    Math.round(channel * (1 - amount) + 255 * amount).toString(16).padStart(2, "0"),
  ).join("")}`;
}
