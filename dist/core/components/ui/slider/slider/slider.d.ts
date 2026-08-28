import { type RefObject } from "react";
import { type LayoutChangeEvent, type View } from "react-native";
import { type SliderProps } from "../types";
export declare function useSliderBehavior({ defaultValue, disabled, max, min, nativeHaptics, nativeHapticsInterval, onChange, onChangeFinished, onLayout, onValueChange, onValueChangeFinished, step: stepProp, thumbCount, value, sliderRef, }: Pick<SliderProps, "defaultValue" | "disabled" | "max" | "min" | "nativeHaptics" | "nativeHapticsInterval" | "onChange" | "onChangeFinished" | "onLayout" | "onValueChange" | "onValueChangeFinished" | "step" | "thumbCount" | "value"> & {
    sliderRef?: RefObject<View | null>;
}): {
    handleLayout: (event: LayoutChangeEvent) => void;
    nativeGesture: import("react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture").PanGesture | null;
    values: number[];
};
