import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, isValidElement } from "react";
import { StyleSheet } from "react-native";
import { SizableText, Menu as TamaguiMenu, YStack } from "tamagui";
import { isWeb } from "../utils/platform";
import { resolveAriaLabel } from "../utils";
const DEFAULT_MENU_ENTER_STYLE = { opacity: 0, scale: 0.96, y: -4 };
const DEFAULT_MENU_EXIT_STYLE = { opacity: 0, scale: 0.98, y: -2 };
const DEFAULT_MENU_INTERACTIVE_STYLE = { cursor: "default" };
function mergeMenuStyle(baseStyle, style) {
    return StyleSheet.flatten([baseStyle, style]);
}
function normalizeMenuChildren(children) {
    return Children.map(children, (child) => {
        if (typeof child === "string" || typeof child === "number") {
            return _jsx(SizableText, { children: child });
        }
        if (isValidElement(child)) {
            return child;
        }
        return child;
    });
}
function getChildrenTextValue(children) {
    if (typeof children === "string" || typeof children === "number") {
        return String(children);
    }
    return undefined;
}
function getMenuItemTextValue(label, fallback) {
    if (typeof label === "string" || typeof label === "number") {
        return String(label);
    }
    return fallback;
}
function MenuRoot(props) {
    const { arrow, arrowProps, children, contentProps, itemProps, items, offset, portalProps, trigger, triggerProps, ...rootProps } = props;
    const hasDefaultStructure = trigger != null || items != null || arrow != null;
    // Menu 在 native 上浮动定位后视觉顺序反转，统一反转 children / items
    const resolvedChildren = Children.toArray(children).reverse();
    const resolvedItems = items ? [...items].reverse() : items;
    if (!hasDefaultStructure) {
        return (_jsx(TamaguiMenu, { ...rootProps, offset: offset ?? 8, children: resolvedChildren }));
    }
    return (_jsxs(TamaguiMenu, { ...rootProps, offset: offset ?? 8, children: [trigger != null ? _jsx(MenuTrigger, { ...triggerProps, children: trigger }) : null, _jsx(MenuPortal, { ...portalProps, children: _jsxs(MenuContent, { ...contentProps, children: [arrow ? _jsx(MenuArrow, { ...arrowProps }) : null, _jsxs(MenuScrollView, { children: [resolvedItems?.map((item) => {
                                    if (item.separator) {
                                        return _jsx(MenuSeparator, {}, item.value);
                                    }
                                    const label = item.label ?? item.value;
                                    return (_createElement(MenuItem, { ...itemProps, "aria-label": resolveAriaLabel(item["aria-label"] ?? itemProps?.["aria-label"], label), destructive: item.destructive ?? itemProps?.destructive, disabled: item.disabled ?? itemProps?.disabled, key: item.value, onSelect: item.onSelect ?? item.onPress, textValue: item.textValue ?? getMenuItemTextValue(label, item.value) },
                                        _jsx(MenuItemTitle, { children: label }),
                                        item.indicator != null ? (_jsx(MenuItemIndicator, { children: item.indicator })) : null));
                                }), resolvedChildren] })] }) })] }));
}
function MenuTrigger(props) {
    return _jsx(TamaguiMenu.Trigger, { asChild: props.asChild ?? isWeb(), ...props });
}
function MenuPortal(props) {
    return _jsx(TamaguiMenu.Portal, { ...props, zIndex: props.zIndex ?? 100 });
}
function MenuContent(props) {
    const { boxShadow, enterStyle, exitStyle, style, transition, ...contentProps } = props;
    return (_jsx(TamaguiMenu.Content, { ...contentProps, boxShadow: boxShadow ?? "0 4px 5px $shadowColor", enterStyle: enterStyle ?? DEFAULT_MENU_ENTER_STYLE, exitStyle: exitStyle ?? DEFAULT_MENU_EXIT_STYLE, style: mergeMenuStyle({ borderRadius: 16 }, style), transition: transition ?? "100ms" }));
}
function MenuScrollView(props) {
    const { children, ...scrollViewProps } = props;
    return (_jsx(TamaguiMenu.ScrollView, { ...scrollViewProps, children: _jsx(YStack, { p: 5, children: children }) }));
}
function MenuGroup(props) {
    return _jsx(TamaguiMenu.Group, { ...props });
}
function MenuLabel(props) {
    const { style, ...labelProps } = props;
    return (_jsx(TamaguiMenu.Label, { ...labelProps, color: props.color ?? "$color9", select: props.select ?? "none", size: props.size ?? "$3", style: mergeMenuStyle({ padding: 5 }, style) }));
}
function MenuItem(props) {
    const { children, textValue, ...itemProps } = props;
    return (_jsx(TamaguiMenu.Item, { ...itemProps, textValue: textValue ?? getChildrenTextValue(children), style: mergeMenuStyle(DEFAULT_MENU_INTERACTIVE_STYLE, props.style), children: normalizeMenuChildren(children) }));
}
function MenuItemTitle(props) {
    return _jsx(TamaguiMenu.ItemTitle, { ...props });
}
function MenuItemIcon(props) {
    return _jsx(TamaguiMenu.ItemIcon, { ...props });
}
function MenuCheckboxItem(props) {
    const { children, textValue, ...itemProps } = props;
    return (_jsx(TamaguiMenu.CheckboxItem, { ...itemProps, textValue: textValue ?? getChildrenTextValue(children), style: mergeMenuStyle(DEFAULT_MENU_INTERACTIVE_STYLE, props.style), children: normalizeMenuChildren(children) }));
}
function MenuRadioGroup(props) {
    return _jsx(TamaguiMenu.RadioGroup, { ...props });
}
function MenuRadioItem(props) {
    const { children, textValue, ...itemProps } = props;
    return (_jsx(TamaguiMenu.RadioItem, { ...itemProps, textValue: textValue ?? getChildrenTextValue(children), style: mergeMenuStyle(DEFAULT_MENU_INTERACTIVE_STYLE, props.style), children: normalizeMenuChildren(children) }));
}
function MenuItemIndicator(props) {
    return _jsx(TamaguiMenu.ItemIndicator, { ...props });
}
function MenuSeparator(props) {
    return _jsx(TamaguiMenu.Separator, { ...props });
}
function MenuArrow(props) {
    return (_jsx(TamaguiMenu.Arrow, { ...props, borderColor: props.borderColor ?? "$borderColor", borderWidth: props.borderWidth ?? 1, size: props.size ?? "$4" }));
}
function MenuSub(props) {
    return _jsx(TamaguiMenu.Sub, { ...props });
}
function MenuSubTrigger(props) {
    const { children, textValue, ...subTriggerProps } = props;
    return (_jsx(TamaguiMenu.SubTrigger, { ...subTriggerProps, textValue: textValue ?? getChildrenTextValue(children), style: mergeMenuStyle(DEFAULT_MENU_INTERACTIVE_STYLE, props.style), children: normalizeMenuChildren(children) }));
}
function MenuSubContent(props) {
    const { boxShadow, enterStyle, exitStyle, style, transition, ...contentProps } = props;
    return (_jsx(TamaguiMenu.SubContent, { ...contentProps, boxShadow: boxShadow ?? "0 4px 5px $shadowColor", enterStyle: enterStyle ?? DEFAULT_MENU_ENTER_STYLE, exitStyle: exitStyle ?? DEFAULT_MENU_EXIT_STYLE, style: mergeMenuStyle({ borderRadius: 16, padding: 5 }, style), transition: transition ?? "100ms" }));
}
MenuRoot.displayName = "Menu";
MenuTrigger.displayName = "Trigger";
MenuPortal.displayName = "Portal";
MenuContent.displayName = "Content";
MenuScrollView.displayName = "ScrollView";
MenuGroup.displayName = "Group";
MenuLabel.displayName = "Label";
MenuItem.displayName = "Item";
MenuItemTitle.displayName = "ItemTitle";
MenuItemIcon.displayName = "ItemIcon";
MenuCheckboxItem.displayName = "CheckboxItem";
MenuRadioGroup.displayName = "RadioGroup";
MenuRadioItem.displayName = "RadioItem";
MenuItemIndicator.displayName = "ItemIndicator";
MenuSeparator.displayName = "Separator";
MenuArrow.displayName = "Arrow";
MenuSub.displayName = "Sub";
MenuSubTrigger.displayName = "SubTrigger";
MenuSubContent.displayName = "SubContent";
export const Menu = Object.assign(MenuRoot, {
    Trigger: MenuTrigger,
    Portal: MenuPortal,
    Content: MenuContent,
    ScrollView: MenuScrollView,
    Group: MenuGroup,
    Label: MenuLabel,
    Item: MenuItem,
    ItemTitle: MenuItemTitle,
    ItemIcon: MenuItemIcon,
    CheckboxItem: MenuCheckboxItem,
    RadioGroup: MenuRadioGroup,
    RadioItem: MenuRadioItem,
    ItemIndicator: MenuItemIndicator,
    Separator: MenuSeparator,
    Arrow: MenuArrow,
    Sub: MenuSub,
    SubTrigger: MenuSubTrigger,
    SubContent: MenuSubContent,
});
