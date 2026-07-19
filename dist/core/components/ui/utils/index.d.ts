import * as Haptics from "expo-haptics";
import { type ReactNode } from "react";
import { type DimensionValue } from "react-native";
export type NativeHapticsLevel = "light" | "medium" | "heavy";
export type NativeHapticsSetting = boolean | NativeHapticsLevel;
type NativeHapticsDefaultsContextValue = {
    enabledByDefault: boolean;
};
type NativeHapticsProviderProps = {
    children: ReactNode;
    enabledByDefault?: boolean;
};
type ResolveNativeHapticsOptions = {
    defaultEnabled?: boolean;
};
type TriggerNativeHapticsOptions = {
    androidType?: Haptics.AndroidHaptics;
};
export declare function NativeHapticsProvider({ children, enabledByDefault, }: NativeHapticsProviderProps): import("react").FunctionComponentElement<import("react").ProviderProps<NativeHapticsDefaultsContextValue>>;
export declare function useResolvedNativeHaptics(setting: NativeHapticsSetting | undefined, options?: ResolveNativeHapticsOptions): NativeHapticsSetting | undefined;
export declare function resolveAriaLabel(explicitLabel?: string, fallbackNode?: ReactNode): string | undefined;
export declare function resolvePercentageValue(value: DimensionValue | undefined, availableSize: number): DimensionValue | undefined;
export declare function triggerNativeHaptics(setting: NativeHapticsSetting | undefined, options?: TriggerNativeHapticsOptions): void;
export declare function triggerSliderNativeHaptics(setting: NativeHapticsSetting | undefined): void;
export declare function resolveSliderHapticsInterval(options: {
    interval?: number;
    min?: number;
    max?: number;
    step?: number;
}): number;
export declare function getSliderHapticsBuckets(values: number[] | undefined, options: {
    interval?: number;
    min?: number;
    max?: number;
    step?: number;
}): number[];
/** 将 CSS 色值转为 Android ARGB 有符号整数。
 *  支持：hex(#RGB/#RRGGBB/#RRGGBBAA)、rgb/rgba、hsl/hsla。 */
export declare function toARGB(val: unknown): number | undefined;
export * from "./navigation";
export * from "./platform";
export * from "./page_sheet_gesture_lock";
export * from "./screen_overlay_portal";
export * from "./storage";
export * from "./swift_ui_color";
export * from "./theme";
