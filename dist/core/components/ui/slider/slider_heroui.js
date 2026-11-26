import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Slider } from "@heroui/react/slider";
import { Label } from "../label";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { FieldMessages } from "../utils/field_parts";
import { resolveRenderProp } from "../utils/render";
import { toSwiftUIHexColor } from "../utils/color/swift_ui_color";
import { cn } from "../utils/cn";
export function SliderHeroUI(p) {
    const context = { values: p.values, formattedValue: p.formattedValue, isDisabled: p.isDisabled ?? false };
    const outputFont = useDefaultTextStyle(undefined, p.outputProps?.className);
    const rootStyle = p.herouiWebProps?.style;
    const outputStyle = p.outputProps?.herouiWebProps?.style;
    const trackStyle = p.trackProps?.herouiWebProps?.style;
    const thumbStyle = p.thumbProps?.herouiWebProps?.style;
    const fillStyle = { backgroundColor: toSwiftUIHexColor(p.colors?.activeTrackColor), ...textWebStyle(p.activeTrackStyle), ...p.fillProps?.herouiWebProps?.style };
    // HeroUI also paints the filled end caps with --accent. Coloring only Fill
    // leaves those caps in the theme color, visible beside a custom track.
    const rootBaseStyle = {
        ...(fillStyle.backgroundColor == null ? {} : { "--accent": fillStyle.backgroundColor }),
        ...textWebStyle(p.style),
    };
    const showOutput = p.showValueLabel ?? (p.label != null || p.valueLabel != null);
    return _jsxs(Slider, { ...p.herouiWebProps, id: p.nativeID ?? p.herouiWebProps?.id, value: p.values, onChange: p.onChange, onChangeEnd: p.onChangeEnd, minValue: p.minValue, maxValue: p.maxValue, step: p.step, formatOptions: p.formatOptions, orientation: p.orientation, isDisabled: p.isDisabled, "aria-label": p.accessibilityLabel ?? p.herouiWebProps?.["aria-label"], className: cn("min-w-0", p.orientation !== "vertical" && "w-full", p.className), style: typeof rootStyle === "function" ? state => ({ ...rootBaseStyle, ...rootStyle(state) }) : { ...rootBaseStyle, ...rootStyle }, children: [(p.label != null || showOutput) && _jsxs("div", { className: "flex items-center justify-between gap-3", children: [p.label != null && _jsx(Label, { ...p.labelProps, className: cn(p.labelProps?.className, p.labelClassName), children: p.label }), showOutput && _jsx(Slider.Output, { ...p.outputProps?.herouiWebProps, className: p.outputProps?.className, style: typeof outputStyle === "function" ? state => ({ ...textWebStyle(outputFont), ...outputStyle(state) }) : { ...textWebStyle(outputFont), ...outputStyle }, children: resolveRenderProp(p.valueLabel, context) ?? p.formattedValue })] }), _jsxs(Slider.Track, { ...p.trackProps?.herouiWebProps, className: p.trackProps?.className, style: state => ({ backgroundColor: toSwiftUIHexColor(p.colors?.inactiveTrackColor), ...textWebStyle(p.trackStyle), ...(typeof trackStyle === "function" ? trackStyle(state) : trackStyle) }), children: [_jsx(Slider.Fill, { ...p.fillProps?.herouiWebProps, className: p.fillProps?.className, style: fillStyle }), p.values.map((_, index) => _createElement(Slider.Thumb, { ...p.thumbProps?.herouiWebProps, key: index, index: index, "aria-label": p.thumbLabels?.[index] ?? (p.values.length > 1 ? index === 0 ? "下限" : index === p.values.length - 1 ? "上限" : "值 " + (index + 1) : undefined), className: p.thumbProps?.className, style: state => ({ backgroundColor: toSwiftUIHexColor(p.colors?.thumbColor), ...textWebStyle(p.thumbStyle), ...(typeof thumbStyle === "function" ? thumbStyle(state) : thumbStyle) }) }))] }), _jsx(FieldMessages, { description: p.description, descriptionProps: p.descriptionProps, descriptionClassName: p.descriptionClassName })] });
}
