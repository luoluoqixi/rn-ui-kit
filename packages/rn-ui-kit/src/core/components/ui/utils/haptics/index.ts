import * as Haptics from "expo-haptics";
import { type ReactNode, createContext, createElement, useContext } from "react";

import { isWeb, os } from "../platform";

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

const NativeHapticsDefaultsContext = createContext<NativeHapticsDefaultsContextValue>({
  enabledByDefault: false,
});

const HAPTICS_STYLE_MAP: Record<NativeHapticsLevel, Haptics.ImpactFeedbackStyle> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

const ANDROID_HAPTICS_TYPE_MAP: Record<NativeHapticsLevel, Haptics.AndroidHaptics> = {
  light: Haptics.AndroidHaptics.Keyboard_Tap,
  medium: Haptics.AndroidHaptics.Context_Click,
  heavy: Haptics.AndroidHaptics.Long_Press,
};

export function NativeHapticsProvider({
  children,
  enabledByDefault = false,
}: NativeHapticsProviderProps) {
  return createElement(
    NativeHapticsDefaultsContext.Provider,
    { value: { enabledByDefault } },
    children,
  );
}

export function useResolvedNativeHaptics(
  setting: NativeHapticsSetting | undefined,
  options?: ResolveNativeHapticsOptions,
) {
  const { enabledByDefault } = useContext(NativeHapticsDefaultsContext);

  if (setting !== undefined) {
    return setting;
  }

  if (options?.defaultEnabled) {
    return true;
  }

  return enabledByDefault ? true : undefined;
}

export function triggerNativeHaptics(
  setting: NativeHapticsSetting | undefined,
  options?: TriggerNativeHapticsOptions,
) {
  if (setting == null || setting === false || isWeb()) {
    return;
  }
  const level = setting === true ? "light" : setting;

  if (os() === "android") {
    Haptics.performAndroidHapticsAsync(
      options?.androidType ?? ANDROID_HAPTICS_TYPE_MAP[level],
    ).catch((err: unknown) => {
      console.error("[Haptics] performAndroidHapticsAsync 失败:", err);
    });
    return;
  }

  Haptics.impactAsync(HAPTICS_STYLE_MAP[level]).catch((err: unknown) => {
    console.error("[Haptics] impactAsync 失败:", err);
  });
}

export function triggerSliderNativeHaptics(setting: NativeHapticsSetting | undefined) {
  if (setting == null || setting === false || isWeb()) {
    return;
  }

  if (os() === "ios") {
    Haptics.selectionAsync().catch((err: unknown) => {
      console.error("[Haptics] selectionAsync 失败:", err);
    });
    return;
  }

  triggerNativeHaptics(setting, {
    androidType: Haptics.AndroidHaptics.Segment_Frequent_Tick,
  });
}

export function resolveSliderHapticsInterval(options: {
  interval?: number;
  min?: number;
  max?: number;
  step?: number;
}) {
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

export function getSliderHapticsBuckets(
  values: number[] | undefined,
  options: {
    interval?: number;
    min?: number;
    max?: number;
    step?: number;
  },
) {
  const { min = 0, max = 100 } = options;
  const lowerBound = Math.min(min, max);
  const upperBound = Math.max(min, max);
  const interval = resolveSliderHapticsInterval(options);

  return (values ?? [lowerBound]).map((value) => {
    const clampedValue = Math.min(Math.max(value, lowerBound), upperBound);
    return Math.floor((clampedValue - lowerBound) / interval);
  });
}
