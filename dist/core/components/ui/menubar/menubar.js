import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from "../icon";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { semanticColorsToVariables, useUiTheme } from "../utils/theme";
import { resolveRenderProp, triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
import * as MenubarPrimitive from "@rn-primitives/menubar";
import { Portal } from "@rn-primitives/portal";
import { Check, ChevronDown, ChevronRight, ChevronUp } from "lucide-react-native";
import * as React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions, } from "react-native";
import { FadeIn, ReduceMotion } from "react-native-reanimated";
import { menuIconSizeClasses, menuItemPaddingClasses, menuTextSizeClasses, } from "../utils/menu_size";
const MENUBAR_MENU_MAX_HEIGHT_RATIO = 0.45;
const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
function MenubarPortal({ hostName, ...props }) {
    const scopedPortalHost = useScopedOverlayPortalHostName();
    return _jsx(MenubarPrimitive.Portal, { ...props, hostName: hostName ?? scopedPortalHost });
}
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
const MenubarHapticsContext = React.createContext({});
const MenubarSizeContext = React.createContext("default");
const MenubarContentSizeContext = React.createContext("default");
const menubarRootSizeClasses = {
    "default": "h-11 p-1.5",
    "2xs": "h-8 p-0.5",
    "xs": "h-9 p-0.5",
    "sm": "h-10 p-1",
    "md": "h-11 p-1.5",
    "lg": "h-12 p-1.5",
    "xl": "h-14 p-2",
    "2xl": "h-16 p-2",
};
// Native text metrics are tighter than the browser's default line box. Keep
// the main triggers on predictable line heights so their labels stay centered
// at every menu size.
const menubarTriggerTextSizeClasses = {
    default: "text-base leading-6",
    "2xs": "text-[10px] leading-3.5",
    xs: "text-xs leading-4",
    sm: "text-sm leading-5",
    md: "text-base leading-6",
    lg: "text-lg leading-7",
    xl: "text-xl leading-7",
    "2xl": "text-2xl leading-8",
};
const menubarTriggerSizeClasses = {
    "default": "px-2.5 py-1.5",
    "2xs": "px-1.5 py-0.5",
    "xs": "px-2 py-1",
    "sm": "px-2 py-1",
    "md": "px-2.5 py-1.5",
    "lg": "px-3 py-2",
    "xl": "px-4 py-2.5",
    "2xl": "px-5 py-3",
};
function normalizeMenubarChildren(children) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
}
function MenubarRoot({ children, className, items, size = "default", contentSize = "default", nativeHaptics, itemNativeHaptics, value: valueProp, onValueChange: onValueChangeProp, ...props }) {
    const id = React.useId();
    const scopedPortalHost = useScopedOverlayPortalHostName();
    const [value, setValue] = React.useState(undefined);
    const resolvedTriggerHaptics = useResolvedNativeHaptics(nativeHaptics);
    const resolvedItemHaptics = useResolvedNativeHaptics(itemNativeHaptics);
    function closeMenu() {
        if (onValueChangeProp) {
            onValueChangeProp(undefined);
            return;
        }
        setValue(undefined);
    }
    const renderedChildren = children ??
        (items != null
            ? items.map((menu) => (_jsxs(MenubarNamespace.Menu, { value: menu.value, children: [_jsx(MenubarNamespace.Trigger, { ...menu.triggerProps, nativeHaptics: menu.nativeHaptics, children: normalizeMenubarChildren(resolveRenderProp(menu.title, { value: menu.value })) }), _jsx(MenubarNamespace.Content, { ...menu.contentProps, children: menu.items.map((item, index) => renderMenubarItem(item, `${menu.value}-${index}`, itemNativeHaptics)) })] }, menu.value)))
            : null);
    return (_jsx(MenubarSizeContext.Provider, { value: size, children: _jsx(MenubarContentSizeContext.Provider, { value: contentSize, children: _jsxs(MenubarHapticsContext.Provider, { value: { trigger: resolvedTriggerHaptics, item: resolvedItemHaptics }, children: [Platform.OS !== "web" && (value || valueProp) ? (_jsx(Portal, { hostName: scopedPortalHost, name: `menubar-overlay-${id}`, children: _jsx(Pressable, { onPress: closeMenu, style: StyleSheet.absoluteFill }) })) : null, _jsx(MenubarPrimitive.Root, { className: cn("bg-background border-border flex flex-row items-center gap-1 rounded-md border shadow-sm shadow-black/5", menubarRootSizeClasses[size], Platform.select({ native: "p-1" }), className), value: value ?? valueProp, onValueChange: onValueChangeProp ?? setValue, ...props, children: renderedChildren })] }) }) }));
}
function MenubarTrigger({ className, cursorDefault = true, size: sizeProp, nativeHaptics, onPress, ...props }) {
    const { value } = MenubarPrimitive.useRootContext();
    const { value: itemValue } = MenubarPrimitive.useMenuContext();
    const contextHaptics = React.useContext(MenubarHapticsContext);
    const size = sizeProp ?? React.useContext(MenubarSizeContext);
    const hasCursorOverride = className?.split(/\s+/).some((token) => token.startsWith("cursor-"));
    return (_jsx(TextClassContext.Provider, { value: cn(cn(menubarTriggerTextSizeClasses[size], "font-medium select-none group-active:text-accent-foreground"), value === itemValue && "text-accent-foreground"), children: _jsx(MenubarPrimitive.Trigger, { className: cn(cn("group flex items-center rounded-md", menubarTriggerSizeClasses[size]), Platform.select({
                web: cn("hover:bg-accent hover:text-accent-foreground outline-none", cursorDefault && !hasCursorOverride && "!cursor-default"),
            }), value === itemValue && "bg-accent", className), ...props, onPress: (event) => {
                onPress?.(event);
                if (!event.defaultPrevented) {
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.trigger);
                }
            } }) }));
}
function MenubarSubTrigger({ className, inset, children, iconClassName, nativeHaptics, onPress, ...props }) {
    const { open } = MenubarPrimitive.useSubContext();
    const contextHaptics = React.useContext(MenubarHapticsContext);
    const size = React.useContext(MenubarContentSizeContext);
    const disabled = props.disabled === true;
    const icon = Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;
    return (_jsx(TextClassContext.Provider, { value: cn(cn(menuTextSizeClasses[size], "select-none"), !disabled && "group-active:text-accent-foreground", open && "text-accent-foreground"), children: _jsxs(MenubarPrimitive.SubTrigger, { className: cn(cn("group flex flex-row items-center justify-between rounded-sm px-2", menuItemPaddingClasses[size]), !disabled && "active:bg-accent", Platform.select({
                web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none [&_svg]:pointer-events-none",
            }), className, open && "bg-accent", inset && "pl-8"), ...props, pointerEvents: disabled ? "none" : props.pointerEvents, onPress: (event) => {
                if (disabled)
                    return;
                onPress?.(event);
                if (!event.defaultPrevented) {
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
                }
            }, children: [normalizeMenubarChildren(children), _jsx(Icon, { as: icon, className: cn("text-foreground shrink-0", menuIconSizeClasses[size], iconClassName) })] }) }));
}
function MenubarSubContent({ className, children, size: sizeProp, style, ...props }) {
    const theme = useUiTheme();
    const size = sizeProp ?? React.useContext(MenubarContentSizeContext);
    return (_jsx(NativeOnlyAnimatedView, { entering: FadeIn.reduceMotion(ReduceMotion.System), children: _jsx(MenubarPrimitive.SubContent, { className: cn("bg-popover border-border overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5", Platform.select({
                web: "animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fade-in-0 data-[state=closed]:zoom-out-95 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin) z-50 min-w-[8rem] max-h-[45vh] overflow-y-auto ui-menu-scrollbar",
            }), className), 
            // The web primitive renders SubContent through its own Radix portal,
            // outside the provider-scoped variables applied by OverlayPortalWindow.
            style: [Platform.OS === "web" ? semanticColorsToVariables(theme) : null, style], ...props, children: _jsx(MenubarContentSizeContext.Provider, { value: size, children: _jsx(TextClassContext.Provider, { value: cn("text-popover-foreground", menuTextSizeClasses[size]), children: children }) }) }) }));
}
function MenubarContent({ className, children, overlayClassName, overlayStyle, portalHost, size: sizeProp, align = "start", alignOffset = -4, sideOffset = 8, style, ...props }) {
    const { height: windowHeight } = useWindowDimensions();
    const { triggerPosition, contentLayout } = MenubarPrimitive.useRootContext();
    const availableAbove = triggerPosition?.pageY ?? 0;
    const availableBelow = triggerPosition
        ? windowHeight - triggerPosition.pageY - triggerPosition.height
        : windowHeight;
    const estimatedHeight = contentLayout?.height ?? windowHeight * MENUBAR_MENU_MAX_HEIGHT_RATIO;
    const resolvedSide = Platform.OS === "web" || props.side != null
        ? props.side
        : availableBelow < estimatedHeight && availableAbove > availableBelow
            ? "top"
            : "bottom";
    const scopedPortalHost = useScopedOverlayPortalHostName();
    const resolvedPortalHost = portalHost ?? scopedPortalHost;
    const contentStyle = useOverlayPortalContentStyle(style);
    const size = sizeProp ?? React.useContext(MenubarContentSizeContext);
    return (_jsx(MenubarPrimitive.Portal, { hostName: resolvedPortalHost, children: _jsx(OverlayPortalWindow, { portalHost: resolvedPortalHost, children: _jsx(NativeOnlyAnimatedView, { as: "View", accessible: false, entering: FadeIn.reduceMotion(ReduceMotion.System), style: StyleSheet.absoluteFill, pointerEvents: "box-none", children: _jsx(TextClassContext.Provider, { value: cn("text-popover-foreground", menuTextSizeClasses[size]), children: _jsx(MenubarPrimitive.Content, { style: [{ maxHeight: windowHeight * MENUBAR_MENU_MAX_HEIGHT_RATIO }, contentStyle], className: cn("bg-popover border-border max-h-[45vh] min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5", Platform.select({
                            web: cn("animate-in fade-in-0 zoom-in-95 max-h-[45vh] overflow-y-auto origin-(--radix-context-menu-content-transform-origin) z-50 cursor-default ui-menu-scrollbar", props.side === "bottom" && "slide-in-from-top-2", props.side === "top" && "slide-in-from-bottom-2"),
                        }), className), align: align, alignOffset: alignOffset, sideOffset: sideOffset, ...props, asChild: true, side: resolvedSide, onStartShouldSetResponder: () => false, children: _jsx(View, { collapsable: false, children: Platform.OS === "web" ? (_jsx(MenubarContentSizeContext.Provider, { value: size, children: children })) : (_jsx(ScrollView, { nestedScrollEnabled: true, showsVerticalScrollIndicator: true, onMoveShouldSetResponderCapture: () => true, style: { maxHeight: windowHeight * MENUBAR_MENU_MAX_HEIGHT_RATIO }, children: _jsx(MenubarContentSizeContext.Provider, { value: size, children: children }) })) }) }) }) }) }) }));
}
function MenubarItem({ className, disabled, inset, variant, nativeHaptics, onPress, ...props }) {
    const contextHaptics = React.useContext(MenubarHapticsContext);
    const size = React.useContext(MenubarContentSizeContext);
    return (_jsx(TextClassContext.Provider, { value: cn(cn(menuTextSizeClasses[size], "select-none text-popover-foreground"), !disabled && "group-active:text-popover-foreground", variant === "destructive" && "text-destructive", variant === "destructive" && !disabled && "group-active:text-destructive"), children: _jsx(MenubarPrimitive.Item, { className: cn(cn("group relative flex flex-row items-center gap-2 rounded-sm px-2", menuItemPaddingClasses[size]), !disabled && "active:bg-accent", Platform.select({
                web: cn("focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none", variant === "destructive" && "focus:bg-destructive/10 dark:focus:bg-destructive/20"),
            }), !disabled &&
                variant === "destructive" &&
                "active:bg-destructive/10 dark:active:bg-destructive/20", disabled && "opacity-50", inset && "pl-8", className), ...props, disabled: disabled, pointerEvents: disabled ? "none" : props.pointerEvents, onPress: (event) => {
                if (disabled)
                    return;
                onPress?.(event);
                if (!event.defaultPrevented) {
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
                }
            } }) }));
}
function MenubarCheckboxItem({ className, children, disabled, nativeHaptics, onCheckedChange, ...props }) {
    const contextHaptics = React.useContext(MenubarHapticsContext);
    const size = React.useContext(MenubarContentSizeContext);
    return (_jsx(TextClassContext.Provider, { value: cn(cn(menuTextSizeClasses[size], "text-popover-foreground select-none"), !disabled && "group-active:text-accent-foreground"), children: _jsxs(MenubarPrimitive.CheckboxItem, { className: cn(cn("group relative flex flex-row items-center gap-2 rounded-sm pl-8 pr-2", menuItemPaddingClasses[size]), !disabled && "active:bg-accent", Platform.select({
                web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
            }), disabled && "opacity-50", className), ...props, disabled: disabled, pointerEvents: disabled ? "none" : props.pointerEvents, onCheckedChange: (checked) => {
                if (disabled)
                    return;
                onCheckedChange?.(checked);
                triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
            }, children: [_jsx(View, { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(MenubarPrimitive.ItemIndicator, { children: _jsx(Icon, { as: Check, className: cn(cn("text-foreground shrink-0", menuIconSizeClasses[size]), Platform.select({ web: "pointer-events-none" })) }) }) }), normalizeMenubarChildren(children)] }) }));
}
function MenubarRadioItem({ className, children, disabled, nativeHaptics, onPress, ...props }) {
    const contextHaptics = React.useContext(MenubarHapticsContext);
    const size = React.useContext(MenubarContentSizeContext);
    return (_jsx(TextClassContext.Provider, { value: cn(cn(menuTextSizeClasses[size], "text-popover-foreground select-none"), !disabled && "group-active:text-accent-foreground"), children: _jsxs(MenubarPrimitive.RadioItem, { className: cn(cn("group relative flex flex-row items-center gap-2 rounded-sm pl-8 pr-2", menuItemPaddingClasses[size]), !disabled && "active:bg-accent", Platform.select({
                web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
            }), disabled && "opacity-50", className), ...props, disabled: disabled, pointerEvents: disabled ? "none" : props.pointerEvents, onPress: (event) => {
                if (disabled)
                    return;
                onPress?.(event);
                if (!event.defaultPrevented) {
                    triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
                }
            }, children: [_jsx(View, { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(MenubarPrimitive.ItemIndicator, { children: _jsx(View, { className: "bg-foreground h-2 w-2 rounded-full" }) }) }), normalizeMenubarChildren(children)] }) }));
}
function MenubarLabel({ className, inset, ...props }) {
    const size = React.useContext(MenubarContentSizeContext);
    return (_jsx(MenubarPrimitive.Label, { className: cn(cn("text-foreground px-2 font-medium", menuTextSizeClasses[size], menuItemPaddingClasses[size]), inset && "pl-8", className), ...props }));
}
function MenubarSeparator({ className, ...props }) {
    return (_jsx(MenubarPrimitive.Separator, { className: cn("bg-border -mx-1 my-1 h-px", className), ...props, pointerEvents: "none" }));
}
function MenubarShortcut({ className, ...props }) {
    const size = React.useContext(MenubarContentSizeContext);
    return (_jsx(Text, { className: cn("text-muted-foreground ml-auto tracking-widest", menuTextSizeClasses[size], className), ...props }));
}
function MenubarDataItem({ item, itemKey, defaultNativeHaptics, }) {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(item.defaultChecked ?? false);
    const checked = item.checked ?? uncontrolledChecked;
    const context = {
        checked,
        disabled: item.disabled,
        value: item.value,
    };
    const title = normalizeMenubarChildren(resolveRenderProp(item.title ?? item.children, context));
    const shortcut = normalizeMenubarChildren(resolveRenderProp(item.shortcut, context));
    const itemHaptics = item.nativeHaptics ?? defaultNativeHaptics;
    if (item.type === "separator") {
        return _jsx(MenubarNamespace.Separator, { ...item.separatorProps });
    }
    if (item.type === "label") {
        return (_jsx(MenubarNamespace.Label, { ...item.labelProps, inset: item.inset, children: title }));
    }
    if (item.type === "submenu") {
        return (_jsxs(MenubarNamespace.Sub, { ...item.submenuProps, children: [_jsx(MenubarNamespace.SubTrigger, { disabled: item.disabled, inset: item.inset, nativeHaptics: itemHaptics, children: title }), _jsx(MenubarNamespace.SubContent, { ...item.contentProps, children: item.items?.map((child, index) => (_jsx(MenubarDataItem, { defaultNativeHaptics: defaultNativeHaptics, item: child, itemKey: `${itemKey}-${index}` }, `${itemKey}-${index}`))) })] }));
    }
    if (item.type === "checkbox") {
        return (_jsxs(MenubarNamespace.CheckboxItem, { ...item.checkboxProps, checked: checked, disabled: item.disabled ?? item.checkboxProps?.disabled, nativeHaptics: itemHaptics, onCheckedChange: (nextChecked) => {
                if (item.checked === undefined)
                    setUncontrolledChecked(nextChecked);
                item.onCheckedChange?.(nextChecked);
            }, children: [title, shortcut != null ? (_jsx(MenubarNamespace.Shortcut, { children: shortcut })) : null] }));
    }
    if (item.type === "radio-group") {
        return (_jsx(MenubarNamespace.RadioGroup, { ...item.radioGroupProps, onValueChange: item.radioGroupProps?.onValueChange ?? (() => undefined), value: item.radioGroupProps?.value, children: item.items?.map((child, index) => (_jsx(MenubarDataItem, { defaultNativeHaptics: defaultNativeHaptics, item: child, itemKey: `${itemKey}-${index}` }, `${itemKey}-${index}`))) }));
    }
    if (item.type === "radio") {
        return (_jsxs(MenubarNamespace.RadioItem, { ...item.radioItemProps, disabled: item.disabled ?? item.radioItemProps?.disabled, nativeHaptics: itemHaptics, value: item.value ?? itemKey, children: [title, shortcut != null ? (_jsx(MenubarNamespace.Shortcut, { children: shortcut })) : null] }));
    }
    return (_jsxs(MenubarNamespace.Item, { ...item.itemProps, disabled: item.disabled ?? item.itemProps?.disabled, inset: item.inset, nativeHaptics: itemHaptics, children: [title, shortcut != null ? _jsx(MenubarNamespace.Shortcut, { children: shortcut }) : null] }));
}
function renderMenubarItem(item, itemKey, defaultNativeHaptics) {
    return (_jsx(MenubarDataItem, { defaultNativeHaptics: defaultNativeHaptics, item: item, itemKey: itemKey }, itemKey));
}
const MenubarNamespace = {
    CheckboxItem: MenubarCheckboxItem,
    Content: MenubarContent,
    Group: MenubarGroup,
    Item: MenubarItem,
    Label: MenubarLabel,
    Menu: MenubarMenu,
    Portal: MenubarPortal,
    RadioGroup: MenubarRadioGroup,
    RadioItem: MenubarRadioItem,
    Root: MenubarRoot,
    Separator: MenubarSeparator,
    Shortcut: MenubarShortcut,
    Sub: MenubarSub,
    SubContent: MenubarSubContent,
    SubTrigger: MenubarSubTrigger,
    Trigger: MenubarTrigger,
};
const Menubar = Object.assign(MenubarRoot, MenubarNamespace);
export { Menubar };
