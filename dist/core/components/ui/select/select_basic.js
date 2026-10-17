import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Icon } from "../icon";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import * as SelectPrimitive from "@rn-primitives/select";
import { Check, ChevronDown, ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";
import * as React from "react";
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions, } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import { menuIconSizeClasses, menuItemPaddingClasses, menuTextSizeClasses, } from "../utils/menu_size";
const SELECT_MENU_MAX_HEIGHT_RATIO = 0.45;
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { resolveSelectItemGroups } from "./select_grouping";
import { SelectBasicTrigger, SelectNativeTrigger } from "./shared";
import { SELECT_TRIGGER_FONT_WEIGHT } from "./constants";
const SelectContentSizeContext = React.createContext("default");
function normalizeText(children, className) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { className: className, children: child })) : (child));
}
function SelectItemSwatch({ color }) {
    return _jsx(View, { className: "size-3.5 shrink-0 rounded-full", style: { backgroundColor: color } });
}
function renderSelectDisplay(label, swatchColor, fontWeight = SELECT_TRIGGER_FONT_WEIGHT) {
    const content = React.Children.map(label, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { style: { fontWeight }, children: child })) : (child));
    if (swatchColor == null)
        return content;
    return (_jsxs(View, { className: "flex-row items-center gap-2", children: [_jsx(SelectItemSwatch, { color: swatchColor }), _jsx(View, { className: "min-w-0 shrink", children: content })] }));
}
function SelectValue({ className, ...props }) {
    const { value } = SelectPrimitive.useRootContext();
    return (_jsx(SelectPrimitive.Value, { ...props, className: cn("text-foreground line-clamp-1 flex-row items-center gap-2 text-sm", !value && "text-muted-foreground", className), placeholder: "" }));
}
function SelectTrigger({ className, children, onHoverIn, onHoverOut, onPressIn, onPressOut, size = "default", ...props }) {
    const [pressed, setPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    return (_jsxs(SelectPrimitive.Trigger, { className: cn("border-input bg-background flex h-11 flex-row items-center justify-between gap-2 rounded-md border px-5 py-2.5 shadow-sm shadow-black/5", Platform.select({
            web: "focus-visible:border-ring focus-visible:ring-ring/50 w-fit whitespace-nowrap text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed hover:bg-muted",
        }), size === "sm" && "h-8 py-1.5", props.disabled && "opacity-50", className), ...props, onHoverIn: (event) => {
            setHovered(true);
            onHoverIn?.(event);
        }, onHoverOut: (event) => {
            setHovered(false);
            onHoverOut?.(event);
        }, onPressIn: (event) => {
            setPressed(true);
            onPressIn?.(event);
        }, onPressOut: (event) => {
            setPressed(false);
            onPressOut?.(event);
        }, children: [typeof children === "function"
                ? normalizeText(children({ hovered, pressed }))
                : normalizeText(children), _jsx(Icon, { as: ChevronDown, "aria-hidden": true, className: "text-muted-foreground size-4 shrink-0" })] }));
}
function SelectContent({ className, children, position = "popper", align = "center", side: sideProp, showScrollButtons = true, initialScrollOffset = 0, portalHost, viewportProps, size: sizeProp, ...props }) {
    const { height: windowHeight } = useWindowDimensions();
    const { open, triggerPosition, contentLayout } = SelectPrimitive.useRootContext();
    const scrollRef = React.useRef(null);
    const didAutoScrollRef = React.useRef(false);
    const availableAbove = triggerPosition?.pageY ?? 0;
    const availableBelow = triggerPosition
        ? windowHeight - triggerPosition.pageY - triggerPosition.height
        : windowHeight;
    const estimatedHeight = contentLayout?.height ?? windowHeight * SELECT_MENU_MAX_HEIGHT_RATIO;
    const resolvedSide = Platform.OS === "web" || sideProp != null
        ? sideProp
        : availableBelow < estimatedHeight && availableAbove > availableBelow
            ? "top"
            : "bottom";
    const scrollToSelectedItem = React.useCallback(() => {
        if (Platform.OS === "web" || !open || didAutoScrollRef.current)
            return;
        didAutoScrollRef.current = true;
        scrollRef.current?.scrollTo({ animated: false, y: Math.max(0, initialScrollOffset) });
    }, [initialScrollOffset, open]);
    React.useEffect(() => {
        if (!open) {
            didAutoScrollRef.current = false;
            return;
        }
        requestAnimationFrame(scrollToSelectedItem);
    }, [open, scrollToSelectedItem]);
    const scopedHost = useScopedOverlayPortalHostName();
    const resolvedHost = portalHost ?? scopedHost;
    const contentStyle = useOverlayPortalContentStyle(props.style);
    const resolvedContentStyle = StyleSheet.flatten(contentStyle);
    const resolvedViewportStyle = StyleSheet.flatten(viewportProps?.style);
    const size = sizeProp ?? React.useContext(SelectContentSizeContext);
    return (_jsx(SelectPrimitive.Portal, { hostName: resolvedHost, children: _jsx(OverlayPortalWindow, { portalHost: resolvedHost, children: _jsx(SelectPrimitive.Overlay
            // On web the primitive renders Overlay and Content as siblings. Keep
            // a real viewport-sized hit target in the portal so NativeList rows
            // underneath cannot receive clicks while the menu is open.
            , { 
                // On web the primitive renders Overlay and Content as siblings. Keep
                // a real viewport-sized hit target in the portal so NativeList rows
                // underneath cannot receive clicks while the menu is open.
                style: Platform.OS === "web"
                    ? {
                        bottom: 0,
                        cursor: "default",
                        left: 0,
                        position: "fixed",
                        right: 0,
                        top: 0,
                        zIndex: 0,
                    }
                    : StyleSheet.absoluteFillObject, pointerEvents: Platform.OS === "web" ? "auto" : undefined, asChild: Platform.OS !== "web", children: _jsx(NativeOnlyAnimatedView, { className: "z-50", entering: FadeIn.reduceMotion(ReduceMotion.System), exiting: FadeOut.reduceMotion(ReduceMotion.System), as: "Pressable", children: _jsx(SelectContentSizeContext.Provider, { value: size, children: _jsx(TextClassContext.Provider, { value: cn("text-popover-foreground", menuTextSizeClasses[size]), children: _jsxs(SelectPrimitive.Content, { ...props, className: cn("bg-popover border-border relative z-50 min-w-[8rem] rounded-md border shadow-md shadow-black/5", Platform.select({
                                    web: cn("animate-in fade-in-0 zoom-in-95 max-h-[45vh] overflow-x-hidden", showScrollButtons ? "overflow-y-auto" : "overflow-y-hidden", resolvedSide === "bottom" && "slide-in-from-top-2", resolvedSide === "top" && "slide-in-from-bottom-2"),
                                    native: "p-1",
                                }), position === "popper" && Platform.select({ web: "translate-y-1" }), className), style: {
                                    ...(Platform.OS === "web" ? { zIndex: 50 } : {}),
                                    maxHeight: windowHeight * SELECT_MENU_MAX_HEIGHT_RATIO,
                                    ...(Platform.OS === "web"
                                        ? { overflowY: showScrollButtons ? "auto" : "hidden" }
                                        : {}),
                                    ...resolvedContentStyle,
                                }, position: position, side: resolvedSide, align: align, children: [showScrollButtons ? _jsx(SelectScrollUpButton, {}) : null, Platform.OS === "web" ? (_jsx(SelectPrimitive.Viewport, { ...viewportProps, className: cn("p-1", position === "popper" &&
                                            Platform.select({ web: "min-w-[var(--radix-select-trigger-width)]" }), !showScrollButtons &&
                                            cn("max-h-[45vh] overflow-y-auto", "ui-menu-scrollbar"), viewportProps?.className), style: {
                                            ...(!showScrollButtons
                                                ? {
                                                    maxHeight: windowHeight * SELECT_MENU_MAX_HEIGHT_RATIO,
                                                    overflowY: "auto",
                                                }
                                                : {}),
                                            ...resolvedViewportStyle,
                                        }, children: children })) : (_jsx(ScrollView, { ref: scrollRef, nestedScrollEnabled: true, showsVerticalScrollIndicator: true, onContentSizeChange: scrollToSelectedItem, style: { maxHeight: windowHeight * SELECT_MENU_MAX_HEIGHT_RATIO }, children: _jsx(SelectPrimitive.Viewport, { ...viewportProps, className: cn("p-1", viewportProps?.className), children: children }) })), showScrollButtons ? _jsx(SelectScrollDownButton, {}) : null] }) }) }) }) }) }) }));
}
function SelectLabel({ className, ...props }) {
    const size = React.useContext(SelectContentSizeContext);
    return (_jsx(SelectPrimitive.Label, { className: cn("text-muted-foreground px-2", menuTextSizeClasses[size], menuItemPaddingClasses[size], className), ...props }));
}
function SelectItem({ className, children, description, startContent, endContent, itemIndicatorProps, itemTextProps, ...props }) {
    const size = React.useContext(SelectContentSizeContext);
    const label = props.label ??
        (typeof children === "string" || typeof children === "number" ? String(children) : props.value);
    const customLabel = children != null && !(typeof children === "string" || typeof children === "number");
    return (_jsxs(SelectPrimitive.Item, { ...props, label: label, className: cn(cn("active:bg-accent group relative flex w-full flex-row items-center gap-2 rounded-sm pl-2 pr-8", menuItemPaddingClasses[size]), Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
        }), props.disabled && "opacity-50", className), children: [_jsx(View, { className: "absolute right-2 flex size-3.5 items-center justify-center", children: _jsx(SelectPrimitive.ItemIndicator, { ...itemIndicatorProps, children: _jsx(Icon, { as: Check, className: cn("text-muted-foreground shrink-0", menuIconSizeClasses[size]) }) }) }), startContent, _jsxs(View, { className: "min-w-0 flex-1", children: [customLabel ? normalizeText(children) : null, _jsx(SelectPrimitive.ItemText, { ...itemTextProps, className: cn(cn("text-foreground select-none group-active:text-accent-foreground", menuTextSizeClasses[size]), customLabel && "hidden", itemTextProps?.className) }), description != null
                        ? normalizeText(description, cn("text-muted-foreground", menuTextSizeClasses[size]))
                        : null] }), endContent] }));
}
function SelectSeparator({ className, ...props }) {
    return (_jsx(SelectPrimitive.Separator, { className: cn("bg-border -mx-1 my-1 h-px", Platform.OS === "web" && "pointer-events-none", className), ...props }));
}
function SelectScrollUpButton({ className, ...props }) {
    if (Platform.OS !== "web")
        return null;
    const size = React.useContext(SelectContentSizeContext);
    return (_jsx(SelectPrimitive.ScrollUpButton, { className: cn("flex cursor-default items-center justify-center py-1", className), ...props, children: _jsx(Icon, { as: ChevronUpIcon, className: menuIconSizeClasses[size] }) }));
}
function SelectScrollDownButton({ className, ...props }) {
    if (Platform.OS !== "web")
        return null;
    const size = React.useContext(SelectContentSizeContext);
    return (_jsx(SelectPrimitive.ScrollDownButton, { className: cn("flex cursor-default items-center justify-center py-1", className), ...props, children: _jsx(Icon, { as: ChevronDownIcon, className: menuIconSizeClasses[size] }) }));
}
function renderItemLabel(item, selected) {
    return resolveRenderProp(item.label, {
        checked: selected,
        disabled: !!(item.disabled ?? item.isDisabled),
        selected,
        value: item.value,
    });
}
function renderGeneratedItems(props, selectedValue) {
    const groups = resolveSelectItemGroups({
        itemGroups: props.itemGroups,
        items: props.items,
        options: props.options,
    });
    return groups.map((group, groupIndex) => {
        const groupLabel = group.label == null ? null : resolveRenderProp(group.label, { value: selectedValue ?? "" });
        const body = group.items.map((item) => {
            const selected = item.value === selectedValue;
            const ctx = {
                checked: selected,
                disabled: !!(item.disabled ?? item.isDisabled),
                selected,
                value: item.value,
            };
            return (_jsx(SelectItem, { ...props.itemProps, ...item.itemProps, "aria-label": item["aria-label"], disabled: ctx.disabled, description: resolveRenderProp(item.description, ctx), startContent: _jsxs(_Fragment, { children: [item.swatchColor != null ? _jsx(SelectItemSwatch, { color: item.swatchColor }) : null, normalizeText(resolveRenderProp(item.startContent, ctx))] }), endContent: resolveRenderProp(item.endContent, ctx), itemIndicatorProps: props.itemIndicatorProps, itemTextProps: props.itemTextProps, value: item.value, children: renderItemLabel(item, selected) }, item.value));
        });
        return groupIndex === 0 && groupLabel == null ? (body) : (_jsx(SelectPrimitive.Group, { children: _jsxs(_Fragment, { children: [groupLabel ? (_jsx(SelectLabel, { ...group.labelProps, children: normalizeText(groupLabel) })) : null, body] }) }, group.key));
    });
}
const GeneratedSelectTrigger = React.forwardRef(function GeneratedSelectTrigger({ className, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabel, nativeTriggerLabelProps, nativeTriggerProps, nativeTriggerFeedbackOpacity, nativeTriggerHoverBackground, nativeTriggerHoverOpacity, selectProps, disabled, label, swatchColor, }, ref) {
    const { open } = SelectPrimitive.useRootContext();
    // Native triggers must keep the label as data so SelectNativeTrigger can
    // apply nativeTriggerLabelProps (especially color) to its Text node. Passing
    // a pre-rendered ReactNode here bypasses those props on Web.
    const display = nativeTrigger
        ? undefined
        : renderSelectDisplay(nativeTriggerLabel ?? label, swatchColor, selectProps.triggerFontWeight ?? SELECT_TRIGGER_FONT_WEIGHT);
    if (!nativeTrigger) {
        return (_jsx(SelectPrimitive.Trigger, { asChild: true, disabled: disabled, children: _jsx(SelectBasicTrigger, { disabled: disabled, label: display, props: selectProps, value: selectProps.value ?? selectProps.defaultValue ?? undefined, ref: ref }) }));
    }
    return (_jsx(SelectPrimitive.Trigger, { asChild: true, disabled: disabled, children: _jsx(SelectNativeTrigger, { active: open, disabled: disabled, label: display, props: selectProps, ref: ref, value: selectProps.value ?? selectProps.defaultValue }) }));
});
export const SelectBasic = React.forwardRef(function SelectBasic({ children, items, itemGroups, options, native, nativeDropdownAlign, nativeDropdownAnchorWidth, nativeDropdownEdgeOffset, nativeHaptics, nativePickerProps, nativeSelectProps, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabel, nativeTriggerLabelProps, nativeTriggerProps, nativeTriggerFeedbackOpacity, nativeTriggerHoverBackground, nativeTriggerHoverOpacity, contentProps, itemProps, itemIndicatorProps, itemTextProps, placeholder, renderValue, sheetProps, showScrollButtons, triggerProps, triggerSize, contentSize, triggerFontWeight, viewportProps, isDisabled, onValueChange, ...props }, ref) {
    const selectedValue = props.value ?? props.defaultValue ?? undefined;
    const sourceOptions = itemGroups?.flatMap((group) => group.items) ?? items ?? options ?? [];
    const selectedIndex = Math.max(0, sourceOptions.findIndex((item) => item.value === selectedValue));
    const initialScrollOffset = Math.max(0, selectedIndex * 52 - 104);
    const itemOptions = sourceOptions.map((item) => ({
        value: item.value,
        label: String(resolveRenderProp(item.label, {
            checked: item.value === selectedValue,
            disabled: false,
            selected: item.value === selectedValue,
            value: item.value,
        }) ?? item.value),
    }));
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    const triggerRef = React.useRef(null);
    React.useImperativeHandle(ref, () => ({
        open: () => triggerRef.current?.open?.(),
        close: () => triggerRef.current?.close?.(),
    }), []);
    const rootHasFullWidthClass = props.className?.split(/\s+/).includes("w-full") === true;
    const generated = children ??
        (items != null || itemGroups != null || options != null ? (_jsxs(_Fragment, { children: [_jsx(GeneratedSelectTrigger, { className: props.className, disabled: props.disabled ?? isDisabled, label: resolveRenderProp(renderValue, {
                        value: selectedValue,
                        item: sourceOptions.find((item) => item.value === selectedValue),
                    }) ??
                        resolveRenderProp(sourceOptions.find((item) => item.value === selectedValue)?.label, {
                            checked: true,
                            disabled: false,
                            selected: true,
                            value: selectedValue ?? "",
                        }) ??
                        placeholder ??
                        "选择", nativeTrigger: nativeTrigger, nativeTriggerContainerStyle: nativeTriggerContainerStyle, nativeTriggerContent: nativeTriggerContent, nativeTriggerIcon: nativeTriggerIcon, nativeTriggerLabel: nativeTriggerLabel, nativeTriggerLabelProps: nativeTriggerLabelProps, selectProps: {
                        ...props,
                        itemGroups,
                        items,
                        options,
                        placeholder,
                        renderValue,
                        nativeTriggerContainerStyle,
                        nativeTriggerContent,
                        nativeTriggerIcon,
                        nativeTriggerLabel,
                        nativeTriggerLabelProps,
                        nativeTriggerFeedbackOpacity,
                        nativeTriggerHoverBackground,
                        nativeTriggerHoverOpacity,
                        nativeTriggerProps,
                        triggerSize,
                        triggerFontWeight,
                        triggerProps,
                    }, swatchColor: sourceOptions.find((item) => item.value === selectedValue)?.swatchColor, ref: triggerRef }), _jsx(SelectContent, { ...contentProps, showScrollButtons: showScrollButtons ?? contentProps?.showScrollButtons, initialScrollOffset: initialScrollOffset, viewportProps: viewportProps, children: renderGeneratedItems({ ...props, itemProps, itemIndicatorProps, itemTextProps, items, itemGroups, options }, selectedValue) })] })) : null);
    return (_jsx(SelectPrimitive.Root, { ...props, 
        // Generated triggers are content-sized unless their own className asks
        // for `w-full`. The primitive Root is a View whose default cross-axis
        // stretch would otherwise expand both trigger variants.
        style: [
            {
                alignItems: "flex-start",
                alignSelf: rootHasFullWidthClass ? "stretch" : "flex-start",
                width: rootHasFullWidthClass ? "100%" : "auto",
            },
            props.style,
        ], disabled: props.disabled ?? isDisabled, onOpenChange: (nextOpen) => {
            if (nextOpen)
                triggerNativeHaptics(resolvedHaptics);
            props.onOpenChange?.(nextOpen);
        }, value: selectedValue == null
            ? undefined
            : itemOptions.find((option) => option.value === selectedValue), defaultValue: props.defaultValue == null
            ? undefined
            : itemOptions.find((option) => option.value === props.defaultValue), onValueChange: (option) => {
            triggerNativeHaptics(resolvedHaptics);
            onValueChange?.(option?.value ?? null);
        }, children: _jsx(SelectContentSizeContext.Provider, { value: contentSize ?? "default", children: generated }) }));
});
export const SelectBasicComponent = Object.assign(SelectBasic, {
    Content: SelectContent,
    Group: (props) => _jsx(SelectPrimitive.Group, { ...props }),
    Item: SelectItem,
    Label: SelectLabel,
    Root: SelectBasic,
    ScrollDownButton: SelectScrollDownButton,
    ScrollUpButton: SelectScrollUpButton,
    Separator: SelectSeparator,
    Trigger: SelectTrigger,
    Value: SelectValue,
});
