import type { InsetAdjustment } from "@lodev09/react-native-true-sheet";
/** True Sheet 滚动内容尾部留白（不含安全区）。 */
export declare const TRUE_SHEET_SCROLL_EXTRA_BOTTOM_PADDING = 24;
export type TrueSheetScrollBottomPaddingOptions = {
    extraBottom?: number;
    insetAdjustment?: InsetAdjustment;
    /** `scrollable` 且已被库钉住并注入 contentInset 时为 true */
    nativeScrollInsetsApplied?: boolean;
    safeAreaBottom?: number;
};
/**
 * 计算 ScrollView `contentContainerStyle.paddingBottom`。
 * `insetAdjustment="automatic"` 且未由库注入 inset 时，仍需把内容滚出底部安全区垫高区域。
 */
export declare function getTrueSheetScrollBottomPadding({ extraBottom, insetAdjustment, nativeScrollInsetsApplied, safeAreaBottom, }?: TrueSheetScrollBottomPaddingOptions): number;
export type TrueSheetScrollIndicatorBottomInsetOptions = {
    automaticContentInsetAdjustment?: boolean;
    nativeScrollInsetsApplied?: boolean;
    safeAreaBottom?: number;
};
/**
 * 计算 iOS True Sheet 滚动条底部避让。
 * 让 indicator 视觉终点与安全区及额外底部偏移保持一致。
 */
export declare function getTrueSheetScrollIndicatorBottomInset({ automaticContentInsetAdjustment, nativeScrollInsetsApplied, safeAreaBottom, }?: TrueSheetScrollIndicatorBottomInsetOptions): number;
