import { createElement as _createElement } from "react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from "../icon";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
import { resolveRenderProp } from "../utils/render";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import * as DropdownPrimitive from "@rn-primitives/dropdown-menu";
import { Check, ChevronDown, ChevronRight, ChevronUp } from "lucide-react-native";
import * as React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, } from "react-native";
import { FadeIn, ReduceMotion } from "react-native-reanimated";
const DROPDOWN_MENU_MAX_HEIGHT_RATIO = 0.45;
import { DropdownNative } from "./dropdown_native";
import { DropdownDefaultTrigger, DropdownNativeTrigger, resolveDropdownTrigger } from "./shared";
const DropdownNativeTriggerWithContext = React.forwardRef(function DropdownNativeTriggerWithContext(props, ref) {
    const { open } = DropdownPrimitive.useRootContext();
    return _jsx(DropdownNativeTrigger, { ...props, open: open, ref: ref });
});
const DropdownPrimitiveRoot = DropdownPrimitive.Root;
const DropdownTrigger = DropdownPrimitive.Trigger;
const DropdownGroup = DropdownPrimitive.Group;
function DropdownPortal({ hostName, ...props }) {
    const scopedPortalHost = useScopedOverlayPortalHostName();
    return _jsx(DropdownPrimitive.Portal, { ...props, hostName: hostName ?? scopedPortalHost });
}
const DropdownSub = DropdownPrimitive.Sub;
const DropdownRadioGroup = DropdownPrimitive.RadioGroup;
const DropdownHapticsContext = React.createContext({});
function DropdownSubTrigger({ className, inset, children, iconClassName, nativeHaptics, onPress, ...props }) {
    const { open } = DropdownPrimitive.useSubContext();
    const contextHaptics = React.useContext(DropdownHapticsContext);
    const disabled = props.disabled === true;
    const icon = Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;
    return (_jsx(TextClassContext.Provider, { value: cn("text-sm select-none", !disabled && "group-active:text-accent-foreground", open && "text-accent-foreground"), children: _jsxs(DropdownPrimitive.SubTrigger, { className: cn("group flex flex-row items-center justify-between rounded-sm px-2 py-2 sm:py-1.5", !disabled && "active:bg-accent", Platform.select({
                web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none [&_svg]:pointer-events-none",
            }), className, open && "bg-accent", inset && "pl-8"), ...props, pointerEvents: disabled ? "none" : props.pointerEvents, onPress: (event) => {
                if (disabled)
                    return;
                onPress?.(event);
                if (!event.defaultPrevented) {
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
                }
            }, children: [_jsx(_Fragment, { children: children }), _jsx(Icon, { as: icon, className: cn("text-foreground size-4 shrink-0", iconClassName) })] }) }));
}
function DropdownSubContent({ className, ...props }) {
    return (_jsx(NativeOnlyAnimatedView, { entering: FadeIn.reduceMotion(ReduceMotion.System), children: _jsx(DropdownPrimitive.SubContent, { className: cn("bg-popover border-border overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5", Platform.select({
                web: "animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fade-in-0 data-[state=closed]:zoom-out-95 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin) z-50 min-w-[8rem]",
            }), className), ...props }) }));
}
function DropdownContent({ align = "center", className, children, side: sideProp, itemNativeHaptics, overlayClassName, overlayStyle, portalHost, style, ...props }) {
    const { height: windowHeight } = useWindowDimensions();
    const { triggerPosition, contentLayout, onOpenChange: setOpen, setTriggerPosition, setContentLayout, } = DropdownPrimitive.useRootContext();
    const availableAbove = triggerPosition?.pageY ?? 0;
    const availableBelow = triggerPosition
        ? windowHeight - triggerPosition.pageY - triggerPosition.height
        : windowHeight;
    const estimatedHeight = contentLayout?.height ?? windowHeight * DROPDOWN_MENU_MAX_HEIGHT_RATIO;
    const resolvedSide = Platform.OS === "web" || sideProp != null
        ? sideProp
        : availableBelow < estimatedHeight && availableAbove > availableBelow
            ? "top"
            : "bottom";
    const scopedPortalHost = useScopedOverlayPortalHostName();
    const resolvedPortalHost = portalHost ?? scopedPortalHost;
    const contentStyle = useOverlayPortalContentStyle(style);
    const resolvedChildren = typeof children === "function" ? children({ pressed: false }) : children;
    const handleNativeOverlayPress = (event) => {
        const target = event?.target ?? event?.nativeEvent?.target;
        const currentTarget = event?.currentTarget;
        if (target != null && currentTarget != null && target !== currentTarget)
            return;
        setTriggerPosition(null);
        setContentLayout(null);
        setOpen(false);
    };
    const handleWebOverlayPress = (event) => {
        // The portal content remains a child of the overlay on Web. Only a click
        // on the transparent viewport layer itself should close the menu; clicks
        // inside Content must keep their normal item handling.
        if (event?.target !== event?.currentTarget)
            return;
        setTriggerPosition(null);
        setContentLayout(null);
        setOpen(false);
    };
    return (_jsx(DropdownPrimitive.Portal, { hostName: resolvedPortalHost, children: _jsx(OverlayPortalWindow, { portalHost: resolvedPortalHost, children: _jsx(DropdownPrimitive.Overlay, { style: [
                    Platform.OS === "web"
                        ? {
                            bottom: 0,
                            cursor: "default",
                            left: 0,
                            position: "fixed",
                            right: 0,
                            top: 0,
                            zIndex: 1,
                        }
                        : StyleSheet.absoluteFillObject,
                    overlayStyle,
                ], pointerEvents: "auto", className: overlayClassName, closeOnPress: Platform.OS === "web" ? undefined : false, onPress: Platform.OS === "web" ? handleWebOverlayPress : handleNativeOverlayPress, asChild: Platform.OS !== "web", children: _jsxs(NativeOnlyAnimatedView, { entering: FadeIn.reduceMotion(ReduceMotion.System), as: "View", children: [Platform.OS !== "web" ? (_jsx(Pressable, { onPress: handleNativeOverlayPress, style: StyleSheet.absoluteFillObject })) : null, _jsx(DropdownHapticsContext.Provider, { value: { item: itemNativeHaptics }, children: _jsx(TextClassContext.Provider, { value: "text-popover-foreground", children: _jsx(DropdownPrimitive.Content, { style: [
                                        Platform.OS === "web"
                                            ? {
                                                maxHeight: windowHeight * DROPDOWN_MENU_MAX_HEIGHT_RATIO,
                                                zIndex: 50,
                                            }
                                            : { maxHeight: windowHeight * DROPDOWN_MENU_MAX_HEIGHT_RATIO },
                                        contentStyle,
                                    ], className: cn("bg-popover border-border min-w-[8rem] overflow-x-hidden rounded-md border p-1 shadow-lg shadow-black/5", Platform.select({
                                        web: cn(cn("animate-in fade-in-0 zoom-in-95 max-h-[45vh] overflow-y-auto origin-(--radix-context-menu-content-transform-origin) z-50 cursor-default", "ui-menu-scrollbar"), resolvedSide === "bottom" && "slide-in-from-top-2", resolvedSide === "top" && "slide-in-from-bottom-2"),
                                    }), className), ...props, asChild: true, align: align, side: resolvedSide, children: _jsx(View, { collapsable: false, children: Platform.OS === "web" ? (resolvedChildren) : (_jsx(ScrollView, { nestedScrollEnabled: true, showsVerticalScrollIndicator: true, onMoveShouldSetResponderCapture: () => true, style: { maxHeight: windowHeight * DROPDOWN_MENU_MAX_HEIGHT_RATIO }, children: resolvedChildren })) }) }) }) })] }) }) }) }));
}
function DropdownItem({ className, disabled, inset, nativeHaptics, onPress, variant, ...props }) {
    const contextHaptics = React.useContext(DropdownHapticsContext);
    return (_jsx(TextClassContext.Provider, { value: cn("select-none text-sm text-popover-foreground", !disabled && "group-active:text-popover-foreground", variant === "destructive" && "text-destructive", variant === "destructive" && !disabled && "group-active:text-destructive"), children: _jsx(DropdownPrimitive.Item, { className: cn("group relative flex flex-row items-center gap-2 rounded-sm px-2 py-2 sm:py-1.5", !disabled && "active:bg-accent", Platform.select({
                web: cn("focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none", variant === "destructive" && "focus:bg-destructive/10 dark:focus:bg-destructive/20"),
            }), !disabled &&
                variant === "destructive" &&
                "active:bg-destructive/10 dark:active:bg-destructive/20", disabled && "opacity-50", inset && "pl-8", className), ...props, disabled: disabled, 
            // Disabled rows are transparent to native touch handling so a drag that
            // begins on one still belongs to the menu ScrollView.
            pointerEvents: disabled ? "none" : props.pointerEvents, onPress: (event) => {
                if (disabled)
                    return;
                onPress?.(event);
                if (!event.defaultPrevented) {
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
                }
            } }) }));
}
function DropdownCheckboxItem({ className, children, disabled, nativeHaptics, onCheckedChange, ...props }) {
    const contextHaptics = React.useContext(DropdownHapticsContext);
    return (_jsx(TextClassContext.Provider, { value: cn("text-sm text-popover-foreground select-none", !disabled && "group-active:text-accent-foreground"), children: _jsxs(DropdownPrimitive.CheckboxItem, { className: cn("group relative flex flex-row items-center gap-2 rounded-sm py-2 pl-8 pr-2 sm:py-1.5", !disabled && "active:bg-accent", Platform.select({
                web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
            }), disabled && "opacity-50 disabled:active:bg-transparent", className), ...props, disabled: disabled, pointerEvents: disabled ? "none" : props.pointerEvents, onCheckedChange: (checked) => {
                if (disabled)
                    return;
                onCheckedChange?.(checked);
                triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
            }, children: [_jsx(View, { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(DropdownPrimitive.ItemIndicator, { children: _jsx(Icon, { as: Check, className: cn("text-foreground size-4", Platform.select({ web: "pointer-events-none" })) }) }) }), _jsx(_Fragment, { children: children })] }) }));
}
function DropdownRadioItem({ className, children, disabled, nativeHaptics, onPress, ...props }) {
    const contextHaptics = React.useContext(DropdownHapticsContext);
    return (_jsx(TextClassContext.Provider, { value: cn("text-sm text-popover-foreground select-none", !disabled && "group-active:text-accent-foreground"), children: _jsxs(DropdownPrimitive.RadioItem, { className: cn("group relative flex flex-row items-center gap-2 rounded-sm py-2 pl-8 pr-2 sm:py-1.5", !disabled && "active:bg-accent", Platform.select({
                web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
            }), disabled && "opacity-50 disabled:active:bg-transparent", className), ...props, disabled: disabled, pointerEvents: disabled ? "none" : props.pointerEvents, onPress: (event) => {
                if (disabled)
                    return;
                onPress?.(event);
                if (!event.defaultPrevented) {
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
                }
            }, children: [_jsx(View, { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(DropdownPrimitive.ItemIndicator, { children: _jsx(View, { className: "bg-foreground h-2 w-2 rounded-full" }) }) }), _jsx(_Fragment, { children: children })] }) }));
}
function DropdownLabel({ className, inset, ...props }) {
    return (_jsx(DropdownPrimitive.Label, { className: cn("text-foreground px-2 py-2 text-sm font-medium sm:py-1.5", inset && "pl-8", className), ...props }));
}
function DropdownSeparator({ className, ...props }) {
    return (_jsx(DropdownPrimitive.Separator, { className: cn("bg-border -mx-1 my-1 h-px", className), ...props, 
        // Separators are decoration. Let a drag started here reach the ScrollView.
        pointerEvents: "none" }));
}
function DropdownShortcut({ className, ...props }) {
    return (_jsx(Text, { className: cn("text-muted-foreground ml-auto text-xs tracking-widest", className), ...props }));
}
function renderDropdownItems(items, itemProps, defaultNativeHaptics, depth = 0) {
    return items.map((item, index) => {
        const key = `${depth}:${item.value}:${index}`;
        if (item.separator)
            return _jsx(DropdownSeparator, {}, key);
        const label = resolveRenderProp(item.label, item) ?? item.textValue ?? item.value;
        const resolvedItemProps = {
            ...(itemProps ?? {}),
            ...(item.itemProps ?? {}),
        };
        const itemHaptics = item.nativeHaptics ??
            resolvedItemProps.nativeHaptics ??
            defaultNativeHaptics;
        if (item.subMenu?.length) {
            return (_createElement(DropdownSub, { ...item.subMenuProps, key: key },
                _jsx(DropdownSubTrigger, { ...item.triggerProps, "aria-label": item["aria-label"] ?? item.triggerProps?.["aria-label"], disabled: item.disabled ?? item.triggerProps?.disabled, nativeHaptics: itemHaptics, children: _jsx(Text, { children: label }) }),
                _jsxs(DropdownSubContent, { ...item.contentProps, children: [item.subMenuTitle === false ? null : (_jsx(DropdownLabel, { children: resolveRenderProp(item.subMenuTitle, item) ?? label })), renderDropdownItems(item.subMenu, itemProps, defaultNativeHaptics, depth + 1)] })));
        }
        return (_createElement(DropdownItem, { ...resolvedItemProps, "aria-label": item["aria-label"] ?? resolvedItemProps["aria-label"], disabled: item.disabled ?? resolvedItemProps.disabled, key: key, nativeHaptics: itemHaptics, onPress: item.onSelect ??
                item.onPress ??
                resolvedItemProps.onPress, textValue: item.textValue ?? resolvedItemProps.textValue, variant: item.destructive === true
                ? "destructive"
                : item.destructive === false
                    ? "default"
                    : resolvedItemProps.variant },
            _jsx(Text, { children: label }),
            resolveRenderProp(item.icon, item),
            resolveRenderProp(item.indicator, item)));
    });
}
function Dropdown({ children, contentProps, __nativeDetachedAnchor, __menuRef, defaultOpen, disabled, items, itemProps, itemNativeHaptics, native = Platform.OS !== "web", nativeAnchorAlignment, nativeHaptics, nativeSelectedItemBackgroundColor, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabelProps, nativeTriggerProps, nativeTriggerFeedbackOpacity, nativeTriggerHoverBackground, nativeContentProps, open, onOpenChange, onOpenWillChange, trigger, triggerClassName, triggerLabel, triggerProps, ...props }) {
    if (native && Platform.OS !== "web") {
        return React.createElement(DropdownNative, {
            ...props,
            children,
            __nativeDetachedAnchor,
            __menuRef,
            defaultOpen,
            disabled,
            items,
            itemProps,
            itemNativeHaptics,
            nativeAnchorAlignment,
            nativeHaptics,
            nativeSelectedItemBackgroundColor,
            nativeTrigger,
            nativeTriggerContainerStyle,
            nativeTriggerContent,
            nativeTriggerIcon,
            nativeTriggerLabelProps,
            nativeTriggerProps,
            nativeTriggerFeedbackOpacity,
            nativeTriggerHoverBackground,
            nativeContentProps,
            onOpenChange,
            onOpenWillChange,
            open,
            trigger,
            triggerClassName,
            triggerLabel,
            triggerProps,
        });
    }
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    // Item feedback inherits the dropdown setting unless an item-specific
    // setting was supplied. This keeps generated items consistent with the
    // trigger and with native dropdown rendering.
    const resolvedItemHaptics = useResolvedNativeHaptics(itemNativeHaptics ?? nativeHaptics);
    const generated = items != null || trigger != null || nativeTrigger === true;
    const resolvedDisabled = disabled ?? triggerProps?.disabled;
    const triggerRef = React.useRef(null);
    React.useEffect(() => {
        if (__menuRef == null)
            return;
        __menuRef.current = {
            presentMenu: () => triggerRef.current?.open?.(),
        };
        return () => {
            __menuRef.current = null;
        };
    }, [__menuRef]);
    return (_jsx(DropdownHapticsContext.Provider, { value: { item: resolvedItemHaptics }, children: _jsx(DropdownPrimitiveRoot, { ...props, ...(defaultOpen === undefined ? {} : { defaultOpen }), ...(open === undefined ? {} : { open }), onOpenChange: (open) => {
                if (resolvedDisabled && open)
                    return;
                onOpenWillChange?.(open);
                if (open)
                    triggerNativeHaptics(resolvedHaptics);
                onOpenChange?.(open);
            }, children: generated ? (_jsxs(_Fragment, { children: [nativeTrigger ? (_jsx(DropdownTrigger, { ref: triggerRef, ...triggerProps, asChild: true, disabled: resolvedDisabled, children: _jsx(DropdownNativeTriggerWithContext, { className: triggerClassName, containerStyle: nativeTriggerContainerStyle, content: nativeTriggerContent, disabled: resolvedDisabled, icon: nativeTriggerIcon, label: triggerLabel, labelProps: nativeTriggerLabelProps, nativeTriggerProps: nativeTriggerProps, nativeTriggerFeedbackOpacity: nativeTriggerFeedbackOpacity, nativeTriggerHoverBackground: nativeTriggerHoverBackground, trigger: trigger }) })) : trigger != null ? (_jsx(DropdownTrigger, { ref: triggerRef, ...triggerProps, asChild: true, disabled: resolvedDisabled, children: resolveDropdownTrigger(trigger, { native: false, open: false }, resolvedDisabled) })) : items != null ? (_jsx(DropdownTrigger, { ref: triggerRef, ...triggerProps, asChild: true, disabled: resolvedDisabled, children: _jsx(DropdownDefaultTrigger, { className: triggerClassName, disabled: resolvedDisabled, label: resolveRenderProp(triggerLabel, { native: false, open: false }), props: triggerProps }) })) : null, items != null ? (_jsx(DropdownContent, { ...contentProps, itemNativeHaptics: resolvedItemHaptics, children: renderDropdownItems(items, itemProps, resolvedItemHaptics) })) : null, children] })) : (children) }) }));
}
const DropdownComponent = Object.assign(Dropdown, {
    CheckboxItem: DropdownCheckboxItem,
    Content: DropdownContent,
    Group: DropdownGroup,
    Item: DropdownItem,
    Label: DropdownLabel,
    Portal: DropdownPortal,
    RadioGroup: DropdownRadioGroup,
    RadioItem: DropdownRadioItem,
    Root: Dropdown,
    Separator: DropdownSeparator,
    Shortcut: DropdownShortcut,
    Sub: DropdownSub,
    SubContent: DropdownSubContent,
    SubTrigger: DropdownSubTrigger,
    Trigger: DropdownTrigger,
});
export { DropdownComponent as Dropdown };
