import type { View } from "react-native";
import type { GlassEffectProps } from "./types";
export declare const GlassEffectContainer: import("react").ForwardRefExoticComponent<Omit<import("expo-glass-effect").GlassContainerProps, "ref"> & import("react").RefAttributes<View>>;
/**
 * iOS 26+ 使用系统原生 Liquid Glass；其他平台由 expo-glass-effect 降级为普通 View。
 *
 * 默认不附加布局或定位语义；启用 `keyboardAvoidance` 后会在 UI 线程跟随键盘位移。
 * 其余 GlassView props、style 与 children 均原样透传。
 */
export declare const GlassEffect: import("react").ForwardRefExoticComponent<Omit<GlassEffectProps, "ref"> & import("react").RefAttributes<View>> & {
    Container: import("react").ForwardRefExoticComponent<Omit<import("expo-glass-effect").GlassContainerProps, "ref"> & import("react").RefAttributes<View>>;
};
