import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from "@tamagui/lucide-icons-2";
import { useId, useState } from "react";
import { Checkbox as TamaguiCheckbox, Label as TamaguiLabel, XStack } from "tamagui";
import { os } from "../utils/platform";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
function CheckboxRoot(props) {
    const generatedId = useId();
    const { checked: checkedProp, children, defaultChecked, id, indicatorProps, label, labelProps, nativeHaptics, onCheckedChange, ...rootProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const controlId = id ?? generatedId;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
    const checked = checkedProp ?? uncontrolledChecked;
    const shouldHandleLabelPress = os() === "ios";
    const handleCheckedChange = (nextChecked) => {
        if (checkedProp === undefined) {
            setUncontrolledChecked(nextChecked);
        }
        onCheckedChange?.(nextChecked);
        triggerNativeHaptics(resolvedNativeHaptics);
    };
    const checkbox = (_jsx(TamaguiCheckbox, { ...rootProps, checked: checked, id: controlId, onCheckedChange: handleCheckedChange, children: children ?? _jsx(CheckboxIndicator, { ...indicatorProps }) }));
    if (label == null) {
        return checkbox;
    }
    const labelElement = shouldHandleLabelPress ? (_jsx(XStack, { onPress: (event) => {
            labelProps?.onPress?.(event);
            if (rootProps.disabled || event.defaultPrevented) {
                return;
            }
            handleCheckedChange(checked === "indeterminate" ? true : !checked);
        }, children: _jsx(TamaguiLabel, { ...labelProps, pointerEvents: "none", children: label }) })) : (_jsx(TamaguiLabel, { ...labelProps, htmlFor: labelProps?.htmlFor ?? controlId, children: label }));
    return (_jsxs(XStack, { gap: "$2", style: { alignItems: "center" }, children: [checkbox, labelElement] }));
}
function CheckboxIndicator(props) {
    const { children, ...indicatorProps } = props;
    return (_jsx(TamaguiCheckbox.Indicator, { ...indicatorProps, children: children ?? _jsx(Check, {}) }));
}
export const Checkbox = Object.assign(CheckboxRoot, {
    Indicator: CheckboxIndicator,
});
