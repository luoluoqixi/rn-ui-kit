import * as Haptics from "expo-haptics";
import { type ReactNode } from "react";
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
export {};
