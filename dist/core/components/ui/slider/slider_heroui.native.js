import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Slider } from "heroui-native/slider";
import { View } from "react-native";
import { Text } from "../text";
import { Label } from "../label";
import { useDefaultTextStyle } from "../provider/font_provider";
import { FieldMessages } from "../utils/field_parts";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
export function SliderHeroUI(p) {
    const context = { values: p.values, formattedValue: p.formattedValue, isDisabled: p.isDisabled ?? false };
    const output = p.outputProps?.herouiNativeProps;
    const outputFont = useDefaultTextStyle(output?.textProps?.style, p.outputProps?.className);
    const showOutput = p.showValueLabel ?? (p.label != null || p.valueLabel != null);
    const outputContent = resolveRenderProp(p.valueLabel, context);
    const label = typeof p.label === "string" ? p.label : undefined;
    return _jsxs(Slider, { ...p.herouiNativeProps, nativeID: p.nativeID ?? p.herouiNativeProps?.nativeID, value: p.values, onChange: p.onChange, onChangeEnd: p.onChangeEnd, minValue: p.minValue, maxValue: p.maxValue, step: p.step, formatOptions: p.formatOptions, orientation: p.orientation, isDisabled: p.isDisabled, "aria-label": p.accessibilityLabel ?? label ?? p.herouiNativeProps?.["aria-label"], className: cn("min-w-0", p.orientation !== "vertical" && "w-full", p.className), style: [p.style, p.herouiNativeProps?.style], children: [(p.label != null || showOutput) && _jsxs(View, { className: "flex-row items-center justify-between gap-3", children: [p.label != null && _jsx(Label, { ...p.labelProps, className: cn(p.labelProps?.className, p.labelClassName), children: p.label }), showOutput && _jsx(Slider.Output, { ...output, className: p.outputProps?.className, textProps: { ...output?.textProps, style: outputFont }, children: typeof outputContent === "string" || typeof outputContent === "number" ? _jsx(Text, { style: outputFont, children: outputContent }) : outputContent })] }), _jsxs(Slider.Track, { ...p.trackProps?.herouiNativeProps, className: p.trackProps?.className, style: [p.colors?.inactiveTrackColor != null && { backgroundColor: p.colors.inactiveTrackColor }, p.trackStyle, p.trackProps?.herouiNativeProps?.style], children: [_jsx(Slider.Fill, { ...p.fillProps?.herouiNativeProps, className: p.fillProps?.className, style: [p.colors?.activeTrackColor != null && { backgroundColor: p.colors.activeTrackColor }, p.activeTrackStyle, p.fillProps?.herouiNativeProps?.style] }), p.values.map((_, index) => _createElement(Slider.Thumb, { ...p.thumbProps?.herouiNativeProps, key: index, index: index, accessibilityLabel: p.thumbLabels?.[index] ?? (p.values.length > 1 ? (p.accessibilityLabel ?? label ?? "") + (index === 0 ? "下限" : index === p.values.length - 1 ? "上限" : "值 " + (index + 1)) : p.accessibilityLabel ?? label), className: p.thumbProps?.className, style: [p.colors?.thumbColor != null && { backgroundColor: p.colors.thumbColor }, p.thumbStyle, p.thumbProps?.herouiNativeProps?.style] }))] }), _jsx(FieldMessages, { description: p.description, descriptionProps: p.descriptionProps, descriptionClassName: p.descriptionClassName })] });
}
