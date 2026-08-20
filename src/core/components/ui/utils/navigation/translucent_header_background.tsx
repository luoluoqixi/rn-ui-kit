import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { isIos26Plus, os } from "../platform";

type IosNativeScrollEdgeHeaderOptions = Pick<
  NativeStackNavigationOptions,
  | "headerBlurEffect"
  | "headerLargeStyle"
  | "headerShadowVisible"
  | "headerStyle"
  | "headerTransparent"
>;

/**
 * iOS 15–25 原生小标题导航栏的默认 scroll-edge 外观：
 * 顶部完全透明，离开顶部后使用系统 Thin Material 与原生分隔线。
 * iOS 26 保留系统 Liquid Glass / automatic scroll-edge effect，不叠加 blur。
 */
export function getIosNativeScrollEdgeHeaderOptions(): IosNativeScrollEdgeHeaderOptions {
  if (os() !== "ios" || isIos26Plus()) {
    return {};
  }

  return {
    headerBlurEffect: "systemThinMaterial",
    headerLargeStyle: {
      backgroundColor: "transparent",
    },
    headerShadowVisible: true,
    headerStyle: {
      backgroundColor: "transparent",
    },
    headerTransparent: true,
  };
}

/** @deprecated 使用 `getIosNativeScrollEdgeHeaderOptions`。 */
export const getIosTransparentHeaderFallbackOptions = getIosNativeScrollEdgeHeaderOptions;
