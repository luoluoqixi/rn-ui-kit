import { View } from "react-native";
import type { GlassEffectProps } from "./types";
export declare const GlassEffectContainer: import("react").ForwardRefExoticComponent<Omit<import("expo-glass-effect").GlassContainerProps, "ref"> & import("react").RefAttributes<View>>;
/** Web fallback for Liquid Glass. */
export declare const GlassEffect: import("react").ForwardRefExoticComponent<Omit<GlassEffectProps, "ref"> & import("react").RefAttributes<View>> & {
    Container: import("react").ForwardRefExoticComponent<Omit<import("expo-glass-effect").GlassContainerProps, "ref"> & import("react").RefAttributes<View>>;
};
