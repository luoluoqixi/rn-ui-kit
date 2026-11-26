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
/** Preserve the toolkit scrolling defaults; v4 layout is handled separately. */
export function getTrueSheetPanelScrollableProps() {
    return scrollableWithPinnedScroll;
}
/**
 * Stack pages use explicit refs; the legacy fallback remains enabled for raw ScrollViews.
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
export { isTrueSheetAutoDetent, mergeTrueSheetContentStyle } from "./detent_layout";
export function shouldUseTrueSheetNativeScrollInsets(scrollable) {
    return Platform.OS !== "web" && scrollable === true;
}
export function getTrueSheetPanelOverlayLayout() {
    return Platform.OS === "ios" ? "scroll-sibling" : "wrap";
}
export function getTrueSheetGestureRootStyle(autoDetent = false) {
    return autoDetent ? { flexGrow: 0, flexBasis: "auto", flexShrink: 1, minHeight: 0 } : { flex: 1, minHeight: 0 };
}
