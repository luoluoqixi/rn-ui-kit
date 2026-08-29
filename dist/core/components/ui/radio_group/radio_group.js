import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics, useUiTheme, } from "../utils";
import { resolveRenderProp } from "../utils/render";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import * as React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
const radioSizes = {
    default: { indicator: "size-[18px]", dot: "size-2.5", label: "text-base" },
    "2xs": { indicator: "size-3", dot: "size-1.5", label: "text-xs" },
    "xs": { indicator: "size-3.5", dot: "size-2", label: "text-xs" },
    "sm": { indicator: "size-4", dot: "size-2", label: "text-sm" },
    "md": { indicator: "size-[18px]", dot: "size-2.5", label: "text-base" },
    "lg": { indicator: "size-5", dot: "size-3", label: "text-base" },
    "xl": { indicator: "size-6", dot: "size-3.5", label: "text-lg" },
    "2xl": { indicator: "size-7", dot: "size-4", label: "text-xl" },
};
const RadioGroupHapticsContext = React.createContext(undefined);
const RadioGroupInteractionContext = React.createContext(null);
function RadioGroup({ className, nativeHaptics, children, defaultValue, items, itemProps, labelPosition, onValueChange, size = "default", value, disabled = false, ...props }) {
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
                itemProps?.labelPosition, size: item.size ?? item.itemProps?.size ?? itemProps?.size ?? size, value: item.value })));
    return (_jsx(RadioGroupHapticsContext.Provider, { value: resolvedNativeHaptics, children: _jsx(RadioGroupInteractionContext.Provider, { value: {
                disabled,
                onValueChange: handleValueChange,
                value: resolvedValue,
                size,
            }, children: _jsx(RadioGroupPrimitive.Root, { ...props, className: cn("gap-3", className), disabled: disabled, onValueChange: handleValueChange, value: resolvedValue, children: generatedChildren }) }) }));
}
function RadioGroupItem({ className, description, descriptionClassName, indicatorClassName, indicatorProps, label, labelClassName, labelPosition = "right", nativeHaptics, containerClassName, onPress, onPressIn, onPressOut, value, size, disabled, ...props }) {
    const groupNativeHaptics = React.useContext(RadioGroupHapticsContext);
    const interaction = React.useContext(RadioGroupInteractionContext);
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics ?? groupNativeHaptics);
    const theme = useUiTheme();
    const hasContainer = label != null || description != null;
    const checked = interaction?.value === value;
    const resolvedDisabled = disabled || interaction?.disabled;
    const [isPressed, setIsPressed] = React.useState(false);
    const resolvedItemStyle = typeof props.style === "function" ? props.style({ pressed: isPressed }) : props.style;
    const pressedItemStyle = isPressed && !checked && !resolvedDisabled ? { backgroundColor: theme.accent } : undefined;
    const itemStyle = StyleSheet.flatten([resolvedItemStyle, pressedItemStyle]);
    const renderContext = {
        checked: checked === true,
        disabled: resolvedDisabled,
        value,
    };
    const renderedLabel = resolveRenderProp(label, renderContext);
    const renderedDescription = resolveRenderProp(description, renderContext);
    const resolvedSize = size ?? interaction?.size ?? "default";
    const sizeStyles = radioSizes[resolvedSize];
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
            }, children: [_jsx(RadioGroupPrimitive.Item, { ...props, "aria-label": props["aria-label"], className: cn("border-input dark:bg-input/30 aspect-square shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5", sizeStyles.indicator, Platform.select({
                        web: !checked && "group-hover:bg-accent/50 group-active:bg-accent/50",
                        native: "overflow-hidden",
                    }), renderedDescription != null && "mt-0.5", checked && "border-primary", resolvedDisabled && "opacity-50", className), style: itemStyle, disabled: resolvedDisabled, pointerEvents: "none", accessible: false, value: value, onPress: () => undefined, children: _jsx(RadioGroupPrimitive.Indicator, { ...indicatorProps, className: cn(cn("bg-primary rounded-full", sizeStyles.dot), indicatorClassName, indicatorProps?.className) }) }), _jsxs(View, { className: "min-w-0 justify-center gap-1", children: [normalizeText(renderedLabel, cn(sizeStyles.label, "font-medium", Platform.select({ web: "leading-none" }), labelClassName)), normalizeText(renderedDescription, cn(sizeStyles.label, "text-muted-foreground", descriptionClassName))] })] }));
    }
    return (_jsx(RadioGroupPrimitive.Item, { ...props, className: cn("border-input dark:bg-input/30 aspect-square shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5", sizeStyles.indicator, Platform.select({
            web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed",
        }), !checked &&
            Platform.select({
                native: "active:bg-accent/50",
                web: "hover:bg-accent/50 active:bg-accent/50",
            }), resolvedDisabled && "opacity-50", className), style: itemStyle, disabled: resolvedDisabled, onPress: (event) => {
            onPress?.(event);
            if (!event.defaultPrevented)
                triggerNativeHaptics(resolvedNativeHaptics);
        }, onPressIn: (event) => {
            setIsPressed(true);
            onPressIn?.(event);
        }, onPressOut: (event) => {
            setIsPressed(false);
            onPressOut?.(event);
        }, value: value, children: _jsx(RadioGroupPrimitive.Indicator, { ...indicatorProps, className: cn(cn("bg-primary rounded-full", sizeStyles.dot), indicatorClassName, indicatorProps?.className) }) }));
}
const RadioGroupComponent = Object.assign(RadioGroup, {
    Item: RadioGroupItem,
    Root: RadioGroup,
});
export { RadioGroupComponent as RadioGroup };
