import { createElement as _createElement } from "react";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from "../icon";
import { menuIconSizeClasses, menuItemPaddingClasses, menuTextSizeClasses, } from "../utils/menu_size";
import { ContextMenuNative } from "./context_menu_native";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { resolveRenderProp } from "../utils/render";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { semanticColorsToVariables, useUiTheme } from "../utils/theme";
import * as ContextMenuPrimitive from "@rn-primitives/context-menu";
import { Check, ChevronDown, ChevronRight, ChevronUp } from "lucide-react-native";
import * as React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions, } from "react-native";
import { FadeIn, ReduceMotion } from "react-native-reanimated";
const ContextMenuPrimitiveRoot = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
const CONTEXT_MENU_MAX_HEIGHT_RATIO = 0.45;
const ContextMenuContentSizeContext = React.createContext("default");
const ContextMenuHapticsContext = React.createContext({});
function ContextMenuSubTrigger({ className, inset, children, iconClassName, nativeHaptics, nativeHapticsDelay, onPress, ...props }) {
    const { open } = ContextMenuPrimitive.useSubContext();
    const contextHaptics = React.useContext(ContextMenuHapticsContext);
    const size = React.useContext(ContextMenuContentSizeContext);
    const disabled = props.disabled === true;
    const icon = Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;
    return (_jsx(TextClassContext.Provider, { value: cn(cn(menuTextSizeClasses[size], "select-none"), !disabled && "group-active:text-accent-foreground", open && "text-accent-foreground"), children: _jsxs(ContextMenuPrimitive.SubTrigger, { className: cn(cn("group flex flex-row items-center justify-between rounded-sm px-2", menuItemPaddingClasses[size]), !disabled && "active:bg-accent", Platform.select({
                web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none [&_svg]:pointer-events-none",
            }), className, open && cn("bg-accent", Platform.select({ native: "mb-1" })), inset && "pl-8"), ...props, pointerEvents: disabled ? "none" : props.pointerEvents, onPress: (event) => {
                if (disabled)
                    return;
                onPress?.(event);
                if (!event.defaultPrevented) {
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.item, {
                        delay: nativeHapticsDelay ?? contextHaptics.itemDelay,
                    });
                }
            }, children: [_jsx(_Fragment, { children: children }), _jsx(Icon, { as: icon, className: cn("text-foreground shrink-0", menuIconSizeClasses[size], iconClassName) })] }) }));
}
function ContextMenuSubContent({ className, style, size: sizeProp, children, ...props }) {
    const theme = useUiTheme();
    const size = sizeProp ?? React.useContext(ContextMenuContentSizeContext);
    return (_jsx(NativeOnlyAnimatedView, { entering: FadeIn.reduceMotion(ReduceMotion.System), children: _jsx(ContextMenuPrimitive.SubContent, { className: cn("bg-popover border-border overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5", Platform.select({
                web: "animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fade-in-0 data-[state=closed]:zoom-out-95 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin) z-50 min-w-[8rem]",
            }), className), 
            // The web primitive renders SubContent through its own Radix portal,
            // outside the provider-scoped variables applied by OverlayPortalWindow.
            style: [Platform.OS === "web" ? semanticColorsToVariables(theme) : null, style], ...props, children: _jsx(ContextMenuContentSizeContext.Provider, { value: size, children: _jsx(TextClassContext.Provider, { value: cn("text-popover-foreground", menuTextSizeClasses[size]), children: children }) }) }) }));
}
function ContextMenuContent({ className, overlayClassName, overlayStyle, portalHost, style, itemNativeHaptics, itemNativeHapticsDelay, size: sizeProp, side: sideProp, children, ...props }) {
    const { height: windowHeight } = useWindowDimensions();
    const { pressPosition: triggerPosition, contentLayout, onOpenChange: setOpen, setPressPosition, setContentLayout, } = ContextMenuPrimitive.useRootContext();
    const availableAbove = triggerPosition?.pageY ?? 0;
    const availableBelow = triggerPosition
        ? windowHeight - triggerPosition.pageY - triggerPosition.height
        : windowHeight;
    const estimatedHeight = contentLayout?.height ?? windowHeight * CONTEXT_MENU_MAX_HEIGHT_RATIO;
    const resolvedSide = Platform.OS === "web" || sideProp != null
        ? sideProp
        : availableBelow < estimatedHeight && availableAbove > availableBelow
            ? "top"
            : "bottom";
    const scopedPortalHost = useScopedOverlayPortalHostName();
    const resolvedPortalHost = portalHost ?? scopedPortalHost;
    const contentStyle = useOverlayPortalContentStyle(style);
    const resolvedContentStyle = StyleSheet.flatten(contentStyle);
    const inheritedHaptics = React.useContext(ContextMenuHapticsContext);
    const size = sizeProp ?? React.useContext(ContextMenuContentSizeContext);
    const handleNativeOverlayPress = (event) => {
        const target = event?.target ?? event?.nativeEvent?.target;
        const currentTarget = event?.currentTarget;
        if (target != null && currentTarget != null && target !== currentTarget)
            return;
        setPressPosition(null);
        setContentLayout(null);
        setOpen(false);
    };
    return (_jsx(ContextMenuPrimitive.Portal, { hostName: resolvedPortalHost, children: _jsx(OverlayPortalWindow, { portalHost: resolvedPortalHost, children: _jsx(ContextMenuPrimitive.Overlay, { style: [Platform.OS === "web" ? undefined : StyleSheet.absoluteFillObject, overlayStyle], className: overlayClassName, closeOnPress: Platform.OS === "web" ? undefined : false, onPress: Platform.OS === "web" ? undefined : handleNativeOverlayPress, asChild: Platform.OS !== "web", children: _jsxs(NativeOnlyAnimatedView, { entering: FadeIn.reduceMotion(ReduceMotion.System), as: "View", children: [Platform.OS !== "web" ? (_jsx(Pressable, { onPress: handleNativeOverlayPress, style: StyleSheet.absoluteFillObject })) : null, _jsx(ContextMenuContentSizeContext.Provider, { value: size, children: _jsx(TextClassContext.Provider, { value: cn("text-popover-foreground", menuTextSizeClasses[size]), children: _jsx(ContextMenuHapticsContext.Provider, { value: {
                                        item: itemNativeHaptics ?? inheritedHaptics.item,
                                        itemDelay: itemNativeHapticsDelay ?? inheritedHaptics.itemDelay,
                                    }, children: _jsx(ContextMenuPrimitive.Content, { style: {
                                            maxHeight: windowHeight * CONTEXT_MENU_MAX_HEIGHT_RATIO,
                                            ...resolvedContentStyle,
                                        }, className: cn("bg-popover border-border min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5", Platform.select({
                                            web: cn(cn("animate-in fade-in-0 zoom-in-95 max-h-[45vh] overflow-y-auto origin-(--radix-context-menu-content-transform-origin) z-50 cursor-default", "ui-menu-scrollbar"), resolvedSide === "bottom" && "slide-in-from-top-2", resolvedSide === "top" && "slide-in-from-bottom-2"),
                                        }), className), side: resolvedSide, ...props, asChild: true, 
                                        // The primitive Content claims the responder on touch start by
                                        // default. Let the nested ScrollView own drag gestures instead.
                                        onStartShouldSetResponder: () => false, children: _jsx(View, { collapsable: false, children: Platform.OS === "web" ? (children) : (_jsx(ScrollView, { nestedScrollEnabled: true, showsVerticalScrollIndicator: true, onMoveShouldSetResponderCapture: () => true, style: { maxHeight: windowHeight * CONTEXT_MENU_MAX_HEIGHT_RATIO }, children: children })) }) }) }) }) })] }) }) }) }));
}
function ContextMenuItem({ className, disabled, inset, nativeHaptics, nativeHapticsDelay, onPress, variant, ...props }) {
    const contextHaptics = React.useContext(ContextMenuHapticsContext);
    const size = React.useContext(ContextMenuContentSizeContext);
    return (_jsx(TextClassContext.Provider, { value: cn(cn(menuTextSizeClasses[size], "select-none text-popover-foreground"), !disabled && "group-active:text-popover-foreground", variant === "destructive" && "text-destructive", variant === "destructive" && !disabled && "group-active:text-destructive"), children: _jsx(ContextMenuPrimitive.Item, { className: cn(cn("group relative flex flex-row items-center gap-2 rounded-sm px-2", menuItemPaddingClasses[size]), !disabled && "active:bg-accent", Platform.select({
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
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.item, {
                        delay: nativeHapticsDelay ?? contextHaptics.itemDelay,
                    });
                }
            } }) }));
}
function ContextMenuCheckboxItem({ className, children, disabled, nativeHaptics, nativeHapticsDelay, onCheckedChange, ...props }) {
    const contextHaptics = React.useContext(ContextMenuHapticsContext);
    const size = React.useContext(ContextMenuContentSizeContext);
    return (_jsx(TextClassContext.Provider, { value: cn(cn(menuTextSizeClasses[size], "text-popover-foreground select-none"), !disabled && "group-active:text-accent-foreground"), children: _jsxs(ContextMenuPrimitive.CheckboxItem, { className: cn(cn("group relative flex flex-row items-center gap-2 rounded-sm pl-8 pr-2", menuItemPaddingClasses[size]), !disabled && "active:bg-accent", Platform.select({
                web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
            }), disabled && "opacity-50 disabled:active:bg-transparent", className), ...props, disabled: disabled, pointerEvents: disabled ? "none" : props.pointerEvents, onCheckedChange: (checked) => {
                if (disabled)
                    return;
                onCheckedChange?.(checked);
                triggerNativeHaptics(nativeHaptics ?? contextHaptics.item, {
                    delay: nativeHapticsDelay ?? contextHaptics.itemDelay,
                });
            }, children: [_jsx(View, { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(ContextMenuPrimitive.ItemIndicator, { children: _jsx(Icon, { as: Check, className: cn(cn("text-foreground shrink-0", menuIconSizeClasses[size]), Platform.select({ web: "pointer-events-none" })) }) }) }), _jsx(_Fragment, { children: children })] }) }));
}
function ContextMenuRadioItem({ className, children, disabled, nativeHaptics, onPress, ...props }) {
    const contextHaptics = React.useContext(ContextMenuHapticsContext);
    const size = React.useContext(ContextMenuContentSizeContext);
    return (_jsx(TextClassContext.Provider, { value: cn(cn(menuTextSizeClasses[size], "text-popover-foreground select-none"), !disabled && "group-active:text-accent-foreground"), children: _jsxs(ContextMenuPrimitive.RadioItem, { className: cn(cn("group relative flex flex-row items-center gap-2 rounded-sm pl-8 pr-2", menuItemPaddingClasses[size]), !disabled && "active:bg-accent", Platform.select({
                web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
            }), disabled && "opacity-50 disabled:active:bg-transparent", className), ...props, disabled: disabled, pointerEvents: disabled ? "none" : props.pointerEvents, onPress: (event) => {
                if (disabled)
                    return;
                onPress?.(event);
                if (!event.defaultPrevented) {
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
                }
            }, children: [_jsx(View, { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(ContextMenuPrimitive.ItemIndicator, { children: _jsx(View, { className: "bg-foreground h-2 w-2 rounded-full" }) }) }), _jsx(_Fragment, { children: children })] }) }));
}
function ContextMenuLabel({ className, inset, ...props }) {
    const size = React.useContext(ContextMenuContentSizeContext);
    return (_jsx(ContextMenuPrimitive.Label, { className: cn(cn("text-foreground px-2 font-medium", menuTextSizeClasses[size], menuItemPaddingClasses[size]), inset && "pl-8", className), ...props }));
}
function ContextMenuSeparator({ className, ...props }) {
    return (_jsx(ContextMenuPrimitive.Separator, { className: cn("bg-border -mx-1 my-1 h-px", className), ...props, 
        // Separators are decoration. Let a drag started here reach the ScrollView.
        pointerEvents: "none" }));
}
function ContextMenuShortcut({ className, ...props }) {
    const size = React.useContext(ContextMenuContentSizeContext);
    return (_jsx(Text, { className: cn("text-muted-foreground ml-auto tracking-widest", menuTextSizeClasses[size], className), ...props }));
}
function ContextMenuItemTitle({ className, ...props }) {
    const size = React.useContext(ContextMenuContentSizeContext);
    return (_jsx(Text, { className: cn(menuTextSizeClasses[size], "text-popover-foreground", className), ...props }));
}
function ContextMenuItemSubtitle({ className, ...props }) {
    const size = React.useContext(ContextMenuContentSizeContext);
    return (_jsx(Text, { className: cn("text-muted-foreground", menuTextSizeClasses[size], className), ...props }));
}
function ContextMenuItemIcon({ children }) {
    return _jsx(_Fragment, { children: children });
}
function ContextMenuItemImage({ children }) {
    return _jsx(_Fragment, { children: children });
}
const ContextMenuItemIndicator = ContextMenuPrimitive.ItemIndicator;
function ContextMenuArrow({ children }) {
    return _jsx(_Fragment, { children: children });
}
function ContextMenuPreview({ children }) {
    return _jsx(_Fragment, { children: children });
}
function ContextMenuAuxiliary({ children }) {
    return _jsx(_Fragment, { children: children });
}
function renderContextMenuItems(items, itemProps, defaultNativeHaptics, depth = 0) {
    return items.map((item, index) => {
        const key = `${depth}:${item.value}:${index}`;
        if (item.separator)
            return _jsx(ContextMenuSeparator, {}, key);
        const label = resolveRenderProp(item.label, item) ?? item.textValue ?? item.value;
        const resolvedItemProps = { ...(itemProps ?? {}), ...(item.itemProps ?? {}) };
        const itemHaptics = item.nativeHaptics ?? defaultNativeHaptics;
        if (item.subMenu?.length) {
            return (_jsxs(ContextMenuSub, { children: [_jsx(ContextMenuSubTrigger, { ...item.triggerProps, disabled: item.disabled ?? item.triggerProps?.disabled, nativeHaptics: itemHaptics, children: _jsx(Text, { children: label }) }), _jsxs(ContextMenuSubContent, { ...item.contentProps, children: [item.subMenuTitle === false ? null : (_jsx(ContextMenuLabel, { children: resolveRenderProp(item.subMenuTitle, item) ?? label })), renderContextMenuItems(item.subMenu, itemProps, defaultNativeHaptics, depth + 1)] })] }, key));
        }
        if (item.checked !== undefined) {
            return (_createElement(ContextMenuCheckboxItem, { ...resolvedItemProps, checked: item.checked, disabled: item.disabled ?? resolvedItemProps.disabled, key: key, nativeHaptics: itemHaptics, onCheckedChange: (checked) => {
                    item.onCheckedChange?.(checked);
                    item.onSelect?.();
                    resolvedItemProps.onCheckedChange?.(checked);
                }, textValue: item.textValue },
                _jsx(Text, { children: label })));
        }
        return (_createElement(ContextMenuItem, { ...resolvedItemProps, disabled: item.disabled ?? resolvedItemProps.disabled, key: key, nativeHaptics: itemHaptics, onPress: item.onSelect ?? item.onPress ?? resolvedItemProps.onPress, textValue: item.textValue, variant: item.destructive ? "destructive" : "default" },
            _jsx(Text, { children: label }),
            resolveRenderProp(item.icon, item),
            resolveRenderProp(item.indicator, item)));
    });
}
function ContextMenu({ children, items, itemProps, itemNativeHaptics, itemNativeHapticsDelay, contentSize, native = Platform.OS !== "web", nativeHaptics, nativeHapticsDelay, nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem, __menuRef, __unsafeIosProps, onOpenChange, onOpenWillChange, trigger, triggerProps, ...props }) {
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    const resolvedItemHaptics = useResolvedNativeHaptics(itemNativeHaptics);
    const resolvedItemHapticsDelay = itemNativeHapticsDelay ?? nativeHapticsDelay;
    if (native && Platform.OS !== "web") {
        return React.createElement(ContextMenuNative, {
            ...props,
            children,
            items,
            itemProps,
            itemNativeHaptics,
            itemNativeHapticsDelay,
            nativeHaptics,
            nativeHapticsDelay,
            nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem,
            __menuRef,
            __unsafeIosProps,
            onOpenChange,
            onOpenWillChange,
            trigger,
            triggerProps,
        });
    }
    const generated = items != null || trigger != null;
    return (_jsx(ContextMenuHapticsContext.Provider, { value: { item: resolvedItemHaptics, itemDelay: resolvedItemHapticsDelay }, children: _jsx(ContextMenuContentSizeContext.Provider, { value: contentSize ?? "default", children: _jsx(ContextMenuPrimitiveRoot, { ...props, onOpenChange: (open) => {
                    onOpenWillChange?.(open);
                    if (open)
                        triggerNativeHaptics(resolvedHaptics);
                    onOpenChange?.(open);
                }, children: generated ? (_jsxs(_Fragment, { children: [trigger != null ? (_jsx(ContextMenuTrigger, { ...triggerProps, asChild: true, children: resolveRenderProp(trigger, { native: false, open: false }) })) : null, items != null ? (_jsx(ContextMenuContent, { itemNativeHaptics: resolvedItemHaptics, children: renderContextMenuItems(items, itemProps, resolvedItemHaptics) })) : null, children] })) : (children) }) }) }));
}
const ContextMenuComponent = Object.assign(ContextMenu, {
    Arrow: ContextMenuArrow,
    Auxiliary: ContextMenuAuxiliary,
    CheckboxItem: ContextMenuCheckboxItem,
    Content: ContextMenuContent,
    Group: ContextMenuGroup,
    Item: ContextMenuItem,
    ItemIcon: ContextMenuItemIcon,
    ItemImage: ContextMenuItemImage,
    ItemIndicator: ContextMenuItemIndicator,
    ItemSubtitle: ContextMenuItemSubtitle,
    ItemTitle: ContextMenuItemTitle,
    Label: ContextMenuLabel,
    Portal: ContextMenuPrimitive.Portal,
    Preview: ContextMenuPreview,
    RadioGroup: ContextMenuRadioGroup,
    RadioItem: ContextMenuRadioItem,
    Root: ContextMenu,
    Separator: ContextMenuSeparator,
    Shortcut: ContextMenuShortcut,
    Sub: ContextMenuSub,
    SubContent: ContextMenuSubContent,
    SubTrigger: ContextMenuSubTrigger,
    Trigger: ContextMenuTrigger,
});
export { ContextMenuComponent as ContextMenu };
