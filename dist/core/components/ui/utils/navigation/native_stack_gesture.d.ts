import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
/**
 * iOS 原生导航统一开启全屏返回手势，允许从页面任意横向位置左滑返回。
 */
export declare const IOS_NATIVE_STACK_FULL_SCREEN_BACK_GESTURE_ENABLED: boolean;
export declare function withNativeStackGestureOptions<T extends NativeStackNavigationOptions>(screenOptions: T): T;
