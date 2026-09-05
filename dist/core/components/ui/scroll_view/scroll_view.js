import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ScrollView as ReactNativeScrollView, StyleSheet, View, } from "react-native";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { useNavigationBarScrollEdge } from "../utils/navigation";
import { isWeb, os } from "../utils/platform";
import { useScrollTrack } from "./scroll_track";
const AndroidTrackedScrollView = forwardRef((props, ref) => {
    const { navigationBarScrollEdgeOptions, onScroll, scrollEventThrottle, tracksNavigationBarScrollEdge, ...restProps } = props;
    const trackedOnScroll = useNavigationBarScrollEdge({
        navigationBarScrollEdgeOptions,
        onScroll: onScroll,
        tracksNavigationBarScrollEdge,
    });
    return (_jsx(ReactNativeScrollView, { ref: ref, nestedScrollEnabled: true, onScroll: trackedOnScroll, scrollEventThrottle: scrollEventThrottle ?? 16, ...restProps }));
});
AndroidTrackedScrollView.displayName = "AndroidTrackedScrollView";
const WebTrackedScrollView = forwardRef((props, ref) => {
    const { navigationBarScrollEdgeOptions, onScroll, scrollEventThrottle, tracksNavigationBarScrollEdge, ...webProps } = props;
    const trackedOnScroll = useNavigationBarScrollEdge({
        navigationBarScrollEdgeOptions,
        onScroll: onScroll,
        tracksNavigationBarScrollEdge,
    });
    return (_jsx(ReactNativeScrollView, { ref: ref, onScroll: trackedOnScroll, scrollEventThrottle: scrollEventThrottle ?? (trackedOnScroll == null ? undefined : 16), ...webProps }));
});
WebTrackedScrollView.displayName = "WebTrackedScrollView";
const BaseScrollView = forwardRef((props, ref) => {
    const { active: insideTrueSheet } = useTrueSheetScrollLayout();
    if (isWeb()) {
        return _jsx(WebTrackedScrollView, { ref: ref, ...props });
    }
    const { automaticallyAdjustsScrollIndicatorInsets, customScrollbar: _customScrollbar, iosEmptyViewportScrollEnabled = true, navigationBarScrollEdgeOptions, nestedScrollEnabled, scrollIndicatorInsets, tracksNavigationBarScrollEdge = false, ...restProps } = props;
    if (os() === "android" && tracksNavigationBarScrollEdge) {
        return (_jsx(AndroidTrackedScrollView, { ref: ref, automaticallyAdjustsScrollIndicatorInsets: automaticallyAdjustsScrollIndicatorInsets, navigationBarScrollEdgeOptions: navigationBarScrollEdgeOptions, nestedScrollEnabled: nestedScrollEnabled ?? true, scrollIndicatorInsets: scrollIndicatorInsets, tracksNavigationBarScrollEdge: true, ...restProps }));
    }
    // 普通 native-stack 页面已位于 header 下方，默认关闭系统的重复 indicator 调整。
    // 不能在这里补窗口 safe-area bottom：该 ScrollView 也可能只是页面中的局部滚动区域。
    // 页面级透明 header / safe-area 避让应显式开启 automaticallyAdjustsScrollIndicatorInsets。
    const manuallyAdjustNormalPageIndicator = os() === "ios" && !insideTrueSheet && automaticallyAdjustsScrollIndicatorInsets == null;
    return (_jsx(ReactNativeScrollView, { ref: ref, automaticallyAdjustsScrollIndicatorInsets: manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets, iosEmptyViewportScrollEnabled: os() === "ios" ? iosEmptyViewportScrollEnabled : undefined, nestedScrollEnabled: nestedScrollEnabled ?? true, scrollIndicatorInsets: scrollIndicatorInsets, ...restProps }));
});
const CustomScrollbarScrollView = forwardRef((props, ref) => {
    const { customScrollbar, style, ...scrollViewProps } = props;
    const nativeScrollRef = useRef(null);
    const customScrollbarOptions = typeof customScrollbar === "object" ? customScrollbar : {};
    const scrollTrack = useScrollTrack({
        ...customScrollbarOptions,
        onContentSizeChange: scrollViewProps.onContentSizeChange,
        onLayout: scrollViewProps.onLayout,
        onScroll: scrollViewProps.onScroll,
        scrollRef: nativeScrollRef,
    });
    useImperativeHandle(ref, () => nativeScrollRef.current);
    return (_jsxs(View, { style: [style, styles.customScrollbarContainer], children: [_jsx(BaseScrollView, { ...scrollViewProps, ref: nativeScrollRef, onContentSizeChange: scrollTrack.onContentSizeChange, onLayout: scrollTrack.onLayout, onScroll: scrollTrack.onScroll, scrollEventThrottle: scrollViewProps.scrollEventThrottle ?? 16, showsVerticalScrollIndicator: false, style: styles.customScrollbarScrollView }), scrollTrack.ScrollTrack] }));
});
CustomScrollbarScrollView.displayName = "CustomScrollbarScrollView";
export const ScrollView = forwardRef((props, ref) => {
    if (props.customScrollbar) {
        return _jsx(CustomScrollbarScrollView, { ref: ref, ...props });
    }
    return _jsx(BaseScrollView, { ref: ref, ...props });
});
const styles = StyleSheet.create({
    customScrollbarContainer: {
        position: "relative",
    },
    customScrollbarScrollView: {
        flex: 1,
    },
});
