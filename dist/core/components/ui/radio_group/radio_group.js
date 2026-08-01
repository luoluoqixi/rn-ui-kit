import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState } from "react";
import { Label as TamaguiLabel, RadioGroup as TamaguiRadioGroup, XStack, YStack } from "tamagui";
import { os } from "../utils/platform";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
function RadioGroupRoot(props) {
    const generatedGroupId = useId();
    const { children, defaultValue, indicatorProps, itemProps, items, labelProps, nativeHaptics, onValueChange, value: valueProp, ...rootProps } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { htmlFor: _labelHtmlFor, ...resolvedLabelProps } = labelProps ?? {};
    const groupId = rootProps.id ?? generatedGroupId;
    const shouldHandleLabelPress = os() === "ios";
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
    const value = valueProp ?? uncontrolledValue;
    const handleValueChange = (nextValue) => {
        if (valueProp === undefined) {
            setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
        triggerNativeHaptics(resolvedNativeHaptics);
    };
    return (_jsx(TamaguiRadioGroup, { ...rootProps, onValueChange: handleValueChange, value: value, children: children ??
            (items == null ? null : (_jsx(YStack, { gap: "$2", children: items.map((item, index) => {
                    const itemId = item.id ?? itemProps?.id ?? `${groupId}-item-${index}`;
                    const isDisabled = item.disabled ?? itemProps?.disabled ?? rootProps.disabled;
                    const labelElement = shouldHandleLabelPress ? (_jsx(XStack, { onPress: (event) => {
                            labelProps?.onPress?.(event);
                            if (isDisabled || event.defaultPrevented) {
                                return;
                            }
                            handleValueChange(item.value);
                        }, children: _jsx(TamaguiLabel, { ...resolvedLabelProps, pointerEvents: "none", children: item.label }) })) : (_jsx(TamaguiLabel, { ...resolvedLabelProps, htmlFor: itemId, children: item.label }));
                    return (_jsxs(XStack, { gap: "$2", style: { alignItems: "center" }, children: [_jsx(RadioGroupItem, { ...itemProps, "aria-label": resolveAriaLabel(item["aria-label"] ?? itemProps?.["aria-label"], item.label), disabled: isDisabled, id: itemId, value: item.value, children: _jsx(RadioGroupIndicator, { ...indicatorProps }) }), labelElement] }, item.value));
                }) }))) }));
}
function RadioGroupItem(props) {
    return _jsx(TamaguiRadioGroup.Item, { ...props });
}
function RadioGroupIndicator(props) {
    return (_jsx(TamaguiRadioGroup.Indicator, { ...props, unstyled: props.unstyled ?? true, width: props.width ?? "33%", height: props.height ?? "33%", borderRadius: props.borderRadius ?? 999, backgroundColor: props.backgroundColor ?? "$color" }));
}
export const RadioGroup = Object.assign(RadioGroupRoot, {
    Item: RadioGroupItem,
    Indicator: RadioGroupIndicator,
});
