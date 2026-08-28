import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from "../icon";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { resolveRenderProp } from "../utils/render";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { Check } from "lucide-react-native";
import * as React from "react";
import { Platform, Pressable, View } from "react-native";
const DEFAULT_HIT_SLOP = 24;
function Checkbox({ className, checkedClassName, indicatorClassName, indicatorProps, iconClassName, iconProps, nativeHaptics, label, description, labelPosition = "right", card = false, containerClassName, labelClassName, descriptionClassName, onCheckedChange, onPress, checked, onPressIn, onPressOut, ...props }) {
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    const hasContainer = label != null || description != null || card;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const resolvedChecked = checked ?? uncontrolledChecked;
    const renderContext = {
        card,
        checked: resolvedChecked,
        disabled: props.disabled,
    };
    const renderedLabel = resolveRenderProp(label, renderContext);
    const renderedDescription = resolveRenderProp(description, renderContext);
    const handleCheckedChange = (nextChecked) => {
        if (checked === undefined) {
            setUncontrolledChecked(nextChecked);
        }
        triggerNativeHaptics(resolvedNativeHaptics);
        onCheckedChange?.(nextChecked);
    };
    const normalizeCheckboxChildren = (value, className) => React.Children.map(value, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { className: className, children: child })) : (child));
    if (hasContainer) {
        const toggle = (event) => {
            onPress?.(event);
            if (event.defaultPrevented || props.disabled)
                return;
            handleCheckedChange(resolvedChecked === true ? false : true);
        };
        const labelContent = normalizeCheckboxChildren(renderedLabel, cn("text-sm font-medium", Platform.select({ web: "leading-none" }), labelClassName));
        const descriptionContent = normalizeCheckboxChildren(renderedDescription, cn("text-muted-foreground text-sm", descriptionClassName));
        return (_jsxs(Pressable, { className: cn("group flex-row gap-3", card
                ? "items-center"
                : renderedDescription != null
                    ? "items-start self-start"
                    : "items-center self-start", labelPosition === "left" && "flex-row-reverse", card && "rounded-lg border border-border p-3", card && resolvedChecked === true && "border-primary bg-primary/10", props.disabled && "opacity-50", containerClassName), disabled: props.disabled, onPress: toggle, onPressIn: (event) => {
                setIsPressed(true);
                onPressIn?.(event);
            }, onPressOut: (event) => {
                setIsPressed(false);
                onPressOut?.(event);
            }, accessibilityRole: "checkbox", accessibilityState: {
                checked: resolvedChecked,
                disabled: props.disabled,
            }, children: [_jsx(CheckboxPrimitive.Root, { ...props, checked: resolvedChecked, className: cn("border-input dark:bg-input/30 size-4 shrink-0 rounded-[4px] border shadow-sm shadow-black/5", isPressed && "opacity-70", Platform.select({
                        web: "group-hover:opacity-80 group-active:opacity-70",
                        native: "overflow-hidden",
                    }), renderedDescription != null && !card && "mt-0.5", resolvedChecked === true && cn("border-primary", checkedClassName), props.disabled && "opacity-50", className), style: isPressed && !props.disabled ? { opacity: 0.7 } : props.style, pointerEvents: "none", accessible: false, onCheckedChange: () => undefined, children: _jsx(CheckboxPrimitive.Indicator, { ...indicatorProps, className: cn("bg-primary h-full w-full items-center justify-center", indicatorClassName, indicatorProps?.className), children: _jsx(Icon, { as: Check, ...iconProps, size: iconProps?.size ?? 12, strokeWidth: iconProps?.strokeWidth ?? (Platform.OS === "web" ? 2.5 : 3.5), className: cn("text-primary-foreground", iconClassName, iconProps?.className) }) }) }), _jsxs(View, { className: cn("min-w-0 justify-center gap-2", card && "flex-1"), children: [labelContent, descriptionContent] })] }));
    }
    return (_jsx(CheckboxPrimitive.Root, { className: cn("border-input dark:bg-input/30 size-4 shrink-0 rounded-[4px] border shadow-sm shadow-black/5", Platform.select({
            web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer cursor-default outline-none transition-shadow focus-visible:ring-[3px] disabled:cursor-not-allowed hover:opacity-80 active:opacity-70",
            native: "overflow-hidden",
        }), isPressed && "opacity-70", checked && cn("border-primary", checkedClassName), props.disabled && "opacity-50", className), style: isPressed && !props.disabled ? { opacity: 0.7 } : props.style, hitSlop: DEFAULT_HIT_SLOP, checked: checked ?? false, onPress: onPress, onPressIn: (event) => {
            setIsPressed(true);
            onPressIn?.(event);
        }, onPressOut: (event) => {
            setIsPressed(false);
            onPressOut?.(event);
        }, onCheckedChange: (nextChecked) => {
            triggerNativeHaptics(resolvedNativeHaptics);
            onCheckedChange?.(nextChecked);
        }, ...props, children: _jsx(CheckboxPrimitive.Indicator, { ...indicatorProps, className: cn("bg-primary h-full w-full items-center justify-center", indicatorClassName, indicatorProps?.className), children: _jsx(Icon, { as: Check, ...iconProps, size: iconProps?.size ?? 12, strokeWidth: iconProps?.strokeWidth ?? (Platform.OS === "web" ? 2.5 : 3.5), className: cn("text-primary-foreground", iconClassName, iconProps?.className) }) }) }));
}
export { Checkbox };
