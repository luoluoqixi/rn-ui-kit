import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ChevronDown } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { NativeTrigger } from "../native_trigger";
import { cn } from "../utils/cn";
import { useUiTheme } from "../utils/theme";
import { flattenItems, itemLabel, SELECT_TRIGGER_DISABLE_OPACITY, SELECT_TRIGGER_PRESS_OPACITY, SELECT_TRIGGER_WEB_HOVER_OPACITY, SELECT_TRIGGER_WEB_PRESS_OPACITY, SelectedLabel, getSelectTriggerFontSize, useSelectState, } from "./shared";
import { SELECT_TRIGGER_FONT_WEIGHT } from "./constants";
const nativeSelectSizeClasses = {
    "2xs": "h-8 px-2 pr-8 py-1 text-xs",
    "xs": "h-9 px-3 pr-10 py-1.5 text-xs",
    "sm": "h-10 px-4 pr-10 py-2 text-sm",
    "md": "h-11 px-5 pr-12 py-2.5 text-base",
    "default": "h-11 px-5 pr-12 py-2.5 text-base",
    "lg": "h-12 px-6 pr-12 py-2.5 text-base",
    "xl": "h-14 px-8 pr-14 py-3 text-lg",
    "2xl": "h-16 px-10 pr-16 py-4 text-xl",
};
const nativeSelectChevronClasses = {
    "2xs": "right-2 size-3",
    "xs": "right-3 size-3.5",
    "sm": "right-3 size-4",
    "md": "right-4 size-4",
    "default": "right-4 size-4",
    "lg": "right-4 size-4",
    "xl": "right-5 size-5",
    "2xl": "right-6 size-6",
};
function resolveSelectSize(props) {
    return String(props.triggerSize ?? props.triggerProps?.size ?? "default");
}
/** Browser native select. Keyboard navigation and mobile browser pickers are retained. */
export const SelectNative = React.forwardRef(function SelectNative({ items, options, itemGroups, onOpenChange, ...props }, ref) {
    const selectProps = { ...props, itemGroups, items, onOpenChange, options };
    const theme = useUiTheme();
    const state = useSelectState(selectProps);
    const allItems = flattenItems(selectProps);
    const selectSize = resolveSelectSize(selectProps);
    const disabled = selectProps.disabled ?? selectProps.isDisabled;
    const { style: nativeSelectStyle, ...nativeSelectProps } = selectProps.nativeSelectProps ?? {};
    const flattenedNativeSelectStyle = StyleSheet.flatten(nativeSelectStyle);
    const nativeSelectRef = React.useRef(null);
    React.useImperativeHandle(ref, () => ({
        open: () => nativeSelectRef.current?.click?.(),
        close: () => nativeSelectRef.current?.blur?.(),
    }), []);
    const nativeSelect = (_jsxs("select", { ref: nativeSelectRef, ...nativeSelectProps, "aria-label": selectProps["aria-label"], disabled: disabled, onChange: (event) => state.setValue(event.target.value), style: flattenedNativeSelectStyle, value: state.value ?? "", children: [state.value == null && selectProps.placeholder != null ? (_jsx("option", { style: { backgroundColor: theme.background, color: theme.foreground }, value: "", children: typeof selectProps.placeholder === "string" ? selectProps.placeholder : "选择" })) : null, allItems.map((item) => (_jsx("option", { disabled: item.disabled ?? item.isDisabled, style: { backgroundColor: theme.background, color: theme.foreground }, value: item.value, children: itemLabel(item, state.value ?? undefined) }, item.value)))] }));
    if (props.nativeTrigger) {
        return (_jsx(NativeSelectTrigger, { disabled: disabled, nativeSelect: nativeSelect, props: selectProps, value: state.value ?? undefined, selectRef: nativeSelectRef, ref: ref }));
    }
    const hasFullWidthClass = props.className?.split(/\s+/).includes("w-full") === true;
    const hasCursorOverride = props.className
        ?.split(/\s+/)
        .some((token) => token.startsWith("cursor-"));
    return (_jsxs("div", { className: "group", style: {
            alignSelf: hasFullWidthClass ? "stretch" : "flex-start",
            display: hasFullWidthClass ? "flex" : "inline-flex",
            position: "relative",
            width: hasFullWidthClass ? "100%" : "auto",
        }, children: [React.cloneElement(nativeSelect, {
                className: cn("border-border bg-background text-foreground w-fit cursor-default appearance-none rounded-md border font-medium shadow-sm shadow-black/5 transition-colors hover:bg-accent hover:text-accent-foreground active:bg-accent dark:bg-input/30 dark:border-input dark:active:bg-input/50 dark:hover:bg-input/50 focus:border-ring focus:ring-ring/50 focus:outline-none focus:ring-[3px] disabled:opacity-50", nativeSelectSizeClasses[selectSize] ?? nativeSelectSizeClasses.default, props.nativeSelectProps?.className, props.className),
                style: {
                    WebkitAppearance: "none",
                    ...(hasCursorOverride ? {} : { cursor: "default" }),
                    fontWeight: props.triggerFontWeight ?? SELECT_TRIGGER_FONT_WEIGHT,
                    ...flattenedNativeSelectStyle,
                    ...StyleSheet.flatten(props.style),
                },
            }), _jsx(ChevronDown, { "aria-hidden": true, className: cn("text-muted-foreground pointer-events-none absolute top-1/2 -translate-y-1/2 group-hover:text-accent-foreground group-active:text-accent-foreground", nativeSelectChevronClasses[selectSize] ?? nativeSelectChevronClasses.default) })] }));
});
const NativeSelectTrigger = React.forwardRef(function NativeSelectTrigger({ disabled, nativeSelect, props, value, selectRef }, ref) {
    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);
    const hasFullWidthClass = props.className?.split(/\s+/).includes("w-full") === true;
    const hoverBackground = props.nativeTriggerHoverBackground !== false;
    const hoverOpacity = props.nativeTriggerHoverOpacity ?? props.nativeTriggerHoverBackground === false;
    const opacity = disabled
        ? SELECT_TRIGGER_DISABLE_OPACITY
        : pressed
            ? SELECT_TRIGGER_WEB_PRESS_OPACITY
            : hovered
                ? hoverOpacity
                    ? SELECT_TRIGGER_WEB_HOVER_OPACITY
                    : 1
                : 1;
    React.useImperativeHandle(ref, () => ({
        open: () => selectRef.current?.click?.(),
        close: () => selectRef.current?.blur?.(),
    }), [selectRef]);
    return (_jsxs("div", { className: "group", style: {
            alignSelf: hasFullWidthClass ? "stretch" : "flex-start",
            display: hasFullWidthClass ? "flex" : "inline-flex",
            position: "relative",
            width: hasFullWidthClass ? "100%" : "auto",
        }, children: [_jsx(NativeTrigger, { ...props.nativeTriggerProps, containerStyle: props.nativeTriggerContainerStyle, content: props.nativeTriggerContent, disabled: disabled, fontWeight: props.triggerFontWeight ?? SELECT_TRIGGER_FONT_WEIGHT, icon: props.nativeTriggerIcon, label: props.nativeTriggerLabel ?? (_jsx(SelectedLabel, { defaultFontSize: getSelectTriggerFontSize(props), defaultFontWeight: props.triggerFontWeight ?? SELECT_TRIGGER_FONT_WEIGHT, props: props, value: value })), labelProps: props.nativeTriggerLabelProps, size: props.triggerSize ?? props.nativeTriggerProps?.size ?? "default", pointerEvents: "none", className: cn(hoverBackground &&
                    "rounded-md hover:bg-accent group-hover:bg-accent group-active:bg-accent hover:text-accent-foreground group-hover:text-accent-foreground group-active:text-accent-foreground disabled:hover:bg-transparent disabled:group-hover:bg-transparent disabled:group-active:bg-transparent disabled:hover:text-foreground disabled:group-hover:text-foreground disabled:group-active:text-foreground", props.nativeTriggerProps?.className, props.className), feedbackOpacity: {
                    disabled: SELECT_TRIGGER_DISABLE_OPACITY,
                    press: SELECT_TRIGGER_PRESS_OPACITY,
                    webHover: hoverOpacity ? SELECT_TRIGGER_WEB_HOVER_OPACITY : 1,
                    webPress: SELECT_TRIGGER_WEB_PRESS_OPACITY,
                    ...props.nativeTriggerFeedbackOpacity,
                }, style: (state) => [
                    { alignItems: "center", opacity },
                    typeof props.nativeTriggerProps?.style === "function"
                        ? props.nativeTriggerProps.style(state)
                        : props.nativeTriggerProps?.style,
                    props.style,
                ] }), React.cloneElement(nativeSelect, {
                className: cn("absolute inset-0 h-full w-full cursor-default opacity-0", props.nativeSelectProps?.className, props.className),
                onMouseDown: () => setPressed(true),
                onMouseEnter: () => setHovered(true),
                onMouseLeave: () => {
                    setHovered(false);
                    setPressed(false);
                },
                onMouseUp: () => setPressed(false),
                style: {
                    appearance: "none",
                    ...StyleSheet.flatten(props.nativeSelectProps?.style),
                },
            })] }));
});
