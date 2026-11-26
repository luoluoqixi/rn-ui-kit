import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox } from "@heroui/react/checkbox";
import { Text } from "../text";
import { FieldMessages } from "../utils/field_parts";
import { useFieldValue } from "../utils/field_state";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
export function CheckboxHeroUI({ isSelected, defaultSelected = false, onSelectedChange, isDisabled = false, isInvalid = false, isRequired, variant, name, value, accessibilityLabel, label, description, labelClassName, labelPosition = "right", controlProps, indicatorProps, indicator, className, herouiWebProps, herouiNativeProps: _, nativeHaptics: _haptics, labelProps, ...messages }) {
    const [selected, setSelected] = useFieldValue(isSelected, defaultSelected, onSelectedChange);
    const context = { isSelected: selected, isDisabled, isInvalid };
    const control = (_jsx(Checkbox.Control, { ...controlProps?.herouiWebProps, className: controlProps?.className, children: _jsx(Checkbox.Indicator, { ...indicatorProps?.herouiWebProps, className: indicatorProps?.className, children: indicator == null ? undefined : resolveRenderProp(indicator, context) }) }));
    return (_jsxs(Checkbox, { ...herouiWebProps, name: name, value: value, isSelected: selected, onChange: (next) => {
            if (!isDisabled)
                setSelected(next);
        }, isDisabled: isDisabled, isInvalid: isInvalid, isRequired: isRequired, variant: variant, className: className, children: [_jsxs(Checkbox.Content, { "aria-label": accessibilityLabel, className: cn(labelPosition === "left" && "flex-row-reverse justify-between"), children: [control, _jsx("span", { className: "flex min-w-0 flex-1 flex-col gap-1", children: label != null && (_jsx(Text, { ...labelProps, className: cn(labelProps?.className, labelClassName), children: resolveRenderProp(label, context) })) })] }), _jsx(FieldMessages, { ...messages, description: resolveRenderProp(description, context), isInvalid: isInvalid })] }));
}
