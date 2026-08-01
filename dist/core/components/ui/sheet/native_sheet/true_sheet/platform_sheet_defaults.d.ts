import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import { type StyleProp, type ViewStyle } from "react-native";
/** `TrueSheetPanel`：Android / iOS 均需 `scrollable` 撑开内容区（含 `header` 槽 + 工具栏）。 */
export declare function getTrueSheetPanelScrollableProps(): Pick<TrueSheetProps, "scrollable" | "scrollableOptions">;
/**
 * iOS `TrueSheetStackHost`：须 `scrollable` 才能撑开内容区（含 Native Stack 标题栏）。
 * 内层滚动仍由 `TrueSheetScrollContent` 处理。
 */
export declare function getTrueSheetStackHostScrollableProps(): Pick<TrueSheetProps, "scrollable" | "scrollableOptions">;
/** `scrollable={false}` 时 iOS 内容区不会自动 flex:1，需显式补上否则白屏。 */
export declare function mergeTrueSheetContentStyle(scrollable: boolean | undefined, style?: StyleProp<ViewStyle>): StyleProp<ViewStyle>;
export declare function shouldUseTrueSheetNativeScrollInsets(scrollable: boolean | undefined): boolean;
/** iOS True Sheet Panel：Portal 用 `scroll-sibling`，避免多包一层导致 ScrollView 无法钉住。 */
export declare function getTrueSheetPanelOverlayLayout(): "wrap" | "scroll-sibling";
/** Sheet 内容区根节点样式：Android 与库 `scrollable` 配合用 `flexGrow`。 */
export declare function getTrueSheetGestureRootStyle(): {
    flexGrow: 1;
    flex?: undefined;
    minHeight?: undefined;
} | {
    flex: 1;
    minHeight: 0;
    flexGrow?: undefined;
};
