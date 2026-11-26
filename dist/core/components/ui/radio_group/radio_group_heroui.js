import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RadioGroup } from "@heroui/react/radio-group";
import { Radio } from "@heroui/react/radio";
import { Label } from "../label";
import { Text } from "../text";
import { FieldMessages } from "../utils/field_parts";
import { useFieldValue } from "../utils/field_state";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
export function RadioGroupHeroUI({ items, itemProps, value, defaultValue, onValueChange, isDisabled = false, isInvalid = false, isRequired, variant, orientation = "vertical", labelPosition = "right", name, accessibilityLabel, nativeHaptics: _, label, labelProps, labelClassName, className, herouiWebProps, herouiNativeProps: _native, ...messages }) {
    const [selected, setSelected] = useFieldValue(value, defaultValue ?? "", onValueChange);
    return (_jsxs(RadioGroup, { ...herouiWebProps, name: name, value: selected, onChange: (next) => {
            if (!isDisabled &&
                !(items.find((item) => item.value === next)?.isDisabled ??
                    itemProps?.isDisabled))
                setSelected(next);
        }, isDisabled: isDisabled, isInvalid: isInvalid, isRequired: isRequired, variant: variant, orientation: orientation, "aria-label": accessibilityLabel, className: className, children: [label != null && (_jsx(Label, { ...labelProps, className: cn(labelProps?.className, labelClassName), isRequired: isRequired, isInvalid: isInvalid, isDisabled: isDisabled, children: label })), _jsx("div", { className: cn("flex gap-3", orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col"), children: items.map((data) => {
                    const item = { ...itemProps, ...data };
                    const context = {
                        value: item.value,
                        isSelected: selected === item.value,
                        isDisabled: isDisabled || !!item.isDisabled,
                        isInvalid,
                    };
                    return (_createElement(Radio, { ...item.herouiWebProps, key: item.value, value: item.value, isDisabled: context.isDisabled, className: cn((item.labelPosition ?? labelPosition) === "left" && "w-full [&>[data-slot=description]]:ps-0", item.className) },
                        _jsxs(Radio.Content, { "aria-label": item.accessibilityLabel, className: cn((item.labelPosition ?? labelPosition) === "left" &&
                                "w-full flex-row-reverse justify-between"), children: [_jsx(Radio.Control, { ...item.indicatorProps?.herouiWebProps, className: item.indicatorProps?.className, children: _jsx(Radio.Indicator, { children: item.indicator == null
                                            ? undefined
                                            : resolveRenderProp(item.indicator, context) }) }), _jsx("span", { className: "flex min-w-0 flex-col gap-1", children: _jsx(Text, { className: item.labelClassName, children: resolveRenderProp(item.label, context) }) })] }),
                        _jsx(FieldMessages, { description: resolveRenderProp(item.description, context), descriptionClassName: item.descriptionClassName })));
                }) }), _jsx(FieldMessages, { ...messages, isInvalid: isInvalid })] }));
}
