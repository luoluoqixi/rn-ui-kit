import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox } from "heroui-native/checkbox";
import { ControlField } from "heroui-native/control-field";
import { View } from "react-native";
import { Text } from "../text";
import { FieldMessages } from "../utils/field_parts";
import { useFieldValue } from "../utils/field_state";
import { triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils/haptics";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
export function CheckboxHeroUI({ isSelected, defaultSelected = false, onSelectedChange, isDisabled = false, isInvalid = false, isRequired, variant, accessibilityLabel, label, description, labelClassName, labelPosition = "right", controlProps, indicatorProps, indicator, className, herouiNativeProps, herouiWebProps: _, nativeHaptics, labelProps, name: _name, value: _value, ...messages }) {
    const [selected, setSelected] = useFieldValue(isSelected, defaultSelected, onSelectedChange);
    const haptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    const context = { isSelected: selected, isDisabled, isInvalid };
    return (_jsxs(ControlField, { ...herouiNativeProps, isSelected: selected, onSelectedChange: (next) => {
            if (!isDisabled) {
                setSelected(next);
                triggerNativeHaptics(haptics);
            }
        }, isDisabled: isDisabled, isInvalid: isInvalid, isRequired: isRequired, accessible: true, accessibilityRole: "checkbox", accessibilityLabel: accessibilityLabel ?? (typeof label === "string" ? label : undefined), accessibilityState: { checked: selected, disabled: isDisabled }, className: cn("flex-row items-center gap-3", labelPosition === "left" && "flex-row-reverse", className), children: [_jsx(ControlField.Indicator, { pointerEvents: "none", accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants", children: _jsx(Checkbox, { ...controlProps?.herouiNativeProps, variant: variant, className: controlProps?.className, children: indicator != null || indicatorProps ? (_jsx(Checkbox.Indicator, { ...indicatorProps?.herouiNativeProps, className: indicatorProps?.className, children: indicator == null
                            ? undefined
                            : resolveRenderProp(indicator, context) })) : undefined }) }), _jsxs(View, { className: "min-w-0 flex-1 gap-1", children: [label != null && (_jsx(Text, { ...labelProps, className: cn(labelProps?.className, labelClassName), children: resolveRenderProp(label, context) })), _jsx(FieldMessages, { ...messages, description: resolveRenderProp(description, context), isInvalid: isInvalid })] })] }));
}
