import { jsx as _jsx } from "react/jsx-runtime";
import { NavigationContext } from "@react-navigation/native";
import { forwardRef, useCallback, useContext, useEffect, useRef, useState, } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationBarScrollEdge, } from "../../utils/navigation";
import { os } from "../../utils/platform";
import { AndroidClippedScrollView } from "./true_sheet/android_clipped_scroll_view";
import { getTrueSheetScrollBottomPadding, getTrueSheetScrollIndicatorBottomInset, } from "./true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "./true_sheet/true_sheet_scroll_context";
import { useOptionalTrueSheetScrollableBinding } from "./true_sheet/scrollable_binding_context";
import { useTrueSheetOverlaySheetTopPosition } from "./true_sheet/overlay_layout_context";
/**
 * NativeSheet 内滚动容器：
 * - iOS TrueSheet 子树下复用现有 inset / detent 补偿
 * - Android TrueSheet 下使用裁剪滚动容器，避免滚动内容溢出圆角区域
 */
export const NativeSheetScrollContent = forwardRef(({ bindToNativeSheet = false, constrainToNativeSheetViewport = false, children, contentContainerStyle, extraBottomPadding, navigationBarScrollEdgeOptions, onLayout, onScroll, scrollEventThrottle, style, tracksNavigationBarScrollEdge, ...rest }, ref) => {
    const insets = useSafeAreaInsets();
    const binding = useOptionalTrueSheetScrollableBinding();
    const navigation = useContext(NavigationContext);
    const bindingOwnerRef = useRef({});
    const scrollViewRef = useRef(null);
    const layoutRefreshFrameRef = useRef(null);
    const viewportMeasureFrameRef = useRef(null);
    const [visibleViewportHeight, setVisibleViewportHeight] = useState(null);
    const { height: windowHeight } = useWindowDimensions();
    const sheetTopPosition = useTrueSheetOverlaySheetTopPosition();
    const shouldBindToNativeSheet = os() === "ios" && bindToNativeSheet;
    const shouldUseManualViewportInsets = os() === "ios" && constrainToNativeSheetViewport;
    const isRootSheetViewport = sheetTopPosition == null || sheetTopPosition <= 1;
    const shouldConstrainViewport = shouldUseManualViewportInsets;
    const measureVisibleViewport = useCallback(() => {
        if (viewportMeasureFrameRef.current != null) {
            cancelAnimationFrame(viewportMeasureFrameRef.current);
            viewportMeasureFrameRef.current = null;
        }
        if (!shouldConstrainViewport) {
            setVisibleViewportHeight(null);
            return;
        }
        viewportMeasureFrameRef.current = requestAnimationFrame(() => {
            viewportMeasureFrameRef.current = null;
            const scrollView = scrollViewRef.current;
            scrollView?.measureInWindow((_x, y) => {
                // Native Stack 在不同 iOS 版本上可能返回 presentation window 的局部 y，
                // 也可能返回 UIWindow 坐标。取两者较大的顶部位置，避免重复相加导致
                // 嵌套 Sheet 的可视高度被压缩两次，同时保留局部坐标路径的 detent 避让。
                const viewportTop = Math.max(y, sheetTopPosition ?? 0);
                // 根 Stack 的 ScrollView 不在 TrueSheet 原生内容树中，UIKit 不会替它
                // 裁掉 Home Indicator 区域；嵌套 Sheet 则已经由 detent viewport 裁剪。
                const bottomSafeArea = isRootSheetViewport ? insets.bottom : 0;
                const nextHeight = Math.max(0, Math.round(windowHeight - viewportTop - bottomSafeArea));
                setVisibleViewportHeight((current) => (current === nextHeight ? current : nextHeight));
            });
        });
    }, [insets.bottom, isRootSheetViewport, sheetTopPosition, shouldConstrainViewport, windowHeight]);
    const handleLayout = useCallback((event) => {
        onLayout?.(event);
        if (shouldConstrainViewport) {
            measureVisibleViewport();
        }
        if (!shouldBindToNativeSheet || binding == null)
            return;
        // A native-stack screen may receive a second Fabric layout after
        // navigation transitionEnd. Re-apply TrueSheet's frame pin after that
        // layout so the ScrollView does not remain window-sized at a lower detent.
        if (layoutRefreshFrameRef.current != null) {
            cancelAnimationFrame(layoutRefreshFrameRef.current);
        }
        layoutRefreshFrameRef.current = requestAnimationFrame(() => {
            layoutRefreshFrameRef.current = null;
            binding.refreshScrollableView(bindingOwnerRef.current);
            measureVisibleViewport();
        });
    }, [
        binding,
        measureVisibleViewport,
        onLayout,
        shouldBindToNativeSheet,
        shouldConstrainViewport,
    ]);
    useEffect(() => {
        return () => {
            if (layoutRefreshFrameRef.current != null) {
                cancelAnimationFrame(layoutRefreshFrameRef.current);
                layoutRefreshFrameRef.current = null;
            }
            if (viewportMeasureFrameRef.current != null) {
                cancelAnimationFrame(viewportMeasureFrameRef.current);
                viewportMeasureFrameRef.current = null;
            }
        };
    }, []);
    useEffect(() => {
        measureVisibleViewport();
    }, [measureVisibleViewport]);
    const trackedOnScroll = useNavigationBarScrollEdge({
        navigationBarScrollEdgeOptions,
        onScroll,
        tracksNavigationBarScrollEdge: os() === "web" && tracksNavigationBarScrollEdge === true,
    });
    const { automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied } = useTrueSheetScrollLayout();
    // Once the exact ScrollView is registered, TrueSheet applies its native content/indicator
    // insets even though deep Stack pages historically reported that native pinning was absent.
    const effectiveNativeScrollInsetsApplied = nativeScrollInsetsApplied || shouldBindToNativeSheet;
    const setScrollViewRef = useCallback((scrollView) => {
        scrollViewRef.current = scrollView;
        if (typeof ref === "function") {
            ref(scrollView);
        }
        else if (ref != null) {
            ref.current = scrollView;
        }
        if (shouldBindToNativeSheet) {
            binding?.registerScrollableView(bindingOwnerRef.current, scrollView);
        }
    }, [binding, ref, shouldBindToNativeSheet]);
    useEffect(() => {
        if (os() !== "ios")
            return;
        const owner = bindingOwnerRef.current;
        if (shouldBindToNativeSheet) {
            binding?.registerScrollableView(owner, scrollViewRef.current);
        }
        else {
            binding?.registerScrollableView(owner, null);
        }
        return () => binding?.registerScrollableView(owner, null);
    }, [binding, shouldBindToNativeSheet]);
    useEffect(() => {
        if (!shouldBindToNativeSheet || navigation == null)
            return;
        const owner = bindingOwnerRef.current;
        return navigation.addListener("transitionEnd", (event) => {
            if (event.data?.closing)
                return;
            binding?.refreshScrollableView(owner);
            measureVisibleViewport();
        });
    }, [binding, measureVisibleViewport, navigation, shouldBindToNativeSheet]);
    if (os() === "android") {
        return (_jsx(AndroidClippedScrollView, { ref: ref, keyboardShouldPersistTaps: "handled", nestedScrollEnabled: true, navigationBarScrollEdgeOptions: navigationBarScrollEdgeOptions, onScroll: onScroll, scrollEventThrottle: scrollEventThrottle, showsVerticalScrollIndicator: true, style: [styles.androidScroll, style], contentContainerStyle: [styles.androidContent, contentContainerStyle], tracksNavigationBarScrollEdge: tracksNavigationBarScrollEdge, ...rest, children: children }));
    }
    // Native Stack 仍须由 UIKit 自动处理顶部 header inset。
    // 直接嵌套的 Sheet 已由 TrueSheet 注入 contentInset；而 NativeSheetStack
    // 为避免失效 tag 不注册滚动视图，需在 JS 侧补回底部安全区留白。
    const bottomPadding = shouldUseManualViewportInsets && isRootSheetViewport
        ? (extraBottomPadding ?? 24)
        : shouldUseManualViewportInsets
            ? getTrueSheetScrollBottomPadding({
                extraBottom: extraBottomPadding,
                nativeScrollInsetsApplied: effectiveNativeScrollInsetsApplied,
                safeAreaBottom: insets.bottom,
            })
            : getTrueSheetScrollBottomPadding({
                extraBottom: extraBottomPadding,
                insetAdjustment,
                nativeScrollInsetsApplied: effectiveNativeScrollInsetsApplied,
                safeAreaBottom: insets.bottom,
            });
    const indicatorBottomInset = shouldUseManualViewportInsets
        ? 0
        : getTrueSheetScrollIndicatorBottomInset({
            automaticContentInsetAdjustment,
            nativeScrollInsetsApplied: effectiveNativeScrollInsetsApplied,
            safeAreaBottom: insets.bottom,
        });
    return (_jsx(ScrollView, { ref: setScrollViewRef, onLayout: handleLayout, keyboardShouldPersistTaps: "handled", nestedScrollEnabled: true, onScroll: trackedOnScroll, showsVerticalScrollIndicator: true, style: [
            styles.iosScroll,
            style,
            visibleViewportHeight != null
                ? { flex: 0, height: visibleViewportHeight, maxHeight: visibleViewportHeight }
                : null,
        ], contentContainerStyle: [
            styles.iosContent,
            { paddingBottom: bottomPadding },
            contentContainerStyle,
        ], ...(shouldBindToNativeSheet
            ? {}
            : {
                scrollIndicatorInsets: {
                    bottom: indicatorBottomInset,
                },
            }), scrollEventThrottle: scrollEventThrottle ?? (trackedOnScroll == null ? undefined : 16), contentInsetAdjustmentBehavior: shouldUseManualViewportInsets
            ? "automatic"
            : automaticContentInsetAdjustment
                ? "automatic"
                : "never", ...rest, children: children }));
});
NativeSheetScrollContent.displayName = "NativeSheetScrollContent";
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
