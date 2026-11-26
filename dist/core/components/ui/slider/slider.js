import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Platform, View } from "react-native";
import { Label } from "../label";
import { Text } from "../text";
import { FieldMessages } from "../utils/field_parts";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { SliderHeroUI } from "./slider_heroui";
import { NativeSlider } from "./slider_native";
import { resolveSliderValues, useSliderState } from "./slider_state";
export function Slider(p) {
    const orientation = p.orientation ?? "horizontal";
    const count = resolveSliderValues(p.value ?? p.defaultValue)?.length ?? 1;
    const system = (p.native ?? true) && Platform.OS !== "web" && orientation === "horizontal" && count <= 1;
    const state = useSliderState(p, !system);
    const formattedValue = state.values.map((value) => p.formatOptions ? new Intl.NumberFormat(undefined, p.formatOptions).format(value) : String(value)).join(" – ");
    const showOutput = p.showValueLabel ?? (p.label != null || p.valueLabel != null);
    if (!system)
        return _jsx(SliderHeroUI, { ...p, minValue: state.min, maxValue: state.max, step: state.step, values: state.values, onChange: state.change, onChangeEnd: state.end, formattedValue: formattedValue });
    return _jsxs(View, { nativeID: p.nativeID, className: cn("w-full gap-2", p.className), style: p.style, children: [(p.label != null || showOutput) && _jsxs(View, { className: "flex-row items-center justify-between gap-3", children: [p.label != null && _jsx(Label, { ...p.labelProps, className: cn(p.labelProps?.className, p.labelClassName), children: p.label }), showOutput && _jsx(Text, { className: p.outputProps?.className, children: resolveRenderProp(p.valueLabel, { values: state.values, formattedValue, isDisabled: p.isDisabled ?? false }) ?? formattedValue })] }), _jsx(NativeSlider, { value: state.values[0], min: state.min, max: state.max, step: state.nativeStep, isDisabled: p.isDisabled, colors: p.colors, nativeHaptics: p.nativeHaptics, nativeHapticsInterval: p.nativeHapticsInterval, onChange: state.change, onChangeFinished: state.end }), _jsx(FieldMessages, { description: p.description, descriptionProps: p.descriptionProps, descriptionClassName: p.descriptionClassName })] });
}
