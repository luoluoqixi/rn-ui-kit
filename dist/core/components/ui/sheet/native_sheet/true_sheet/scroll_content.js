import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { ScrollView, StyleSheet, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { os } from "../../../utils/platform";
import { AndroidClippedScrollView } from "./android_clipped_scroll_view";
import { getTrueSheetScrollBottomPadding, getTrueSheetScrollIndicatorBottomInset, } from "./sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "./true_sheet_scroll_context";
/**
 * True Sheet 内滚动容器：约束 flex、避免 `flexGrow: 1` 占满导致 iOS 滚不到底。
 * 须置于 `TrueSheetScrollLayoutProvider` 子树内（由 `TrueSheetPanel` / `TrueSheetStackHost` 提供）。
 */
export const TrueSheetScrollContent = forwardRef(({ children, contentContainerStyle, extraBottomPadding, style, ...rest }, ref) => {
    const insets = useSafeAreaInsets();
    const { automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied } = useTrueSheetScrollLayout();
    // Android：保持库钉住 ScrollView 时的原有 flexGrow 布局，不在此组件改滚动行为。
    if (os() === "android") {
        return (_jsx(AndroidClippedScrollView, { ref: ref, keyboardShouldPersistTaps: "handled", nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: [styles.androidScroll, style], contentContainerStyle: [styles.androidContent, contentContainerStyle], ...rest, children: children }));
    }
    const bottomPadding = getTrueSheetScrollBottomPadding({
        extraBottom: extraBottomPadding,
        insetAdjustment,
        nativeScrollInsetsApplied,
        safeAreaBottom: insets.bottom,
    });
    const indicatorBottomInset = getTrueSheetScrollIndicatorBottomInset({
        automaticContentInsetAdjustment,
        nativeScrollInsetsApplied,
        safeAreaBottom: insets.bottom,
    });
    return (_jsx(ScrollView, { ref: ref, keyboardShouldPersistTaps: "handled", nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: [styles.iosScroll, style], contentContainerStyle: [
            styles.iosContent,
            { paddingBottom: bottomPadding },
            contentContainerStyle,
        ], scrollIndicatorInsets: {
            bottom: indicatorBottomInset,
        }, contentInsetAdjustmentBehavior: automaticContentInsetAdjustment ? "automatic" : "never", ...rest, children: children }));
});
TrueSheetScrollContent.displayName = "TrueSheetScrollContent";
const styles = StyleSheet.create({
    androidContent: {
        flexGrow: 1,
    },
    androidScroll: {
        flexGrow: 1,
    },
    iosContent: {
        flexGrow: 0,
    },
    iosScroll: {
        flex: 1,
        minHeight: 0,
    },
});
