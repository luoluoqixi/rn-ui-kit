import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Platform, View } from "react-native";
import { Button } from "../button";
import { DROPDOWN_TRIGGER_DISABLE_OPACITY, DROPDOWN_TRIGGER_PRESS_OPACITY, DROPDOWN_TRIGGER_WEB_HOVER_OPACITY, DROPDOWN_TRIGGER_WEB_PRESS_OPACITY, NativeTrigger, } from "../native_trigger";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
export const DropdownNativeTrigger = React.forwardRef(function DropdownNativeTrigger({ className, containerStyle, content, disabled, icon, keepPressedOpacity = Platform.OS === "web", label, labelProps, nativeTriggerFeedbackOpacity, nativeTriggerHoverBackground = true, nativeTriggerProps, open, pressedOpacity = true, style, trigger, ...props }, ref) {
    const hasFullWidthClass = className?.split(/\s+/).includes("w-full") === true;
    return (_jsx(NativeTrigger, { ...props, ...nativeTriggerProps, active: open, className: cn(Platform.OS === "web" && "transition-opacity", Platform.OS === "web" &&
            nativeTriggerHoverBackground &&
            cn("rounded-md hover:bg-accent hover:text-accent-foreground disabled:hover:bg-transparent disabled:hover:text-foreground", open && "bg-accent text-accent-foreground"), nativeTriggerProps?.className, className), containerStyle: containerStyle, content: content, disabled: disabled ?? undefined, feedbackOpacity: {
            disabled: DROPDOWN_TRIGGER_DISABLE_OPACITY,
            press: DROPDOWN_TRIGGER_PRESS_OPACITY,
            webHover: DROPDOWN_TRIGGER_WEB_HOVER_OPACITY,
            webPress: DROPDOWN_TRIGGER_WEB_PRESS_OPACITY,
            ...nativeTriggerFeedbackOpacity,
        }, icon: icon, keepPressedOpacity: keepPressedOpacity, label: resolveRenderProp(label, { native: true, open }) ??
            resolveRenderProp(trigger, { native: true, open }) ??
            "", labelProps: labelProps, pressedOpacity: pressedOpacity, ref: ref, style: (state) => [
            {
                alignItems: "center",
                alignSelf: hasFullWidthClass ? "stretch" : "flex-start",
                width: hasFullWidthClass ? "100%" : undefined,
            },
            typeof style === "function" ? style(state) : style,
            typeof nativeTriggerProps?.style === "function"
                ? nativeTriggerProps.style(state)
                : nativeTriggerProps?.style,
        ] }));
});
export const DropdownDefaultTrigger = React.forwardRef(function DropdownDefaultTrigger({ className, disabled, label, props, ...buttonProps }, ref) {
    const userClassName = cn(props?.className, className);
    const hasCursorOverride = userClassName.split(/\s+/).some((token) => token.startsWith("cursor-"));
    const resolvedButtonStyle = buttonProps.style ?? props?.style;
    return (_jsx(Button, { variant: "outline", ...props, ...buttonProps, className: cn("self-start", Platform.OS === "web" && "cursor-default", props?.className, className), disabled: disabled ?? props?.disabled, ref: ref, style: (state) => [
            typeof resolvedButtonStyle === "function"
                ? resolvedButtonStyle(state)
                : resolvedButtonStyle,
            hasCursorOverride ? undefined : { cursor: "default" },
        ], children: label ?? "" }));
});
export function resolveDropdownTrigger(trigger, context, disabled) {
    const element = resolveRenderProp(trigger, context);
    if (!React.isValidElement(element))
        return element;
    const triggerElement = element;
    return React.cloneElement(triggerElement, {
        disabled: disabled ?? triggerElement.props.disabled,
    });
}
export function DropdownDisabledTrigger({ children }) {
    return _jsx(View, { pointerEvents: "none", children: children });
}
