import { Platform } from "react-native";
import { isIos26Plus } from "../../../utils/platform";
const scrollableWithPinnedScroll = {
    scrollable: true,
    scrollableOptions: {
        // iOS 也需要开启该行为：当内容已在顶部且 sheet 还未到最大 detent 时，
        // 继续向上拖动应先扩展 sheet，再进入内容滚动。
        scrollingExpandsSheet: Platform.OS === "android" || Platform.OS === "ios",
    },
};
/** `TrueSheetPanel`：Android / iOS 均需 `scrollable` 撑开内容区（含 `header` 槽 + 工具栏）。 */
export function getTrueSheetPanelScrollableProps() {
    return scrollableWithPinnedScroll;
}
/**
 * iOS `TrueSheetStackHost`：须 `scrollable` 才能撑开内容区（含 Native Stack 标题栏）。
 * 内层滚动仍由 `TrueSheetScrollContent` 处理。
 */
export function getTrueSheetStackHostScrollableProps() {
    return {
        scrollable: true,
        scrollableOptions: {
            ...scrollableWithPinnedScroll.scrollableOptions,
            // TrueSheet 会在钉住/刷新显式注册的 ScrollView 时重新写入 edge effect。
            // 默认值是 hidden，会覆盖 Native Stack 在 iOS 26+ 透明标题栏上配置的
            // automatic top edge effect，导致详情页标题栏失去系统模糊效果。
            // Stack 宿主需要保留系统的 automatic；普通 Panel 仍沿用 hidden 默认值。
            ...(Platform.OS === "ios" && isIos26Plus()
                ? { topScrollEdgeEffect: "automatic" }
                : {}),
        },
    };
}
/** `scrollable={false}` 时 iOS 内容区不会自动 flex:1，需显式补上否则白屏。 */
export function mergeTrueSheetContentStyle(scrollable, style) {
    if (Platform.OS !== "ios" || scrollable === true) {
        return style;
    }
    const flexFill = { flex: 1 };
    return style != null ? [style, flexFill] : flexFill;
}
export function shouldUseTrueSheetNativeScrollInsets(scrollable) {
    return Platform.OS === "android" && scrollable === true;
}
/** iOS True Sheet Panel：Portal 用 `scroll-sibling`，避免多包一层导致 ScrollView 无法钉住。 */
export function getTrueSheetPanelOverlayLayout() {
    return Platform.OS === "ios" ? "scroll-sibling" : "wrap";
}
/** Sheet 内容区根节点样式：Android 与库 `scrollable` 配合用 `flexGrow`。 */
export function getTrueSheetGestureRootStyle() {
    if (Platform.OS === "android") {
        return { flexGrow: 1 };
    }
    return { flex: 1, minHeight: 0 };
}
