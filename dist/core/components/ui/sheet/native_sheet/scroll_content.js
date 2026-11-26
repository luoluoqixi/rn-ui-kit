import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationBarScrollEdge } from "../../utils/navigation";
import { os } from "../../utils/platform";
import { AndroidClippedScrollView } from "./true_sheet/android_clipped_scroll_view";
import { getTrueSheetScrollBottomPadding } from "./true_sheet/sheet_scroll_layout";
import { useTrueSheetStackContentSize } from "./true_sheet/auto_stack_layout_context";
import { useTrueSheetScrollLayout } from "./true_sheet/true_sheet_scroll_context";
import { useTrueSheetScrollableRegistration } from "./true_sheet/scrollable_binding_context";
export const NativeSheetScrollContent = forwardRef(({ bindToNativeSheet = true, constrainToNativeSheetViewport: _constrainToNativeSheetViewport, children, contentContainerStyle, extraBottomPadding, navigationBarScrollEdgeOptions, onContentSizeChange, onScroll, scrollEventThrottle, style, tracksNavigationBarScrollEdge, ...rest }, ref) => {
    const insets = useSafeAreaInsets();
    const { active, autoDetent, automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied } = useTrueSheetScrollLayout();
    const setRef = useTrueSheetScrollableRegistration(ref, active && bindToNativeSheet && (os() === "web" || nativeScrollInsetsApplied));
    const contentSizeChanged = useTrueSheetStackContentSize(onContentSizeChange);
    const trackedOnScroll = useNavigationBarScrollEdge({
        navigationBarScrollEdgeOptions, onScroll,
        tracksNavigationBarScrollEdge: os() === "web" && tracksNavigationBarScrollEdge === true,
    });
    const paddingBottom = getTrueSheetScrollBottomPadding({
        extraBottom: extraBottomPadding, insetAdjustment,
        nativeScrollInsetsApplied, safeAreaBottom: insets.bottom,
    });
    const scrollStyle = [
        autoDetent ? { flexGrow: 0, flexBasis: "auto", flexShrink: 1 } : { flex: 1 }, { minHeight: 0 }, style,
    ];
    const contentStyle = [{ flexGrow: 0, paddingBottom }, contentContainerStyle];
    if (os() === "android") {
        return _jsx(AndroidClippedScrollView, { ref: setRef, keyboardShouldPersistTaps: "handled", nestedScrollEnabled: true, navigationBarScrollEdgeOptions: navigationBarScrollEdgeOptions, onContentSizeChange: contentSizeChanged, onScroll: onScroll, scrollEventThrottle: scrollEventThrottle, showsVerticalScrollIndicator: true, style: scrollStyle, contentContainerStyle: contentStyle, tracksNavigationBarScrollEdge: tracksNavigationBarScrollEdge, ...rest, children: children });
    }
    return _jsx(ScrollView, { ref: setRef, keyboardShouldPersistTaps: "handled", nestedScrollEnabled: true, onContentSizeChange: contentSizeChanged, onScroll: trackedOnScroll, showsVerticalScrollIndicator: true, style: scrollStyle, contentContainerStyle: contentStyle, scrollEventThrottle: scrollEventThrottle ?? (trackedOnScroll ? 16 : undefined), contentInsetAdjustmentBehavior: automaticContentInsetAdjustment ? "automatic" : "never", ...rest, children: children });
});
NativeSheetScrollContent.displayName = "NativeSheetScrollContent";
