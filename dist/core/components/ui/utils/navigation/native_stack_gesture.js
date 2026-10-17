import { os } from "../platform";
import { getIosNativeScrollEdgeHeaderOptions } from "./translucent_header_background";
/**
 * iOS 原生导航统一开启全屏返回手势，允许从页面任意横向位置左滑返回。
 */
export const IOS_NATIVE_STACK_FULL_SCREEN_BACK_GESTURE_ENABLED = os() === "ios";
export function withNativeStackGestureOptions(screenOptions) {
    if (os() !== "ios" || !IOS_NATIVE_STACK_FULL_SCREEN_BACK_GESTURE_ENABLED) {
        return screenOptions;
    }
    return {
        ...getIosNativeScrollEdgeHeaderOptions(),
        ...screenOptions,
        fullScreenGestureEnabled: true,
        fullScreenGestureShadowEnabled: true,
        gestureEnabled: true,
    };
}
