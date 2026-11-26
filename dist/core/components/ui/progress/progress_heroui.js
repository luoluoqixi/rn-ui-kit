import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProgressBar } from "@heroui/react/progress-bar";
import { Label } from "@heroui/react/label";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { hasSlotContent } from "../utils/slot_content";
import { resolveProgress } from "./progress_state";
export function ProgressHeroUI(props) {
    const { min, max, current, isIndeterminate, valueText } = resolveProgress(props);
    const { label, labelProps, valueLabelProps, trackProps, indicatorProps } = props;
    const labelFont = StyleSheet.flatten(useDefaultTextStyle(undefined, labelProps?.className));
    const outputFont = StyleSheet.flatten(useDefaultTextStyle(undefined, valueLabelProps?.className));
    const hasLabel = hasSlotContent(label);
    return _jsxs(ProgressBar, { "aria-label": props.accessibilityLabel ?? (hasLabel ? undefined : "进度"), ...props.herouiWebProps, value: current, minValue: min, maxValue: max, isIndeterminate: isIndeterminate, valueLabel: valueText, formatOptions: props.formatOptions, size: props.size, color: props.color, className: props.className, children: [hasLabel && _jsx(Label, { ...labelProps?.herouiWebProps, className: labelProps?.className, style: { fontFamily: labelFont?.fontFamily, ...labelProps?.herouiWebProps?.style }, children: label }), props.showValueLabel && valueText != null && _jsx(ProgressBar.Output, { ...valueLabelProps?.herouiWebProps, className: valueLabelProps?.className, style: { fontFamily: outputFont?.fontFamily, ...valueLabelProps?.herouiWebProps?.style }, children: valueText }), _jsx(ProgressBar.Track, { ...trackProps?.herouiWebProps, className: trackProps?.className, children: _jsx(ProgressBar.Fill, { ...indicatorProps?.herouiWebProps, className: indicatorProps?.className }) })] });
}
