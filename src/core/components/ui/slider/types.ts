import type { ColorValue, StyleProp, ViewProps, ViewStyle } from "react-native";

import type { NativeHapticsSetting } from "../utils";

/** Slider colors. Android native uses all fields; non-native uses track and thumb colors. */
export type SliderColors = {
  activeTickColor?: ColorValue;
  activeTrackColor?: ColorValue;
  inactiveTickColor?: ColorValue;
  inactiveTrackColor?: ColorValue;
  thumbColor?: ColorValue;
};

export type SliderValue = number[] | number;
export type SliderSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type SliderOrientation = "horizontal" | "vertical";

export function resolveSliderValues(value: SliderValue | undefined): number[] | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value : [value];
}

export function resolveSliderFirstValue(value: SliderValue | undefined, fallback: number) {
  return resolveSliderValues(value)?.[0] ?? fallback;
}

export interface SliderProps extends ViewProps {
  className?: string;
  defaultValue?: SliderValue;
  disabled?: boolean;
  max?: number;
  min?: number;
  native?: boolean;
  /** Non-native slider orientation. Vertical sliders use the custom implementation. */
  orientation?: SliderOrientation;
  /** Size of the non-native track and thumb. Defaults to `default` (`md`). */
  size?: SliderSize;
  colors?: SliderColors;
  /** Slider-specific tick feedback; enabled by default, or disable with false. */
  nativeHaptics?: NativeHapticsSetting;
  nativeHapticsInterval?: number;
  /** Convenience callback for single-value sliders; receives the first thumb value. */
  onChange?: (value: number) => void;
  /** Convenience callback after a single-value slider finishes changing. */
  onChangeFinished?: (value: number) => void;
  onValueChange?: (value: number[]) => void;
  onValueChangeFinished?: (value: number[]) => void;
  step?: number;
  /** Overrides the track container style. */
  trackStyle?: StyleProp<ViewStyle>;
  /** Overrides each active track segment style. */
  activeTrackStyle?: StyleProp<ViewStyle>;
  /** Overrides each thumb style. */
  thumbStyle?: StyleProp<ViewStyle>;
  thumbCount?: number;
  value?: SliderValue;
}
