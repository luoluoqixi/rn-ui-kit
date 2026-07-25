import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { NavigationContext } from "@react-navigation/native";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { useCallback, useContext, useLayoutEffect, useMemo, useRef } from "react";

import { isIos26Plus, os } from "../platform";
import { useAppBackgroundColors } from "../theme";

import { getIosNativeScrollEdgeHeaderOptions } from "./translucent_header_background";

const DEFAULT_ANDROID_TOP_THRESHOLD = 1;

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
type ScrollHandler = NonNullable<ScrollViewProps["onScroll"]>;

type NavigationWithHeaderOptions = {
  setOptions: (options: {
    headerStyle: StyleProp<ViewStyle>;
    headerTransparent: boolean;
  }) => void;
};

export type NativeStackScrollEdgeHeaderOptions = {
  /** 页面内容区颜色；Android 位于顶部时使用它，让 Header 与页面自然融为一体。 */
  screenBackgroundColor: string;
  /** 常规 Header 颜色；Android 离开顶部后使用它。 */
  headerBackgroundColor: string;
};

/**
 * 页面级滚动容器驱动导航栏边缘状态时的可选配置。
 *
 * iOS 不读取这些颜色或阈值，仍完全由 UIKit 的 scroll-edge appearance 驱动。
 */
export type NavigationBarScrollEdgeTrackingOptions = {
  /** Android 顶部状态颜色；默认使用 `useAppBackgroundColors().screen`。 */
  topBackgroundColor?: string;
  /** Android 非顶部状态颜色；默认使用 `useAppBackgroundColors().header`。 */
  scrolledBackgroundColor?: string;
  /** Android 离开顶部的偏移阈值，单位为 pt；默认 1。 */
  topThreshold?: number;
  /**
   * Android 更新 `headerStyle` 时需要保留的额外样式。
   * 普通 native-stack 页面通常不需要；自定义高度的 JS Stack 可以显式传入。
   */
  androidHeaderStyle?: StyleProp<ViewStyle>;
};

export type NavigationBarScrollEdgeTrackingProps = {
  /**
   * 将当前滚动容器声明为页面级、负责驱动 Header scroll-edge 状态的唯一容器。
   *
   * iOS React Native ScrollView 由 UIKit 原生识别；iOS NativeList 会注册底层原生列表；
   * Android 只在顶部状态发生变化时切换两种实体背景色。
   */
  tracksNavigationBarScrollEdge?: boolean;
  navigationBarScrollEdgeOptions?: NavigationBarScrollEdgeTrackingOptions;
};

type UseNavigationBarScrollEdgeParams = NavigationBarScrollEdgeTrackingProps & {
  onScroll?: ScrollViewProps["onScroll"];
};

/**
 * 生成跨版本、跨平台的 native-stack scroll-edge Header 基础配置。
 *
 * - iOS 15–25：保留当前原生 scrollEdgeAppearance / standardAppearance 路径。
 * - iOS 26+：保持透明 Header、系统 Liquid Glass 与原生返回按钮历史菜单。
 * - Android：Header 始终参与正常布局，顶部先使用页面色；滚动后的颜色由页面级
 *   ScrollView / NativeList 的 `tracksNavigationBarScrollEdge` 驱动。
 */
export function getNativeStackScrollEdgeHeaderOptions({
  headerBackgroundColor,
  screenBackgroundColor,
}: NativeStackScrollEdgeHeaderOptions): NativeStackNavigationOptions {
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
export function useNavigationBarScrollEdge({
  navigationBarScrollEdgeOptions,
  onScroll,
  tracksNavigationBarScrollEdge = false,
}: UseNavigationBarScrollEdgeParams): ScrollViewProps["onScroll"] {
  const navigation = useContext(NavigationContext) as NavigationWithHeaderOptions | undefined;
  const appBackgroundColors = useAppBackgroundColors();
  const atTopRef = useRef(true);
  const enabled =
    os() === "android" && tracksNavigationBarScrollEdge && navigation != null;
  const topBackgroundColor =
    navigationBarScrollEdgeOptions?.topBackgroundColor ?? appBackgroundColors.screen;
  const scrolledBackgroundColor =
    navigationBarScrollEdgeOptions?.scrolledBackgroundColor ?? appBackgroundColors.header;
  const topThreshold = Math.max(
    0,
    navigationBarScrollEdgeOptions?.topThreshold ?? DEFAULT_ANDROID_TOP_THRESHOLD,
  );
  const androidHeaderStyle = useMemo(
    () => StyleSheet.flatten(navigationBarScrollEdgeOptions?.androidHeaderStyle) ?? {},
    [navigationBarScrollEdgeOptions?.androidHeaderStyle],
  );

  const applyHeaderState = useCallback(
    (atTop: boolean) => {
      if (!enabled) return;

      navigation.setOptions({
        headerStyle: {
          ...androidHeaderStyle,
          backgroundColor: atTop ? topBackgroundColor : scrolledBackgroundColor,
        },
        // Android 只切换两种实体颜色，始终保留 Header 的正常布局占位。
        headerTransparent: false,
      });
    },
    [
      androidHeaderStyle,
      enabled,
      navigation,
      scrolledBackgroundColor,
      topBackgroundColor,
    ],
  );

  useLayoutEffect(() => {
    applyHeaderState(atTopRef.current);
  }, [applyHeaderState]);

  const trackedOnScroll = useCallback<ScrollHandler>(
    (event: ScrollEvent) => {
      onScroll?.(event);
      if (!enabled) return;

      const offsetY = Math.max(0, event.nativeEvent.contentOffset.y);
      const nextAtTop = offsetY <= topThreshold;
      if (nextAtTop === atTopRef.current) return;

      atTopRef.current = nextAtTop;
      applyHeaderState(nextAtTop);
    },
    [applyHeaderState, enabled, onScroll, topThreshold],
  );

  return enabled ? trackedOnScroll : onScroll;
}
