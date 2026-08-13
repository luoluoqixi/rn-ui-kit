import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRight } from "@tamagui/lucide-icons-2";
import { Children, isValidElement } from "react";
import { StyleSheet } from "react-native";
import { SizableText, ContextMenu as TamaguiContextMenu } from "tamagui";
import { isWeb, os } from "../utils/platform";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
const DEFAULT_CONTEXT_MENU_ENTER_STYLE = { opacity: 0, scale: 0.96, y: -4 };
const DEFAULT_CONTEXT_MENU_EXIT_STYLE = { opacity: 0, scale: 0.98, y: -2 };
function mergeContextMenuStyle(baseStyle, style) {
    return StyleSheet.flatten([baseStyle, style]);
}
function normalizeContextMenuChildren(children) {
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
function getItemTextValue(label, fallback) {
    if (typeof label === "string" || typeof label === "number") {
        return String(label);
    }
    return fallback;
}
function ContextMenuRoot(props) {
    const { arrow, arrowProps, children, contentProps, itemProps, items, nativeHaptics, onOpenChange, portalProps, trigger, triggerProps, ...rootProps } = props;
    const hasDefaultStructure = trigger != null || items != null || arrow != null;
    const web = isWeb();
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const handleOpenChange = (nextOpen) => {
        onOpenChange?.(nextOpen);
        if (!nextOpen || os() === "ios") {
            return;
        }
        triggerNativeHaptics(resolvedNativeHaptics);
    };
    const renderItems = (contextMenuItems, depth = 0) => contextMenuItems.map((item) => {
        if (item.separator) {
            return _jsx(ContextMenuSeparator, {}, item.value);
        }
        const label = item.label ?? item.value;
        const textValue = item.textValue ?? getItemTextValue(label, item.value);
        const accessibilityLabel = resolveAriaLabel(item["aria-label"] ?? itemProps?.["aria-label"], label);
        const hasTrailingContent = item.icon != null || item.indicator != null;
        if (item.subMenu?.length) {
            const subMenuTitle = item.subMenuTitle === false ? null : (item.subMenuTitle ?? label);
            return (_jsxs(ContextMenuSub, { children: [_jsxs(ContextMenuSubTrigger, { ...itemProps, "aria-label": accessibilityLabel, destructive: item.destructive ?? itemProps?.destructive, disabled: item.disabled ?? itemProps?.disabled, justify: itemProps?.justify ?? "space-between", textValue: textValue, children: [_jsx(ContextMenuItemTitle, { children: label }), item.subtitle != null ? (_jsx(ContextMenuItemSubtitle, { children: item.subtitle })) : null, item.icon != null ? _jsx(ContextMenuItemIcon, { children: item.icon }) : null, item.indicator, web ? (_jsx(ContextMenuItemIcon, { children: _jsx(ChevronRight, { color: "$color10", size: 16 }) })) : null] }), _jsx(ContextMenuPortal, { zIndex: 200 + depth, children: _jsxs(ContextMenuSubContent, { children: [web && subMenuTitle != null ? (_jsx(ContextMenuLabel, { children: subMenuTitle })) : null, renderItems(item.subMenu, depth + 1)] }) })] }, item.value));
        }
        return (_createElement(ContextMenuItem, { ...itemProps, "aria-label": accessibilityLabel, destructive: item.destructive ?? itemProps?.destructive, disabled: item.disabled ?? itemProps?.disabled, justify: itemProps?.justify ?? (hasTrailingContent ? "space-between" : undefined), key: item.value, onSelect: item.onSelect ?? item.onPress, ...{ selected: item.selected }, textValue: textValue },
            _jsx(ContextMenuItemTitle, { children: label }),
            item.subtitle != null ? (_jsx(ContextMenuItemSubtitle, { children: item.subtitle })) : null,
            item.icon != null ? _jsx(ContextMenuItemIcon, { children: item.icon }) : null,
            item.indicator != null ? (_jsx(ContextMenuItemIndicator, { children: item.indicator })) : null));
    });
    if (!hasDefaultStructure) {
        return (_jsx(TamaguiContextMenu, { ...rootProps, onOpenChange: handleOpenChange, children: children }));
    }
    return (_jsxs(TamaguiContextMenu, { ...rootProps, onOpenChange: handleOpenChange, children: [trigger != null ? (_jsx(ContextMenuTrigger, { ...triggerProps, children: trigger })) : null, _jsx(ContextMenuPortal, { ...portalProps, children: _jsxs(ContextMenuContent, { ...contentProps, children: [arrow ? _jsx(ContextMenuArrow, { ...arrowProps }) : null, items ? renderItems(items) : null, children] }) })] }));
}
function ContextMenuTrigger(props) {
    return _jsx(TamaguiContextMenu.Trigger, { asChild: props.asChild ?? isWeb(), ...props });
}
function ContextMenuPortal(props) {
    return _jsx(TamaguiContextMenu.Portal, { ...props, zIndex: props.zIndex ?? 100 });
}
function ContextMenuContent(props) {
    const { boxShadow, enterStyle, exitStyle, style, transition, ...contentProps } = props;
    return (_jsx(TamaguiContextMenu.Content, { ...contentProps, boxShadow: boxShadow ?? "0 4px 5px $shadowColor", enterStyle: enterStyle ?? DEFAULT_CONTEXT_MENU_ENTER_STYLE, exitStyle: exitStyle ?? DEFAULT_CONTEXT_MENU_EXIT_STYLE, style: mergeContextMenuStyle({ borderRadius: 16, padding: 5 }, style), transition: transition ?? "100ms" }));
}
function ContextMenuGroup(props) {
    return _jsx(TamaguiContextMenu.Group, { ...props });
}
function ContextMenuLabel(props) {
    const { style, ...labelProps } = props;
    return (_jsx(TamaguiContextMenu.Label, { ...labelProps, color: props.color ?? "$color9", select: props.select ?? "none", size: props.size ?? "$3", style: mergeContextMenuStyle({ padding: 5 }, style) }));
}
function ContextMenuItem(props) {
    const { children, textValue, ...itemProps } = props;
    return (_jsx(TamaguiContextMenu.Item, { ...itemProps, textValue: textValue ?? getChildrenTextValue(children), children: normalizeContextMenuChildren(children) }));
}
function ContextMenuItemTitle(props) {
    return _jsx(TamaguiContextMenu.ItemTitle, { ...props });
}
function ContextMenuItemSubtitle(props) {
    return _jsx(TamaguiContextMenu.ItemSubtitle, { ...props });
}
function ContextMenuItemIcon(props) {
    return _jsx(TamaguiContextMenu.ItemIcon, { ...props });
}
function ContextMenuItemImage(props) {
    return _jsx(TamaguiContextMenu.ItemImage, { ...props });
}
function ContextMenuCheckboxItem(props) {
    const { children, textValue, ...itemProps } = props;
    return (_jsx(TamaguiContextMenu.CheckboxItem, { ...itemProps, textValue: textValue ?? getChildrenTextValue(children), children: normalizeContextMenuChildren(children) }));
}
function ContextMenuRadioGroup(props) {
    return _jsx(TamaguiContextMenu.RadioGroup, { ...props });
}
function ContextMenuRadioItem(props) {
    const { children, textValue, ...itemProps } = props;
    return (_jsx(TamaguiContextMenu.RadioItem, { ...itemProps, textValue: textValue ?? getChildrenTextValue(children), children: normalizeContextMenuChildren(children) }));
}
function ContextMenuItemIndicator(props) {
    return _jsx(TamaguiContextMenu.ItemIndicator, { ...props });
}
function ContextMenuSeparator(props) {
    return _jsx(TamaguiContextMenu.Separator, { ...props });
}
function ContextMenuArrow(props) {
    return (_jsx(TamaguiContextMenu.Arrow, { ...props, borderColor: props.borderColor ?? "$borderColor", borderWidth: props.borderWidth ?? 1, size: props.size ?? "$4" }));
}
function ContextMenuSub(props) {
    return _jsx(TamaguiContextMenu.Sub, { ...props });
}
function ContextMenuSubTrigger(props) {
    const { children, textValue, ...subTriggerProps } = props;
    return (_jsx(TamaguiContextMenu.SubTrigger, { ...subTriggerProps, textValue: textValue ?? getChildrenTextValue(children), children: normalizeContextMenuChildren(children) }));
}
function ContextMenuSubContent(props) {
    const { boxShadow, enterStyle, exitStyle, style, transition, ...contentProps } = props;
    return (_jsx(TamaguiContextMenu.SubContent, { ...contentProps, boxShadow: boxShadow ?? "0 4px 5px $shadowColor", enterStyle: enterStyle ?? DEFAULT_CONTEXT_MENU_ENTER_STYLE, exitStyle: exitStyle ?? DEFAULT_CONTEXT_MENU_EXIT_STYLE, style: mergeContextMenuStyle({ borderRadius: 16, padding: 5 }, style), transition: transition ?? "100ms" }));
}
function ContextMenuPreview(props) {
    return _jsx(TamaguiContextMenu.Preview, { ...props });
}
ContextMenuRoot.displayName = "ContextMenu";
ContextMenuTrigger.displayName = "Trigger";
ContextMenuPortal.displayName = "Portal";
ContextMenuContent.displayName = "Content";
ContextMenuGroup.displayName = "Group";
ContextMenuLabel.displayName = "Label";
ContextMenuItem.displayName = "Item";
ContextMenuItemTitle.displayName = "ItemTitle";
ContextMenuItemSubtitle.displayName = "ItemSubtitle";
ContextMenuItemIcon.displayName = "ItemIcon";
ContextMenuItemImage.displayName = "ItemImage";
ContextMenuCheckboxItem.displayName = "CheckboxItem";
ContextMenuRadioGroup.displayName = "RadioGroup";
ContextMenuRadioItem.displayName = "RadioItem";
ContextMenuItemIndicator.displayName = "ItemIndicator";
ContextMenuSeparator.displayName = "Separator";
ContextMenuArrow.displayName = "Arrow";
ContextMenuSub.displayName = "Sub";
ContextMenuSubTrigger.displayName = "SubTrigger";
ContextMenuSubContent.displayName = "SubContent";
ContextMenuPreview.displayName = "Preview";
export const ContextMenu = Object.assign(ContextMenuRoot, {
    Trigger: ContextMenuTrigger,
    Portal: ContextMenuPortal,
    Content: ContextMenuContent,
    Group: ContextMenuGroup,
    Label: ContextMenuLabel,
    Item: ContextMenuItem,
    ItemTitle: ContextMenuItemTitle,
    ItemSubtitle: ContextMenuItemSubtitle,
    ItemIcon: ContextMenuItemIcon,
    ItemImage: ContextMenuItemImage,
    CheckboxItem: ContextMenuCheckboxItem,
    RadioGroup: ContextMenuRadioGroup,
    RadioItem: ContextMenuRadioItem,
    ItemIndicator: ContextMenuItemIndicator,
    Separator: ContextMenuSeparator,
    Arrow: ContextMenuArrow,
    Sub: ContextMenuSub,
    SubTrigger: ContextMenuSubTrigger,
    SubContent: ContextMenuSubContent,
    Preview: ContextMenuPreview,
});
