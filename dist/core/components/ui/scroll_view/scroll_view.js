import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";
import { ScrollView as TamaguiScrollView } from "tamagui";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { useNavigationBarScrollEdge } from "../utils/navigation";
import { isWeb, os } from "../utils/platform";
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
export const ScrollView = forwardRef((props, ref) => {
    const { active: insideTrueSheet } = useTrueSheetScrollLayout();
    if (isWeb()) {
        const { bottomSheetScrollable: _bottomSheetScrollable, navigationBarScrollEdgeOptions: _navigationBarScrollEdgeOptions, tracksNavigationBarScrollEdge: _tracksNavigationBarScrollEdge, ...webProps } = props;
        void _bottomSheetScrollable;
        void _navigationBarScrollEdgeOptions;
        void _tracksNavigationBarScrollEdge;
        return _jsx(TamaguiScrollView, { ref: ref, ...webProps });
    }
    const { automaticallyAdjustsScrollIndicatorInsets, bottomSheetScrollable = true, navigationBarScrollEdgeOptions, nestedScrollEnabled, scrollIndicatorInsets, tracksNavigationBarScrollEdge = false, ...restProps } = props;
    void bottomSheetScrollable;
    if (os() === "android" && tracksNavigationBarScrollEdge) {
        return (_jsx(AndroidTrackedScrollView, { ref: ref, automaticallyAdjustsScrollIndicatorInsets: automaticallyAdjustsScrollIndicatorInsets, navigationBarScrollEdgeOptions: navigationBarScrollEdgeOptions, nestedScrollEnabled: nestedScrollEnabled ?? true, scrollIndicatorInsets: scrollIndicatorInsets, tracksNavigationBarScrollEdge: true, ...restProps }));
    }
    // 普通 native-stack 页面已位于 header 下方，默认关闭系统的重复 indicator 调整。
    // 不能在这里补窗口 safe-area bottom：该 ScrollView 也可能只是页面中的局部滚动区域。
    // 页面级透明 header / safe-area 避让应显式开启 automaticallyAdjustsScrollIndicatorInsets。
    const manuallyAdjustNormalPageIndicator = os() === "ios" && !insideTrueSheet && automaticallyAdjustsScrollIndicatorInsets == null;
    return (_jsx(ReactNativeScrollView, { ref: ref, automaticallyAdjustsScrollIndicatorInsets: manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets, nestedScrollEnabled: nestedScrollEnabled ?? true, scrollIndicatorInsets: scrollIndicatorInsets, ...restProps }));
});
