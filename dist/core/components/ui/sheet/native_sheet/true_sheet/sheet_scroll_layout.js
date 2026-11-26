import { isIos26Plus, isLegacyCompactIphone } from "../../../utils/platform";
/** True Sheet 滚动内容尾部留白（不含安全区）。 */
export const TRUE_SHEET_SCROLL_EXTRA_BOTTOM_PADDING = 24;
const SCROLLBAR_LEGACY_COMPACT_IPHONE_BOTTOM = 40;
const SCROLLBAR_IOS26_PLUS_VISUAL_OFFSET = 12;
/**
 * 计算 ScrollView `contentContainerStyle.paddingBottom`。
 * `insetAdjustment="automatic"` 且未由库注入 inset 时，仍需把内容滚出底部安全区垫高区域。
 */
export function getTrueSheetScrollBottomPadding({ extraBottom = TRUE_SHEET_SCROLL_EXTRA_BOTTOM_PADDING, insetAdjustment = "automatic", nativeScrollInsetsApplied = false, safeAreaBottom = 0, } = {}) {
    if (nativeScrollInsetsApplied) {
        return extraBottom;
    }
    if (insetAdjustment === "never") {
        return Math.max(safeAreaBottom, 0) + extraBottom;
    }
    return Math.max(safeAreaBottom, 0) + extraBottom;
}
/**
 * 计算 iOS True Sheet 滚动条底部避让。
 * 让 indicator 视觉终点与安全区及额外底部偏移保持一致。
 */
export function getTrueSheetScrollIndicatorBottomInset({ automaticContentInsetAdjustment = false, nativeScrollInsetsApplied = false, safeAreaBottom = 0, } = {}) {
    const ios26PlusVisualOffset = isIos26Plus() ? SCROLLBAR_IOS26_PLUS_VISUAL_OFFSET : 0;
    const indicatorVisualAvoidanceInset = automaticContentInsetAdjustment && !nativeScrollInsetsApplied
        ? safeAreaBottom > 0
            ? safeAreaBottom + ios26PlusVisualOffset
            : isLegacyCompactIphone()
                ? SCROLLBAR_LEGACY_COMPACT_IPHONE_BOTTOM
                : 8
        : 0;
    return nativeScrollInsetsApplied ? 0 : safeAreaBottom + indicatorVisualAvoidanceInset;
}
