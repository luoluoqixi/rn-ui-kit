import type { ComponentProps } from "react";
import type { ColorValue, StyleProp, ViewStyle } from "react-native";
import type { Slider as NativeSlider } from "heroui-native/slider";
import type { Slider as WebSlider } from "@heroui/react/slider";
import type { FieldMetadata, FieldSlotProps } from "../utils/field_types";
import type { NativeHapticsSetting, RenderProp } from "../utils";
/** Android system slider supports all colors; HeroUI supports track and thumb colors. */
export type SliderColors = {
    activeTickColor?: ColorValue;
    activeTrackColor?: ColorValue;
    inactiveTickColor?: ColorValue;
    inactiveTrackColor?: ColorValue;
    thumbColor?: ColorValue;
};
export type SliderValue = number | number[];
export type SliderOrientation = "horizontal" | "vertical";
export type SliderRenderContext = {
    values: number[];
    formattedValue: string;
    isDisabled: boolean;
};
export type SliderProps<T extends SliderValue = number> = Pick<FieldMetadata, "label" | "labelProps" | "labelClassName" | "description" | "descriptionProps" | "descriptionClassName"> & FieldSlotProps<ComponentProps<typeof NativeSlider>, ComponentProps<typeof WebSlider>, "value" | "defaultValue" | "onChange" | "onChangeEnd" | "minValue" | "maxValue" | "step" | "isDisabled" | "orientation" | "formatOptions"> & {
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    onChangeEnd?: (value: T) => void;
    minValue?: number;
    maxValue?: number;
    /** Positive step, or 0 for continuous system sliders / fine-grained HeroUI sliders. */
    step?: number;
    isDisabled?: boolean;
    orientation?: SliderOrientation;
    /** Defaults true; ranges and vertical orientation always use HeroUI. */
    native?: boolean;
    nativeHaptics?: NativeHapticsSetting;
    nativeHapticsInterval?: number;
    accessibilityLabel?: string;
    thumbLabels?: string[];
    nativeID?: string;
    formatOptions?: Intl.NumberFormatOptions;
    showValueLabel?: boolean;
    valueLabel?: RenderProp<SliderRenderContext>;
    outputProps?: FieldSlotProps<ComponentProps<typeof NativeSlider.Output>, ComponentProps<typeof WebSlider.Output>>;
    trackProps?: FieldSlotProps<ComponentProps<typeof NativeSlider.Track>, ComponentProps<typeof WebSlider.Track>>;
    fillProps?: FieldSlotProps<ComponentProps<typeof NativeSlider.Fill>, ComponentProps<typeof WebSlider.Fill>>;
    thumbProps?: FieldSlotProps<ComponentProps<typeof NativeSlider.Thumb>, ComponentProps<typeof WebSlider.Thumb>, "index" | "isDisabled">;
    colors?: SliderColors;
    style?: StyleProp<ViewStyle>;
    trackStyle?: StyleProp<ViewStyle>;
    activeTrackStyle?: StyleProp<ViewStyle>;
    thumbStyle?: StyleProp<ViewStyle>;
    /** Existing convenience callbacks retained independently of the HeroUI value shape. */
    onValueChange?: (values: number[]) => void;
    onValueChangeFinished?: (values: number[]) => void;
    onChangeFinished?: (firstValue: number) => void;
};
/** Internal adapter contract: thumbs always receive an array; public callbacks preserve input shape. */
export type SliderAdapterProps = Omit<SliderProps<SliderValue>, "value" | "onChange" | "onChangeEnd"> & {
    values: number[];
    onChange: (value: SliderValue) => void;
    onChangeEnd: (value: SliderValue) => void;
    formattedValue: string;
};
/** Internal system-renderer API, preserving its native events and feedback policy. */
export type SliderNativeProps = {
    value?: SliderValue;
    defaultValue?: SliderValue;
    min?: number;
    max?: number;
    step?: number;
    isDisabled?: boolean;
    colors?: SliderColors;
    style?: StyleProp<ViewStyle>;
    nativeHaptics?: NativeHapticsSetting;
    nativeHapticsInterval?: number;
    onChange?: (value: number) => void;
    onChangeFinished?: (value: number) => void;
    onValueChange?: (values: number[]) => void;
    onValueChangeFinished?: (values: number[]) => void;
};
