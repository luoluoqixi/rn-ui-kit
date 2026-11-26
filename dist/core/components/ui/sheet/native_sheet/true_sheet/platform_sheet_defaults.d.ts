import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import { type ViewStyle } from "react-native";
/** Preserve the toolkit scrolling defaults; v4 layout is handled separately. */
export declare function getTrueSheetPanelScrollableProps(): Pick<TrueSheetProps, "scrollable" | "scrollableOptions">;
/**
 * Stack pages use explicit refs; the legacy fallback remains enabled for raw ScrollViews.
 * 内层滚动仍由 `TrueSheetScrollContent` 处理。
 */
export declare function getTrueSheetStackHostScrollableProps(): Pick<TrueSheetProps, "scrollable" | "scrollableOptions">;
export { isTrueSheetAutoDetent, mergeTrueSheetContentStyle } from "./detent_layout";
export declare function shouldUseTrueSheetNativeScrollInsets(scrollable: boolean | undefined): boolean;
export declare function getTrueSheetPanelOverlayLayout(): "wrap" | "scroll-sibling";
export declare function getTrueSheetGestureRootStyle(autoDetent?: boolean): ViewStyle;
