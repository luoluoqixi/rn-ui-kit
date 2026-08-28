import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
import { resolveRenderProp } from "../utils/render";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import * as React from "react";
import { Platform, Pressable, View } from "react-native";
const RadioGroupHapticsContext = React.createContext(undefined);
const RadioGroupInteractionContext = React.createContext(null);
function RadioGroup({ className, nativeHaptics, children, defaultValue, items, itemProps, labelPosition, onValueChange, value, disabled = false, ...props }) {
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const resolvedValue = value ?? uncontrolledValue;
    const handleValueChange = (nextValue) => {
        if (value === undefined)
            setUncontrolledValue(nextValue);
        onValueChange?.(nextValue);
    };
    const generatedChildren = children ??
        items?.map((item) => (_createElement(RadioGroupItem, { ...itemProps, ...item.itemProps, "aria-label": item["aria-label"] ?? itemProps?.["aria-label"], description: item.description, descriptionClassName: item.descriptionClassName ??
                item.itemProps?.descriptionClassName ??
                itemProps?.descriptionClassName, disabled: item.disabled ?? item.itemProps?.disabled ?? itemProps?.disabled, key: item.value, label: item.label, labelClassName: item.labelClassName ?? item.itemProps?.labelClassName ?? itemProps?.labelClassName, labelPosition: item.labelPosition ??
                item.itemProps?.labelPosition ??
                labelPosition ??
                itemProps?.labelPosition, value: item.value })));
    return (_jsx(RadioGroupHapticsContext.Provider, { value: resolvedNativeHaptics, children: _jsx(RadioGroupInteractionContext.Provider, { value: {
                disabled,
                onValueChange: handleValueChange,
                value: resolvedValue,
            }, children: _jsx(RadioGroupPrimitive.Root, { ...props, className: cn("gap-3", className), disabled: disabled, onValueChange: handleValueChange, value: resolvedValue, children: generatedChildren }) }) }));
}
function RadioGroupItem({ className, description, descriptionClassName, indicatorClassName, indicatorProps, label, labelClassName, labelPosition = "right", nativeHaptics, containerClassName, onPress, onPressIn, onPressOut, value, disabled, ...props }) {
    const groupNativeHaptics = React.useContext(RadioGroupHapticsContext);
    const interaction = React.useContext(RadioGroupInteractionContext);
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics ?? groupNativeHaptics);
    const hasContainer = label != null || description != null;
    const checked = interaction?.value === value;
    const resolvedDisabled = disabled || interaction?.disabled;
    const [isPressed, setIsPressed] = React.useState(false);
    const renderContext = {
        checked: checked === true,
        disabled: resolvedDisabled,
        value,
    };
    const renderedLabel = resolveRenderProp(label, renderContext);
    const renderedDescription = resolveRenderProp(description, renderContext);
    const normalizeText = (valueToNormalize, classNameToUse) => React.Children.map(valueToNormalize, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { className: classNameToUse, children: child })) : (child));
    if (hasContainer) {
        const handleContainerPress = (event) => {
            onPress?.(event);
            if (event.defaultPrevented || resolvedDisabled || interaction == null) {
                return;
            }
            interaction.onValueChange(value);
            triggerNativeHaptics(resolvedNativeHaptics);
        };
        return (_jsxs(Pressable, { accessibilityRole: "radio", accessibilityState: {
                checked: checked === true,
                disabled: resolvedDisabled,
            }, className: cn("group flex-row gap-3", renderedDescription != null ? "items-start self-start" : "items-center self-start", labelPosition === "left" && "flex-row-reverse", resolvedDisabled && "opacity-50", containerClassName), disabled: resolvedDisabled, onPress: handleContainerPress, onPressIn: (event) => {
                setIsPressed(true);
                onPressIn?.(event);
            }, onPressOut: (event) => {
                setIsPressed(false);
                onPressOut?.(event);
            }, children: [_jsx(RadioGroupPrimitive.Item, { ...props, "aria-label": props["aria-label"], className: cn("border-input dark:bg-input/30 aspect-square size-4 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5", isPressed && "opacity-70", Platform.select({
                        web: "group-hover:opacity-80 group-active:opacity-70",
                        native: "overflow-hidden",
                    }), renderedDescription != null && "mt-0.5", checked && "border-primary", resolvedDisabled && "opacity-50", className), style: isPressed && !resolvedDisabled ? { opacity: 0.7 } : props.style, disabled: resolvedDisabled, pointerEvents: "none", accessible: false, value: value, onPress: () => undefined, children: _jsx(RadioGroupPrimitive.Indicator, { ...indicatorProps, className: cn("bg-primary size-2 rounded-full", indicatorClassName, indicatorProps?.className) }) }), _jsxs(View, { className: "min-w-0 justify-center gap-1", children: [normalizeText(renderedLabel, cn("text-sm font-medium", Platform.select({ web: "leading-none" }), labelClassName)), normalizeText(renderedDescription, cn("text-muted-foreground text-sm", descriptionClassName))] })] }));
    }
    return (_jsx(RadioGroupPrimitive.Item, { ...props, className: cn("border-input dark:bg-input/30 aspect-square size-4 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5", Platform.select({
            web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed hover:opacity-80 active:opacity-70",
        }), isPressed && "opacity-70", resolvedDisabled && "opacity-50", className), style: isPressed && !resolvedDisabled ? { opacity: 0.7 } : props.style, disabled: resolvedDisabled, onPress: (event) => {
            onPress?.(event);
            if (!event.defaultPrevented)
                triggerNativeHaptics(resolvedNativeHaptics);
        }, onPressIn: (event) => {
            setIsPressed(true);
            onPressIn?.(event);
        }, onPressOut: (event) => {
            setIsPressed(false);
            onPressOut?.(event);
        }, value: value, children: _jsx(RadioGroupPrimitive.Indicator, { ...indicatorProps, className: cn("bg-primary size-2 rounded-full", indicatorClassName, indicatorProps?.className) }) }));
}
const RadioGroupComponent = Object.assign(RadioGroup, {
    Item: RadioGroupItem,
    Root: RadioGroup,
});
export { RadioGroupComponent as RadioGroup };
