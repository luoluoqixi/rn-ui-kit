import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
type IosNativeScrollEdgeHeaderOptions = Pick<NativeStackNavigationOptions, "headerBlurEffect" | "headerLargeStyle" | "headerShadowVisible" | "headerStyle" | "headerTransparent">;
/**
 * iOS 15–25 原生小标题导航栏的默认 scroll-edge 外观：
 * 顶部完全透明，离开顶部后使用系统 Thin Material 与原生分隔线。
 * iOS 26 保留系统 Liquid Glass / automatic scroll-edge effect，不叠加 blur。
 */
export declare function getIosNativeScrollEdgeHeaderOptions(): IosNativeScrollEdgeHeaderOptions;
/** @deprecated 使用 `getIosNativeScrollEdgeHeaderOptions`。 */
export declare const getIosTransparentHeaderFallbackOptions: typeof getIosNativeScrollEdgeHeaderOptions;
export {};
