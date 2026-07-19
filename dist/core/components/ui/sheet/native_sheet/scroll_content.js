import { jsx as _jsx } from "react/jsx-runtime";
import { NavigationContext } from "@react-navigation/native";
import { forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { os } from "../../utils/platform";
import { AndroidClippedScrollView } from "./true_sheet/android_clipped_scroll_view";
import { getTrueSheetScrollBottomPadding, getTrueSheetScrollIndicatorBottomInset, } from "./true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "./true_sheet/true_sheet_scroll_context";
import { useOptionalTrueSheetScrollableBinding } from "./true_sheet/scrollable_binding_context";
/**
 * NativeSheet 内滚动容器：
 * - iOS TrueSheet 子树下复用现有 inset / detent 补偿
 * - Android TrueSheet 下使用裁剪滚动容器，避免滚动内容溢出圆角区域
 */
export const NativeSheetScrollContent = forwardRef(({ bindToNativeSheet = false, children, contentContainerStyle, extraBottomPadding, style, ...rest }, ref) => {
    const insets = useSafeAreaInsets();
    const binding = useOptionalTrueSheetScrollableBinding();
    const navigation = useContext(NavigationContext);
    const bindingOwnerRef = useRef({});
    const scrollViewRef = useRef(null);
    const shouldBindToNativeSheet = os() === "ios" && bindToNativeSheet;
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
        });
    }, [binding, navigation, shouldBindToNativeSheet]);
    if (os() === "android") {
        return (_jsx(AndroidClippedScrollView, { ref: ref, keyboardShouldPersistTaps: "handled", nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: [styles.androidScroll, style], contentContainerStyle: [styles.androidContent, contentContainerStyle], ...rest, children: children }));
    }
    const bottomPadding = getTrueSheetScrollBottomPadding({
        extraBottom: extraBottomPadding,
        insetAdjustment,
        nativeScrollInsetsApplied: effectiveNativeScrollInsetsApplied,
        safeAreaBottom: insets.bottom,
    });
    const indicatorBottomInset = getTrueSheetScrollIndicatorBottomInset({
        automaticContentInsetAdjustment,
        nativeScrollInsetsApplied: effectiveNativeScrollInsetsApplied,
        safeAreaBottom: insets.bottom,
    });
    return (_jsx(ScrollView, { ref: setScrollViewRef, keyboardShouldPersistTaps: "handled", nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: [styles.iosScroll, style], contentContainerStyle: [
            styles.iosContent,
            { paddingBottom: bottomPadding },
            contentContainerStyle,
        ], scrollIndicatorInsets: {
            bottom: indicatorBottomInset,
        }, contentInsetAdjustmentBehavior: automaticContentInsetAdjustment ? "automatic" : "never", ...rest, children: children }));
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
