import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { Platform } from "react-native";
import * as Zeego from "zeego/context-menu";
import { triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
import { resolveRenderProp } from "../utils/render";
function splitMenuItemsBySeparators(items) {
    const groups = [];
    let currentGroup = [];
    for (const item of items) {
        if (item.separator) {
            if (currentGroup.length > 0)
                groups.push(currentGroup);
            currentGroup = [];
            continue;
        }
        currentGroup.push(item);
    }
    if (currentGroup.length > 0)
        groups.push(currentGroup);
    return groups;
}
function resolveAndroidMenuItems(items) {
    const resolvedItems = [];
    let separatorBefore = false;
    for (const item of items) {
        if (item.separator) {
            if (resolvedItems.length > 0)
                separatorBefore = true;
            continue;
        }
        resolvedItems.push({ item, separatorBefore });
        separatorBefore = false;
    }
    return resolvedItems;
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
function resolveItemTitleAndSubtitle(children, textValueProp, subtitleProp) {
    return {
        title: textValueProp ?? childTextValue(children, Zeego.ItemTitle) ?? textValue(children),
        subtitle: subtitleProp ?? childTextValue(children, Zeego.ItemSubtitle),
    };
}
const NativeContextMenuHapticsContext = React.createContext({});
function renderItems(items, itemProps, defaultNativeHaptics, defaultNativeHapticsDelay, depth = 0) {
    if (Platform.OS === "ios") {
        const groups = splitMenuItemsBySeparators(items);
        if (groups.length > 1) {
            return groups.map((group, index) => (_jsx(Zeego.Group, { children: renderItems(group, itemProps, defaultNativeHaptics, defaultNativeHapticsDelay, depth + 1) }, `${depth}:group:${index}`)));
        }
        items = groups[0] ?? [];
    }
    const resolvedItems = Platform.OS === "android"
        ? resolveAndroidMenuItems(items)
        : items.map((item) => ({ item, separatorBefore: false }));
    return resolvedItems.map(({ item, separatorBefore }, index) => {
        const key = `${depth}:${item.value}:${index}`;
        if (item.separator)
            return _jsx(Zeego.Separator, {}, key);
        const resolvedItem = { ...(itemProps ?? {}), ...(item.itemProps ?? {}), ...item };
        const label = resolvedItem.textValue ??
            (textValue(resolveRenderProp(resolvedItem.label, resolvedItem)) || resolvedItem.value);
        const itemHaptics = resolvedItem.nativeHaptics ?? defaultNativeHaptics;
        const itemHapticsDelay = resolvedItem.nativeHapticsDelay ?? defaultNativeHapticsDelay;
        if (resolvedItem.subMenu?.length) {
            return (_createElement(Zeego.Sub, { ...resolvedItem.subMenuProps, key: key },
                _createElement(Zeego.SubTrigger, { ...resolvedItem.triggerProps, "aria-label": resolvedItem["aria-label"] ?? label, disabled: resolvedItem.disabled, key: `${key}:trigger`, onSelect: () => {
                        triggerNativeHaptics(itemHaptics, { delay: itemHapticsDelay });
                        resolvedItem.triggerProps?.onSelect?.();
                    }, textValue: label },
                    _jsx(Zeego.ItemTitle, { children: label }),
                    resolvedItem.iconProps ? _jsx(Zeego.ItemIcon, { ...resolvedItem.iconProps }) : null),
                _jsxs(Zeego.SubContent, { ...resolvedItem.contentProps, children: [resolvedItem.subMenuTitle === false ? null : resolvedItem.subMenuTitle ? (_jsx(Zeego.Label, { textValue: textValue(resolveRenderProp(resolvedItem.subMenuTitle, resolvedItem)), children: textValue(resolveRenderProp(resolvedItem.subMenuTitle, resolvedItem)) })) : null, renderItems(resolvedItem.subMenu, itemProps, defaultNativeHaptics, defaultNativeHapticsDelay, depth + 1)] })));
        }
        if (resolvedItem.checked !== undefined) {
            return (_createElement(Zeego.CheckboxItem, { ...resolvedItem.itemProps, "aria-label": resolvedItem["aria-label"] ?? label, disabled: resolvedItem.disabled, key: key, onValueChange: (next, previous) => {
                    triggerNativeHaptics(itemHaptics, { delay: itemHapticsDelay });
                    resolvedItem.onCheckedChange?.(next === "on");
                    resolvedItem.onSelect?.();
                    resolvedItem.itemProps?.onValueChange?.(next, previous);
                }, textValue: label, value: resolvedItem.checked ? "on" : "off" },
                _jsx(Zeego.ItemTitle, { children: label })));
        }
        return (_createElement(Zeego.Item, { ...resolvedItem.itemProps, "aria-label": resolvedItem["aria-label"] ?? label, destructive: resolvedItem.destructive, disabled: resolvedItem.disabled, key: key, onSelect: () => {
                triggerNativeHaptics(itemHaptics, { delay: itemHapticsDelay });
                (resolvedItem.onSelect ?? resolvedItem.onPress)?.();
                resolvedItem.itemProps?.onSelect?.();
            }, ...{ separatorBefore }, ...{ selected: resolvedItem.selected }, textValue: label },
            _jsx(Zeego.ItemTitle, { children: label }),
            resolvedItem.subtitle ? (_jsx(Zeego.ItemSubtitle, { children: resolvedItem.subtitle })) : null,
            resolvedItem.iconProps ? _jsx(Zeego.ItemIcon, { ...resolvedItem.iconProps }) : null));
    });
}
function ContextMenu({ children, items, itemProps, itemNativeHaptics, itemNativeHapticsDelay, nativeHaptics, nativeHapticsDelay, onOpenChange, onOpenWillChange, trigger, triggerProps, nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem, __menuRef, __unsafeIosProps, ...props }) {
    const haptics = useResolvedNativeHaptics(nativeHaptics);
    const itemHaptics = useResolvedNativeHaptics(itemNativeHaptics);
    const itemHapticsDelay = itemNativeHapticsDelay ?? nativeHapticsDelay;
    const generated = items != null || trigger != null;
    return (_jsx(NativeContextMenuHapticsContext.Provider, { value: { item: itemHaptics, itemDelay: itemHapticsDelay }, children: _jsx(Zeego.Root, { ...props, ...{ __menuRef }, ...(Platform.OS === "ios"
                ? {
                    __unsafeIosProps: {
                        ...__unsafeIosProps,
                        shouldWaitForMenuToHideBeforeFiringOnPressMenuItem: nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem ?? false,
                    },
                }
                : __unsafeIosProps == null
                    ? {}
                    : { __unsafeIosProps }), onOpenChange: (open) => {
                if (open && Platform.OS === "android")
                    triggerNativeHaptics(haptics);
                onOpenChange?.(open);
            }, ...{ onOpenWillChange }, children: generated ? (_jsxs(_Fragment, { children: [trigger != null ? (_jsx(Zeego.Trigger, { ...{ action: "longPress", ...triggerProps }, children: resolveRenderProp(trigger, { native: true, open: false }) })) : null, items != null ? (_jsx(Zeego.Content, { children: renderItems(items, {
                            nativeHaptics: itemHaptics,
                            nativeHapticsDelay: itemHapticsDelay,
                            ...itemProps,
                        }, itemHaptics, itemHapticsDelay) })) : null, children] })) : (children) }) }));
}
function ContextMenuTrigger({ children, ...props }) {
    return (_jsx(Zeego.Trigger, { ...{ action: "longPress", ...props }, children: children }));
}
const ContextMenuGroup = Zeego.Group;
const ContextMenuSub = Zeego.Sub;
const ContextMenuPortal = React.Fragment;
const ContextMenuSeparator = Zeego.Separator;
const ContextMenuPreview = Zeego.Preview;
const ContextMenuAuxiliary = Zeego.Auxiliary;
function ContextMenuContent({ children, ...props }) {
    return _jsx(Zeego.Content, { ...props, children: children });
}
function ContextMenuSubContent({ children, ...props }) {
    return _jsx(Zeego.SubContent, { ...props, children: children });
}
function ContextMenuSubTrigger({ children, ...props }) {
    const contextHaptics = React.useContext(NativeContextMenuHapticsContext);
    const { title: label, subtitle } = resolveItemTitleAndSubtitle(children, props.textValue, props.subtitle);
    return (_jsxs(Zeego.SubTrigger, { ...props, onSelect: () => {
            triggerNativeHaptics(props.nativeHaptics ?? contextHaptics.item, {
                delay: props.nativeHapticsDelay ?? contextHaptics.itemDelay,
            });
            props.onSelect?.();
        }, textValue: label, children: [_jsx(Zeego.ItemTitle, { children: label }), subtitle ? _jsx(Zeego.ItemSubtitle, { children: subtitle }) : null] }));
}
function ContextMenuItem({ children, variant, ...props }) {
    const contextHaptics = React.useContext(NativeContextMenuHapticsContext);
    const { title: label, subtitle } = resolveItemTitleAndSubtitle(children, props.textValue, props.subtitle);
    return (_jsxs(Zeego.Item, { ...props, destructive: variant === "destructive" || props.destructive, onSelect: () => {
            triggerNativeHaptics(props.nativeHaptics ?? contextHaptics.item, {
                delay: props.nativeHapticsDelay ?? contextHaptics.itemDelay,
            });
            (props.onSelect ?? props.onPress)?.();
        }, textValue: label, children: [_jsx(Zeego.ItemTitle, { children: label }), subtitle ? _jsx(Zeego.ItemSubtitle, { children: subtitle }) : null] }));
}
function ContextMenuCheckboxItem({ children, checked, onCheckedChange, ...props }) {
    const contextHaptics = React.useContext(NativeContextMenuHapticsContext);
    const { title: label, subtitle } = resolveItemTitleAndSubtitle(children, props.textValue, props.subtitle);
    return (_jsxs(Zeego.CheckboxItem, { ...props, onValueChange: (next, previous) => {
            triggerNativeHaptics(props.nativeHaptics ?? contextHaptics.item, {
                delay: props.nativeHapticsDelay ?? contextHaptics.itemDelay,
            });
            props.onValueChange?.(next, previous);
            onCheckedChange?.(next === "on");
        }, textValue: label, value: checked ? "on" : "off", children: [_jsx(Zeego.ItemTitle, { children: label }), subtitle ? _jsx(Zeego.ItemSubtitle, { children: subtitle }) : null] }));
}
const RadioContext = React.createContext({});
function ContextMenuRadioGroup({ children, onValueChange, value }) {
    return _jsx(RadioContext.Provider, { value: { onValueChange, value }, children: children });
}
function ContextMenuRadioItem({ children, value, ...props }) {
    const radio = React.useContext(RadioContext);
    return (_jsx(ContextMenuCheckboxItem, { ...props, checked: radio.value === value, onCheckedChange: (checked) => checked && radio.onValueChange?.(value), children: children }));
}
function ContextMenuLabel({ children, ...props }) {
    const label = props.textValue ?? textValue(children);
    return (_jsx(Zeego.Label, { ...props, textValue: label, children: label }));
}
function ContextMenuShortcut() {
    return null;
}
const ContextMenuComponent = Object.assign(ContextMenu, {
    Arrow: Zeego.Arrow,
    Auxiliary: ContextMenuAuxiliary,
    CheckboxItem: ContextMenuCheckboxItem,
    Content: ContextMenuContent,
    Group: ContextMenuGroup,
    Item: ContextMenuItem,
    ItemIcon: Zeego.ItemIcon,
    ItemImage: Zeego.ItemImage,
    ItemIndicator: Zeego.ItemIndicator,
    ItemSubtitle: Zeego.ItemSubtitle,
    ItemTitle: Zeego.ItemTitle,
    Label: ContextMenuLabel,
    Portal: ContextMenuPortal,
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
export const ContextMenuNative = ContextMenuComponent;
