import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NativeTrigger } from "../native_trigger";
import { NATIVE_TRIGGER_LABEL_OPACITY } from "../native_trigger";
import { Button } from "../button";
import { Icon } from "../icon";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { SELECT_TRIGGER_FONT_WEIGHT } from "./constants";
import { useResolvedNativeHaptics } from "../utils";
import { resolveRenderProp } from "../utils/render";
import { useUiTheme } from "../utils/theme";
import * as React from "react";
import { Platform, View } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { SELECT_TRIGGER_DISABLE_OPACITY, SELECT_TRIGGER_PRESS_OPACITY, SELECT_TRIGGER_WEB_HOVER_OPACITY, SELECT_TRIGGER_WEB_PRESS_OPACITY, } from "../native_trigger";
export const SELECT_TRIGGER_SWATCH_SIZE = 14;
const selectTriggerFontSizes = {
    "2xs": 12,
    "xs": 12,
    "sm": 14,
    "md": 16,
    "default": 16,
    "lg": 16,
    "xl": 18,
    "2xl": 20,
};
export { SELECT_TRIGGER_DISABLE_OPACITY, SELECT_TRIGGER_PRESS_OPACITY, SELECT_TRIGGER_WEB_HOVER_OPACITY, SELECT_TRIGGER_WEB_PRESS_OPACITY, };
export function flattenItems(props) {
    return props.itemGroups?.flatMap((group) => group.items) ?? props.items ?? props.options ?? [];
}
export function itemLabel(item, value) {
    if (!item)
        return value ?? "";
    const rendered = resolveRenderProp(item.label, {
        checked: item.value === value,
        disabled: !!(item.disabled ?? item.isDisabled),
        selected: item.value === value,
        value: item.value,
    });
    return typeof rendered === "string" || typeof rendered === "number"
        ? String(rendered)
        : item.value;
}
export function renderSelectText(value, textProps, defaultColor, defaultOpacity = NATIVE_TRIGGER_LABEL_OPACITY, defaultFontSize = 16, defaultFontWeight) {
    if (typeof value !== "string" && typeof value !== "number")
        return value;
    const { color, opacity, style, ...restTextProps } = (textProps ?? {});
    return (_jsx(Text, { ...restTextProps, style: [
            {
                color: color ?? defaultColor,
                fontSize: defaultFontSize,
                ...(defaultFontWeight == null ? {} : { fontWeight: defaultFontWeight }),
                opacity: opacity ?? defaultOpacity,
            },
            style,
        ], children: value }));
}
export function getSelectTriggerFontSize(props) {
    const size = props.triggerSize ?? props.triggerProps?.size ?? props.nativeTriggerProps?.size;
    return selectTriggerFontSizes[size == null ? "default" : String(size)] ?? 16;
}
export function SelectedLabel({ defaultFontSize, defaultOpacity, defaultFontWeight, labelProps, props, value, }) {
    const theme = useUiTheme();
    const item = flattenItems(props).find((entry) => entry.value === value);
    const rendered = resolveRenderProp(props.renderValue, { value, item });
    const label = rendered != null
        ? rendered
        : (props.nativeTriggerLabel ?? (itemLabel(item, value) || props.placeholder || "选择"));
    const text = renderSelectText(label, labelProps, theme.foreground, defaultOpacity, defaultFontSize, defaultFontWeight);
    if (item?.swatchColor == null)
        return text;
    return (_jsxs(View, { style: { alignItems: "center", flexDirection: "row", gap: 8 }, children: [_jsx(View, { accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants", style: {
                    backgroundColor: item.swatchColor,
                    borderRadius: SELECT_TRIGGER_SWATCH_SIZE / 2,
                    height: SELECT_TRIGGER_SWATCH_SIZE,
                    width: SELECT_TRIGGER_SWATCH_SIZE,
                } }), text] }));
}
export const SelectNativeTrigger = React.forwardRef(function SelectNativeTrigger({ active = false, label: labelProp, onPress, props, value, ...triggerProps }, ref) {
    const label = labelProp ?? props.nativeTriggerLabel ?? (_jsx(SelectedLabel, { defaultFontSize: getSelectTriggerFontSize(props), defaultFontWeight: props.triggerFontWeight ?? SELECT_TRIGGER_FONT_WEIGHT, labelProps: props.nativeTriggerLabelProps, props: props, value: value }));
    const hasFullWidthClass = props.className?.split(/\s+/).includes("w-full") === true;
    const hoverBackground = props.nativeTriggerHoverBackground !== false;
    const hoverOpacity = props.nativeTriggerHoverOpacity ?? props.nativeTriggerHoverBackground === false;
    const triggerClassName = props.className
        ?.split(/\s+/)
        .filter((name) => name !== "w-full")
        .join(" ");
    return (_jsx(NativeTrigger, { ...props.nativeTriggerProps, ...triggerProps, active: active, className: cn(Platform.OS === "web" && "transition-opacity", Platform.OS === "web" &&
            hoverBackground &&
            cn("rounded-md hover:bg-accent hover:text-accent-foreground disabled:hover:bg-transparent disabled:hover:text-foreground", active && "bg-accent text-accent-foreground"), props.nativeTriggerProps?.className, triggerProps.className, triggerClassName), containerStyle: props.nativeTriggerContainerStyle, content: props.nativeTriggerContent, disabled: props.disabled ?? props.isDisabled, feedbackOpacity: {
            disabled: SELECT_TRIGGER_DISABLE_OPACITY,
            press: SELECT_TRIGGER_PRESS_OPACITY,
            webHover: hoverOpacity ? SELECT_TRIGGER_WEB_HOVER_OPACITY : 1,
            webPress: SELECT_TRIGGER_WEB_PRESS_OPACITY,
            ...props.nativeTriggerFeedbackOpacity,
        }, icon: props.nativeTriggerIcon, fontWeight: props.triggerFontWeight ?? SELECT_TRIGGER_FONT_WEIGHT, keepPressedOpacity: props.nativeTriggerProps?.keepPressedOpacity ?? Platform.OS === "web", label: label, labelProps: props.nativeTriggerLabelProps, size: props.triggerSize ?? props.nativeTriggerProps?.size ?? "default", onPress: onPress ?? props.nativeTriggerProps?.onPress ?? triggerProps.onPress, pressedOpacity: props.nativeTriggerProps?.pressedOpacity ?? true, ref: ref, style: (state) => [
            {
                alignItems: "center",
                alignSelf: hasFullWidthClass ? "stretch" : "flex-start",
                width: hasFullWidthClass ? "100%" : undefined,
            },
            typeof props.nativeTriggerProps?.style === "function"
                ? props.nativeTriggerProps.style(state)
                : props.nativeTriggerProps?.style,
            typeof triggerProps.style === "function" ? triggerProps.style(state) : triggerProps.style,
        ] }));
});
/** The non-native trigger used by picker branches when `nativeTrigger` is false. */
export const SelectBasicTrigger = React.forwardRef(function SelectBasicTrigger({ disabled, label, props, value, onPress, ...triggerProps }, ref) {
    const configuredTriggerProps = props.triggerProps;
    const resolvedDisabled = disabled ??
        props.disabled ??
        props.isDisabled ??
        triggerProps.disabled ??
        configuredTriggerProps?.disabled;
    const hasFullWidthClass = props.className?.split(/\s+/).includes("w-full") === true;
    const userClassName = cn(props.className, configuredTriggerProps?.className, triggerProps.className);
    const hasCursorOverride = userClassName.split(/\s+/).some((token) => token.startsWith("cursor-"));
    return (_jsxs(Button, { ...configuredTriggerProps, ...triggerProps, ref: ref, className: cn("self-start w-auto justify-between", Platform.OS === "web" && "cursor-default", props.className, configuredTriggerProps?.className, triggerProps.className), disabled: resolvedDisabled ?? configuredTriggerProps?.disabled, onPress: onPress ?? triggerProps.onPress ?? configuredTriggerProps?.onPress, style: (state) => [
            {
                alignSelf: hasFullWidthClass ? "stretch" : "flex-start",
                flexGrow: 0,
                flexShrink: 0,
                width: hasFullWidthClass ? "100%" : "auto",
                ...(Platform.OS === "web" && !hasCursorOverride ? { cursor: "default" } : {}),
            },
            props.nativeTriggerContainerStyle,
            typeof configuredTriggerProps?.style === "function"
                ? configuredTriggerProps.style(state)
                : configuredTriggerProps?.style,
            typeof triggerProps.style === "function" ? triggerProps.style(state) : triggerProps.style,
        ], variant: triggerProps.variant ?? configuredTriggerProps?.variant ?? "outline", size: props.triggerSize ?? triggerProps.size ?? configuredTriggerProps?.size ?? "default", children: [label ?? (_jsx(SelectedLabel, { defaultFontSize: getSelectTriggerFontSize(props), defaultFontWeight: props.triggerFontWeight ?? SELECT_TRIGGER_FONT_WEIGHT, defaultOpacity: 1, props: props, value: value })), _jsx(Icon, { "aria-hidden": true, as: ChevronDown, className: "text-muted-foreground size-4 shrink-0" })] }));
});
export function useSelectState(props) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(props.defaultValue);
    const value = props.value ?? uncontrolledValue;
    const setValue = React.useCallback((next) => {
        if (props.value == null)
            setUncontrolledValue(next);
        props.onValueChange?.(next);
    }, [props.onValueChange, props.value]);
    return { value, setValue };
}
export function triggerSelectHaptics(props) {
    return useResolvedNativeHaptics(props.nativeHaptics);
}
export function renderNativeItemLabel(item, selectedValue) {
    const rendered = resolveRenderProp(item.label, {
        checked: item.value === selectedValue,
        disabled: !!(item.disabled ?? item.isDisabled),
        selected: item.value === selectedValue,
        value: item.value,
    });
    return typeof rendered === "string" || typeof rendered === "number" ? (_jsx(Text, { children: rendered })) : (rendered);
}
