import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { os } from "../platform";

/**
 * iOS 原生导航统一开启全屏返回手势，允许从页面任意横向位置左滑返回。
 */
export const IOS_NATIVE_STACK_FULL_SCREEN_BACK_GESTURE_ENABLED = os() === "ios";

export function withNativeStackGestureOptions<T extends NativeStackNavigationOptions>(
  screenOptions: T,
): T {
  if (os() !== "ios" || !IOS_NATIVE_STACK_FULL_SCREEN_BACK_GESTURE_ENABLED) {
    return screenOptions;
  }

  return {
    ...screenOptions,
    fullScreenGestureEnabled: true,
    fullScreenGestureShadowEnabled: true,
    gestureEnabled: true,
  };
}
