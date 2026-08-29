import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import * as React from "react";
import { Platform, View } from "react-native";
import * as Zeego from "zeego/dropdown-menu";
import { triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
import { resolveRenderProp } from "../utils/render";
import { resolveAndroidMenuItems, resolveIosMenuItemGroups, } from "./dropdown_native_helpers";
import { DropdownDefaultTrigger, DropdownDisabledTrigger, DropdownNativeTrigger } from "./shared";
const NativeDropdownHapticsContext = React.createContext({});
function triggerNativeDropdownItemHaptics(setting) {
    if (Platform.OS === "ios") {
        // iOS 似乎有一定几率丢掉震动
        requestAnimationFrame(() => triggerNativeHaptics(setting));
        return;
    }
    triggerNativeHaptics(setting);
}
function textValue(node) {
    if (typeof node === "string" || typeof node === "number")
        return String(node);
    if (Array.isArray(node))
        return node.map(textValue).join("");
    if (!React.isValidElement(node))
        return "";
    return textValue(node.props.children);
}
function childTextValue(children, component) {
    for (const child of React.Children.toArray(children)) {
        if (!React.isValidElement(child))
            continue;
        if (child.type === component)
            return textValue(child.props.children);
    }
    return undefined;
}
function styleRequestsFullWidth(style) {
    const styles = Array.isArray(style) ? style : [style];
    return styles.some((entry) => {
        if (entry == null || typeof entry !== "object")
            return false;
        const candidate = entry;
        return candidate.width === "100%" || candidate.alignSelf === "stretch";
    });
}
function resolveItemTitleAndSubtitle(children, textValueProp, subtitleProp) {
    return {
        title: textValueProp ?? childTextValue(children, Zeego.ItemTitle) ?? textValue(children),
        subtitle: subtitleProp ?? childTextValue(children, Zeego.ItemSubtitle),
    };
}
function renderItem(item, itemProps, separatorBefore = false, depth = 0) {
    const resolvedItem = { ...itemProps, ...(item.itemProps ?? {}), ...item };
    const label = resolvedItem.textValue ??
        (textValue(resolveRenderProp(resolvedItem.label, resolvedItem)) || resolvedItem.value);
    const accessibilityLabel = resolvedItem["aria-label"] ?? label;
    const iconProps = resolvedItem.iconProps;
    const key = `${depth}:${resolvedItem.value}`;
    const onSelect = resolvedItem.onSelect ?? resolvedItem.onPress;
    const handleSelect = () => {
        onSelect?.();
        triggerNativeDropdownItemHaptics(resolvedItem.nativeHaptics);
    };
    if (resolvedItem.subMenu?.length) {
        const triggerOnSelect = resolvedItem.triggerProps?.onSelect;
        return (_jsxs(Zeego.Sub, { children: [_createElement(Zeego.SubTrigger, { ...resolvedItem.triggerProps, "aria-label": accessibilityLabel, disabled: resolvedItem.disabled, key: `${key}:trigger`, textValue: label, onSelect: () => {
                        triggerOnSelect?.();
                        triggerNativeDropdownItemHaptics(resolvedItem.nativeHaptics);
                    }, ...{ separatorBefore } },
                    _jsx(Zeego.ItemTitle, { children: label }),
                    iconProps ? _jsx(Zeego.ItemIcon, { ...iconProps }) : null), _jsx(Zeego.SubContent, { children: renderItems(resolvedItem.subMenu, itemProps, depth + 1) })] }, key));
    }
    const ItemComponent = Platform.OS === "ios" && resolvedItem.checkbox ? Zeego.CheckboxItem : Zeego.Item;
    return (_jsxs(ItemComponent, { "aria-label": accessibilityLabel, destructive: resolvedItem.destructive, disabled: resolvedItem.disabled, onSelect: () => {
            handleSelect();
        }, ...{ separatorBefore }, ...{ selected: resolvedItem.selected }, ...(resolvedItem.checkbox && Platform.OS === "ios"
            ? {
                value: resolvedItem.selected === true,
                onValueChange: handleSelect,
            }
            : {}), textValue: label, ...(iconProps?.androidIconColor != null
            ? { androidIconColor: iconProps.androidIconColor }
            : {}), children: [_jsx(Zeego.ItemTitle, { children: label }), resolvedItem.subtitle ? (_jsx(Zeego.ItemSubtitle, { children: resolvedItem.subtitle })) : null, iconProps ? _jsx(Zeego.ItemIcon, { ...iconProps }) : null] }, key));
}
function renderItems(items, itemProps, depth = 0) {
    if (Platform.OS === "ios") {
        const groups = resolveIosMenuItemGroups(items);
        // Keep sections and their items in the same order as the data source.
        if (groups.length > 1) {
            return groups.map((group, index) => (_jsx(Zeego.Group, { children: group.map((item) => renderItem(item, itemProps, false, depth)) }, `${depth}:group:${index}`)));
        }
        return (groups[0] ?? []).map((item) => renderItem(item, itemProps, false, depth));
    }
    if (Platform.OS === "android") {
        return resolveAndroidMenuItems(items).map(({ item, separatorBefore }) => renderItem(item, itemProps, separatorBefore, depth));
    }
    return items.map((item) => renderItem(item, itemProps, false, depth));
}
function NativeDropdownRoot({ __nativeDetachedAnchor, __menuRef, children, nativeContentProps, defaultOpen, disabled, items, itemProps, itemNativeHaptics, nativeAnchorAlignment = "center", nativeHaptics, nativeSelectedItemBackgroundColor, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabelProps, nativeTriggerProps, nativeTriggerFeedbackOpacity, nativeTriggerHoverBackground, onOpenChange, onOpenWillChange, open, trigger, triggerClassName, triggerLabel, triggerProps, ...props }) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(Boolean(defaultOpen));
    const [willOpen, setWillOpen] = React.useState(Boolean(defaultOpen));
    const [anchorSize, setAnchorSize] = React.useState({ height: 1, width: 1 });
    const internalMenuRef = React.useRef(null);
    const menuRef = internalMenuRef;
    React.useEffect(() => {
        if (!__menuRef)
            return;
        __menuRef.current = {
            presentMenu: () => internalMenuRef.current?.presentMenu(),
        };
        return () => {
            __menuRef.current = null;
        };
    }, [__menuRef]);
    const haptics = useResolvedNativeHaptics(nativeHaptics);
    // Generated native items follow the dropdown setting by default; callers
    // can still override it with itemNativeHaptics or per-item nativeHaptics.
    const resolvedItemHaptics = useResolvedNativeHaptics(itemNativeHaptics ?? nativeHaptics);
    const resolvedOpen = open ?? uncontrolledOpen;
    // iOS reports the final menu state after the native presentation animation.
    // Use the will-change state for trigger feedback so press/open opacity does
    // not lag behind the actual interaction.
    const triggerOpen = Platform.OS === "ios" ? (open ?? willOpen) : resolvedOpen;
    const generated = items != null || trigger != null || nativeTrigger === true;
    const resolvedDisabled = disabled ?? triggerProps?.disabled;
    const triggerFromProp = trigger != null ? resolveRenderProp(trigger, { native: true, open: triggerOpen }) : null;
    const resolvedTrigger = nativeTrigger ? (React.isValidElement(triggerFromProp) ? (triggerFromProp) : (_jsx(DropdownNativeTrigger, { open: Platform.OS === "ios" ? (open ?? willOpen) : resolvedOpen, className: triggerClassName, containerStyle: nativeTriggerContainerStyle, content: nativeTriggerContent, disabled: resolvedDisabled, icon: nativeTriggerIcon, keepPressedOpacity: Platform.OS === "ios", label: triggerLabel, labelProps: nativeTriggerLabelProps, nativeTriggerProps: nativeTriggerProps, nativeTriggerFeedbackOpacity: nativeTriggerFeedbackOpacity, nativeTriggerHoverBackground: nativeTriggerHoverBackground, pressedOpacity: Platform.OS !== "ios", trigger: trigger }))) : trigger != null ? (triggerFromProp) : items != null ? (_jsx(DropdownDefaultTrigger, { className: triggerClassName, disabled: resolvedDisabled, label: resolveRenderProp(triggerLabel, { native: true, open: resolvedOpen }), props: triggerProps })) : null;
    const handleOpenChange = (nextOpen) => {
        if (resolvedDisabled && nextOpen)
            return;
        if (open === undefined)
            setUncontrolledOpen(nextOpen);
        // On iOS this is the later `onMenuDidHide` callback. `willOpen` is the
        // visual state source, so a stale didHide cannot overwrite a newer
        // willShow transition.
        if (!nextOpen && Platform.OS !== "ios") {
            setWillOpen(false);
        }
        onOpenChange?.(nextOpen);
    };
    const handleOpenWillChange = (nextOpen) => {
        if (resolvedDisabled && nextOpen)
            return;
        setWillOpen(nextOpen);
        // Android native menus do not consistently emit this callback for a
        // trigger press. The press path below provides the feedback there.
        if (nextOpen && Platform.OS !== "android")
            triggerNativeHaptics(haptics);
        onOpenWillChange?.(nextOpen);
    };
    const triggerElementStyle = React.isValidElement(resolvedTrigger)
        ? resolvedTrigger.props.style
        : undefined;
    const triggerPropStyle = triggerProps?.style;
    const composedTriggerStyle = triggerElementStyle == null
        ? triggerPropStyle
        : triggerPropStyle == null
            ? triggerElementStyle
            : [triggerElementStyle, triggerPropStyle];
    const resolvedTriggerProps = {
        ...triggerProps,
        style: composedTriggerStyle,
        onPress: (event) => {
            triggerProps?.onPress?.(event);
            if (!event || !event.defaultPrevented) {
                if (Platform.OS === "android")
                    triggerNativeHaptics(haptics);
            }
            if (isAndroidDetachedTrigger && !resolvedDisabled) {
                menuRef.current?.presentMenu();
            }
        },
        onPressIn: (event) => {
            triggerProps?.onPressIn?.(event);
        },
        onPressOut: (event) => {
            triggerProps?.onPressOut?.(event);
        },
    };
    const resolvedChildren = React.Children.toArray(children).reverse();
    const resolvedTriggerClassName = React.isValidElement(resolvedTrigger)
        ? resolvedTrigger.props.className
        : undefined;
    const triggerUsesFullWidth = [
        triggerClassName,
        triggerProps?.className,
        resolvedTriggerClassName,
        React.isValidElement(resolvedTrigger)
            ? resolvedTrigger.props.props?.className
            : undefined,
    ].some((className) => className?.split(/\s+/).includes("w-full"));
    const triggerUsesFullWidthStyle = styleRequestsFullWidth(triggerProps?.style) ||
        (React.isValidElement(resolvedTrigger) &&
            (styleRequestsFullWidth(resolvedTrigger.props.style) ||
                styleRequestsFullWidth(resolvedTrigger.props.props?.style)));
    // Keep the visible trigger separate from MenuView for Android native
    // triggers and compact Select triggers. Otherwise the popup anchor can
    // cause the parent ScrollView to reposition near the bottom of the page.
    const isAndroidDetachedTrigger = Platform.OS === "android" && (nativeTrigger === true || __nativeDetachedAnchor === true);
    const { style: rootStyle, ...rootProps } = props;
    const nativeAnchorStyle = isAndroidDetachedTrigger
        ? { alignSelf: "flex-start", height: anchorSize.height, width: anchorSize.width }
        : null;
    const menu = (_jsx(Zeego.Root, { ...rootProps, ...{
            style: [
                { flexGrow: 0 },
                nativeAnchorStyle ??
                    (triggerUsesFullWidth || triggerUsesFullWidthStyle
                        ? { alignSelf: "stretch", width: "100%" }
                        : { alignSelf: "flex-start" }),
                rootStyle,
            ],
        }, ...(defaultOpen === undefined ? {} : { defaultOpen }), ...(open === undefined ? {} : { open }), ...{
            __menuRef: menuRef,
            anchorAlignment: nativeAnchorAlignment,
            isAnchoredToRight: nativeAnchorAlignment === "end",
            selectedItemBackgroundColor: nativeSelectedItemBackgroundColor,
        }, onOpenChange: handleOpenChange, ...{ onOpenWillChange: handleOpenWillChange }, children: generated ? (_jsxs(_Fragment, { children: [resolvedTrigger != null ? (_jsx(Zeego.Trigger, { asChild: true, ...(isAndroidDetachedTrigger
                        ? { style: { height: anchorSize.height, width: anchorSize.width } }
                        : resolvedTriggerProps), disabled: resolvedDisabled ?? undefined, children: isAndroidDetachedTrigger ? (_jsx(View, { collapsable: false, style: { height: anchorSize.height, width: anchorSize.width } })) : resolvedTrigger })) : null, items != null ? (_jsx(Zeego.Content, { ...nativeContentProps, children: renderItems(items, { nativeHaptics: resolvedItemHaptics, ...itemProps }) })) : null, resolvedChildren] })) : (resolvedChildren) }));
    if (isAndroidDetachedTrigger && resolvedTrigger != null && !resolvedDisabled) {
        const triggerElement = resolvedTrigger;
        const originalOnLayout = triggerElement.props.onLayout;
        const originalOnPress = triggerElement.props.onPress;
        const { onLayout: _triggerLayout, onPress: _triggerPress, ...triggerPropsForVisibleElement } = resolvedTriggerProps;
        const visibleTrigger = React.cloneElement(triggerElement, {
            ...triggerPropsForVisibleElement,
            onLayout: (event) => {
                originalOnLayout?.(event);
                const nextWidth = event?.nativeEvent?.layout?.width;
                const nextHeight = event?.nativeEvent?.layout?.height;
                if (typeof nextWidth === "number" && typeof nextHeight === "number") {
                    setAnchorSize((previous) => Math.abs(previous.width - nextWidth) < 0.5 &&
                        Math.abs(previous.height - nextHeight) < 0.5
                        ? previous
                        : { width: nextWidth, height: nextHeight });
                }
            },
            onPress: (event) => {
                originalOnPress?.(event);
                if (!event?.defaultPrevented && Platform.OS === "android") {
                    triggerNativeHaptics(haptics);
                }
                if (!event?.defaultPrevented)
                    menuRef.current?.presentMenu();
            },
        });
        return (_jsx(NativeDropdownHapticsContext.Provider, { value: { item: resolvedItemHaptics }, children: _jsxs(View, { style: { position: "relative" }, children: [visibleTrigger, _jsx(View, { pointerEvents: "none", style: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }, children: menu })] }) }));
    }
    return (_jsx(NativeDropdownHapticsContext.Provider, { value: { item: resolvedItemHaptics }, children: resolvedDisabled ? (_jsx(DropdownDisabledTrigger, { children: resolvedTrigger })) : (menu) }));
}
const NativeDropdownTrigger = Zeego.Trigger;
const NativeDropdownGroup = Zeego.Group;
const NativeDropdownPortal = React.Fragment;
const NativeDropdownSub = Zeego.Sub;
const RadioContext = React.createContext({});
function NativeDropdownRadioGroup({ children, onValueChange, value, }) {
    return _jsx(RadioContext.Provider, { value: { onValueChange, value }, children: children });
}
function NativeDropdownContent({ children, ...props }) {
    return _jsx(Zeego.Content, { ...props, children: children });
}
function NativeDropdownSubContent({ children, ...props }) {
    return _jsx(Zeego.SubContent, { ...props, children: children });
}
function NativeDropdownSubTrigger({ children, disabled, nativeHaptics, onPress, onSelect, ...props }) {
    const contextHaptics = React.useContext(NativeDropdownHapticsContext);
    const { title: label, subtitle } = resolveItemTitleAndSubtitle(children, props.textValue, props.subtitle);
    return (_jsxs(Zeego.SubTrigger, { ...props, disabled: disabled, onSelect: () => {
            onPress?.();
            onSelect?.();
            triggerNativeDropdownItemHaptics(nativeHaptics ?? contextHaptics.item);
        }, textValue: label, children: [_jsx(Zeego.ItemTitle, { children: label }), subtitle ? _jsx(Zeego.ItemSubtitle, { children: subtitle }) : null] }));
}
function NativeDropdownItem({ children, nativeHaptics, onPress, onSelect, variant, ...props }) {
    const contextHaptics = React.useContext(NativeDropdownHapticsContext);
    const { title: label, subtitle } = resolveItemTitleAndSubtitle(children, props.textValue, props.subtitle);
    return (_jsxs(Zeego.Item, { ...props, destructive: variant === "destructive" || props.destructive, onSelect: () => {
            (onSelect ?? onPress)?.();
            triggerNativeDropdownItemHaptics(nativeHaptics ?? contextHaptics.item);
        }, textValue: label, children: [_jsx(Zeego.ItemTitle, { children: label }), subtitle ? _jsx(Zeego.ItemSubtitle, { children: subtitle }) : null] }));
}
function NativeDropdownCheckboxItem({ checked, children, onCheckedChange, nativeHaptics, onValueChange, value, ...props }) {
    const contextHaptics = React.useContext(NativeDropdownHapticsContext);
    const { title: label, subtitle } = resolveItemTitleAndSubtitle(children, props.textValue, props.subtitle);
    const resolvedValue = value ?? (checked ? "on" : "off");
    return (_jsxs(Zeego.CheckboxItem, { ...props, onValueChange: (next, previous) => {
            triggerNativeDropdownItemHaptics(nativeHaptics ?? contextHaptics.item);
            onValueChange?.(next, previous);
            onCheckedChange?.(next === "on");
        }, textValue: label, value: resolvedValue, children: [_jsx(Zeego.ItemTitle, { children: label }), subtitle ? _jsx(Zeego.ItemSubtitle, { children: subtitle }) : null] }));
}
function NativeDropdownRadioItem({ children, value, ...props }) {
    const radio = React.useContext(RadioContext);
    return (_jsx(NativeDropdownCheckboxItem, { ...props, checked: radio.value === value, onCheckedChange: (checked) => checked && radio.onValueChange?.(value), children: children }));
}
function NativeDropdownLabel({ children, ...props }) {
    const label = props.textValue ?? textValue(children);
    return (_jsx(Zeego.Label, { ...props, textValue: label, children: label }));
}
const NativeDropdownSeparator = Zeego.Separator;
function NativeDropdownShortcut() {
    return null;
}
export const DropdownNative = Object.assign(NativeDropdownRoot, {
    CheckboxItem: NativeDropdownCheckboxItem,
    Content: NativeDropdownContent,
    Group: NativeDropdownGroup,
    Item: NativeDropdownItem,
    Label: NativeDropdownLabel,
    Portal: NativeDropdownPortal,
    RadioGroup: NativeDropdownRadioGroup,
    RadioItem: NativeDropdownRadioItem,
    Root: NativeDropdownRoot,
    Separator: NativeDropdownSeparator,
    Shortcut: NativeDropdownShortcut,
    Sub: NativeDropdownSub,
    SubContent: NativeDropdownSubContent,
    SubTrigger: NativeDropdownSubTrigger,
    Trigger: NativeDropdownTrigger,
});
// Keep the implementation name available for internal platform consumers.
export const NativeDropdown = DropdownNative;
