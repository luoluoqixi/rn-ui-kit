import { NavigationContext } from "@react-navigation/native";
import { StyleSheet, } from "react-native";
import { useCallback, useContext, useLayoutEffect, useMemo, useRef } from "react";
import { isIos26Plus, os } from "../platform";
import { useAppBackgroundColors } from "../theme";
import { getIosNativeScrollEdgeHeaderOptions } from "./translucent_header_background";
const DEFAULT_ANDROID_TOP_THRESHOLD = 1;
/**
 * 生成跨版本、跨平台的 native-stack scroll-edge Header 基础配置。
 *
 * - iOS 15–25：保留当前原生 scrollEdgeAppearance / standardAppearance 路径。
 * - iOS 26+：保持透明 Header、系统 Liquid Glass 与原生返回按钮历史菜单。
 * - Android：Header 始终参与正常布局，顶部先使用页面色；滚动后的颜色由页面级
 *   ScrollView / NativeList 的 `tracksNavigationBarScrollEdge` 驱动。
 */
export function getNativeStackScrollEdgeHeaderOptions({ headerBackgroundColor, screenBackgroundColor, }) {
    if (os() === "ios") {
        const ios26Plus = isIos26Plus();
        return {
            ...getIosNativeScrollEdgeHeaderOptions(),
            headerBackButtonDisplayMode: ios26Plus ? "minimal" : "default",
            headerBackButtonMenuEnabled: true,
            headerShadowVisible: !ios26Plus,
            headerStyle: {
                backgroundColor: "transparent",
            },
            headerTransparent: true,
        };
    }
    if (os() === "android") {
        return {
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: screenBackgroundColor,
            },
            headerTransparent: false,
        };
    }
    return {
        headerShadowVisible: false,
        headerStyle: {
            backgroundColor: headerBackgroundColor,
        },
        headerTransparent: false,
    };
}
/**
 * 合并调用方 onScroll，并只在 Android 的“顶部 / 非顶部”边界发生变化时更新 Header。
 * iOS 和其它平台原样返回调用方 onScroll，不参与状态判断。
 */
export function useNavigationBarScrollEdge({ navigationBarScrollEdgeOptions, onScroll, tracksNavigationBarScrollEdge = false, }) {
    const navigation = useContext(NavigationContext);
    const appBackgroundColors = useAppBackgroundColors();
    const atTopRef = useRef(true);
    const enabled = os() === "android" && tracksNavigationBarScrollEdge && navigation != null;
    const topBackgroundColor = navigationBarScrollEdgeOptions?.topBackgroundColor ?? appBackgroundColors.screen;
    const scrolledBackgroundColor = navigationBarScrollEdgeOptions?.scrolledBackgroundColor ?? appBackgroundColors.header;
    const topThreshold = Math.max(0, navigationBarScrollEdgeOptions?.topThreshold ?? DEFAULT_ANDROID_TOP_THRESHOLD);
    const androidHeaderStyle = useMemo(() => StyleSheet.flatten(navigationBarScrollEdgeOptions?.androidHeaderStyle) ?? {}, [navigationBarScrollEdgeOptions?.androidHeaderStyle]);
    const applyHeaderState = useCallback((atTop) => {
        if (!enabled)
            return;
        navigation.setOptions({
            headerStyle: {
                ...androidHeaderStyle,
                backgroundColor: atTop ? topBackgroundColor : scrolledBackgroundColor,
            },
            // Android 只切换两种实体颜色，始终保留 Header 的正常布局占位。
            headerTransparent: false,
        });
    }, [
        androidHeaderStyle,
        enabled,
        navigation,
        scrolledBackgroundColor,
        topBackgroundColor,
    ]);
    useLayoutEffect(() => {
        applyHeaderState(atTopRef.current);
    }, [applyHeaderState]);
    const trackedOnScroll = useCallback((event) => {
        onScroll?.(event);
        if (!enabled)
            return;
        const offsetY = Math.max(0, event.nativeEvent.contentOffset.y);
        const nextAtTop = offsetY <= topThreshold;
        if (nextAtTop === atTopRef.current)
            return;
        atTopRef.current = nextAtTop;
        applyHeaderState(nextAtTop);
    }, [applyHeaderState, enabled, onScroll, topThreshold]);
    return enabled ? trackedOnScroll : onScroll;
}
