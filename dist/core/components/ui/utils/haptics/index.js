import * as Haptics from "expo-haptics";
import { createContext, createElement, useContext } from "react";
import { isWeb, os } from "../platform";
const NativeHapticsDefaultsContext = createContext({
    enabledByDefault: false,
});
const HAPTICS_STYLE_MAP = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
};
const ANDROID_HAPTICS_TYPE_MAP = {
    light: Haptics.AndroidHaptics.Keyboard_Tap,
    medium: Haptics.AndroidHaptics.Context_Click,
    heavy: Haptics.AndroidHaptics.Long_Press,
};
export function NativeHapticsProvider({ children, enabledByDefault = false, }) {
    return createElement(NativeHapticsDefaultsContext.Provider, { value: { enabledByDefault } }, children);
}
export function useResolvedNativeHaptics(setting, options) {
    const { enabledByDefault } = useContext(NativeHapticsDefaultsContext);
    if (setting !== undefined) {
        return setting;
    }
    if (options?.defaultEnabled) {
        return true;
    }
    return enabledByDefault ? true : undefined;
}
export function triggerNativeHaptics(setting, options) {
    if (setting == null || setting === false || isWeb()) {
        return;
    }
    const level = setting === true ? "light" : setting;
    if (os() === "android") {
        Haptics.performAndroidHapticsAsync(options?.androidType ?? ANDROID_HAPTICS_TYPE_MAP[level]).catch((err) => {
            console.error("[Haptics] performAndroidHapticsAsync 失败:", err);
        });
        return;
    }
    Haptics.impactAsync(HAPTICS_STYLE_MAP[level]).catch((err) => {
        console.error("[Haptics] impactAsync 失败:", err);
    });
}
export function triggerSliderNativeHaptics(setting) {
    if (setting == null || setting === false || isWeb()) {
        return;
    }
    if (os() === "ios") {
        Haptics.selectionAsync().catch((err) => {
            console.error("[Haptics] selectionAsync 失败:", err);
        });
        return;
    }
    triggerNativeHaptics(setting, {
        androidType: Haptics.AndroidHaptics.Segment_Frequent_Tick,
    });
}
export function resolveSliderHapticsInterval(options) {
    const { interval, min = 0, max = 100, step = 1 } = options;
    if (typeof interval === "number" && Number.isFinite(interval) && interval > 0) {
        return interval;
    }
    const resolvedStep = Number.isFinite(step) && step > 0 ? step : 1;
    const range = Math.abs(max - min);
    if (!Number.isFinite(range) || range <= 0) {
        return resolvedStep;
    }
    if (range < 1) {
        return resolvedStep;
    }
    return Math.max(1, resolvedStep);
}
export function getSliderHapticsBuckets(values, options) {
    const { min = 0, max = 100 } = options;
    const lowerBound = Math.min(min, max);
    const upperBound = Math.max(min, max);
    const interval = resolveSliderHapticsInterval(options);
    return (values ?? [lowerBound]).map((value) => {
        const clampedValue = Math.min(Math.max(value, lowerBound), upperBound);
        return Math.floor((clampedValue - lowerBound) / interval);
    });
}
