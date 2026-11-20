import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import type { StyleProp, ViewStyle } from "react-native";

/** v4: fixed detents fill; auto detents keep their natural content height. */
export function isTrueSheetAutoDetent(detents: TrueSheetProps["detents"], index = 0): boolean {
  const detent = detents?.[Math.max(0, index)];
  return detent === "auto" || detent === -1;
}

export function mergeTrueSheetContentStyle(
  _scrollable: boolean | undefined,
  style?: StyleProp<ViewStyle>,
  autoDetent = false,
): StyleProp<ViewStyle> {
  return [autoDetent ? { flexGrow: 0, flexBasis: "auto", flexShrink: 1 } : { flex: 1, minHeight: 0 }, style];
}

