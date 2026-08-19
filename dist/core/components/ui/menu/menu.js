import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRight } from "@tamagui/lucide-icons-2";
import { Children, createElement, createContext, isValidElement, useContext, useState, } from "react";
import { StyleSheet } from "react-native";
import { SizableText, Menu as TamaguiMenu, YStack } from "tamagui";
import { isWeb, os } from "../utils/platform";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { NativeTrigger } from "../native_trigger";
import { resolveAndroidMenuItems, resolveIosMenuItemGroups } from "./item_groups";
const DEFAULT_MENU_ENTER_STYLE = { opacity: 0, scale: 0.96, y: -4 };
const DEFAULT_MENU_EXIT_STYLE = { opacity: 0, scale: 0.98, y: -2 };
const DEFAULT_MENU_INTERACTIVE_STYLE = { cursor: "default" };
const DEFAULT_MENU_TRIGGER_ACTIVE_OPACITY = 0.6;
const MenuTriggerStateContext = createContext(null);
/**
 * 读取所属 `Menu` 的 trigger 实时状态。
 *
 * 仅能在该 Menu 的 function component trigger 及其后代组件中调用。
 */
export function useMenuTriggerState() {
    const state = useContext(MenuTriggerStateContext);
    if (state == null) {
        throw new Error("useMenuTriggerState 必须在 Menu 的 trigger 后代组件中调用。");
    }
    return state;
}
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
    const { arrow, arrowProps, children, contentProps, itemProps, items, nativeHaptics, nativeAnchorAlignment, nativeSelectedItemBackgroundColor, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabel, nativeTriggerLabelProps, offset, onOpenChange, onOpenWillChange, portalProps, trigger, triggerProps, ...rootProps } = props;
    const triggerIsRenderFunction = typeof trigger === "function";
    const resolvedNativeTriggerLabel = nativeTriggerLabel ?? (triggerIsRenderFunction ? undefined : trigger);
    const resolvedNativeAnchorAlignment = nativeAnchorAlignment ?? "center";
    const web = isWeb();
    const ios = os() === "ios";
    const android = os() === "android";
    const resolvedPlacement = rootProps.placement ?? (web ? "bottom" : undefined);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(rootProps.defaultOpen));
    const [willOpen, setWillOpen] = useState(Boolean(rootProps.defaultOpen));
    const [isTriggerPressed, setIsTriggerPressed] = useState(false);
    const isOpen = rootProps.open ?? uncontrolledOpen;
    const isOpening = willOpen && !isOpen;
    // 保持默认 NativeTrigger 原有的 active 判定；额外的按住状态仅供外部 hook 使用。
    const isNativeTriggerActive = ios ? (rootProps.open ?? willOpen) : isOpen;
    const isTriggerActive = isNativeTriggerActive || isTriggerPressed;
    const triggerState = {
        isActive: isTriggerActive,
        isOpen,
        isOpening,
        isPressed: isTriggerPressed,
        opacity: isTriggerActive ? DEFAULT_MENU_TRIGGER_ACTIVE_OPACITY : 1,
    };
    // 函数 trigger 必须作为 React component 渲染，不能直接调用；否则其内部 hook 不在 Provider 中。
    const renderedTrigger = triggerIsRenderFunction ? createElement(trigger, triggerState) : trigger;
    const shouldRenderTrigger = renderedTrigger != null ||
        (nativeTrigger === true &&
            (resolvedNativeTriggerLabel != null || nativeTriggerContent != null));
    const hasDefaultStructure = shouldRenderTrigger || items != null || arrow != null;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const handleOpenChange = (nextOpen) => {
        if (rootProps.open === undefined) {
            setUncontrolledOpen(nextOpen);
        }
        if (!nextOpen) {
            setIsTriggerPressed(false);
        }
        onOpenChange?.(nextOpen);
        if (nextOpen && !ios) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
    };
    const handleOpenWillChange = (nextOpen) => {
        setWillOpen(nextOpen);
        if (!nextOpen) {
            setIsTriggerPressed(false);
        }
        onOpenWillChange?.(nextOpen);
        if (nextOpen) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
    };
    const iosOpenWillChangeProps = ios ? { onOpenWillChange: handleOpenWillChange } : undefined;
    const resolvedTriggerProps = {
        ...triggerProps,
        onPressIn: (event) => {
            setIsTriggerPressed(true);
            triggerProps?.onPressIn?.(event);
        },
        onPressOut: (event) => {
            setIsTriggerPressed(false);
            triggerProps?.onPressOut?.(event);
        },
    };
    // Menu 在 native 上浮动定位后视觉顺序反转，统一反转 children / items
    const resolvedChildren = Children.toArray(children).reverse();
    const renderItem = (item, depth, separatorBefore = false) => {
        if (item.separator) {
            return _jsx(MenuSeparator, {}, item.value);
        }
        const label = item.label ?? item.value;
        const textValue = item.textValue ?? getMenuItemTextValue(label, item.value);
        const accessibilityLabel = resolveAriaLabel(item["aria-label"] ?? itemProps?.["aria-label"], label);
        const shouldRenderItemIcon = item.icon != null || (!web && item.iconProps != null);
        const hasTrailingContent = shouldRenderItemIcon || item.indicator != null;
        if (item.subMenu?.length) {
            const subMenuTitle = item.subMenuTitle === false ? null : (item.subMenuTitle ?? label);
            return (_jsxs(MenuSub, { children: [_jsxs(MenuSubTrigger, { ...itemProps, ...{ separatorBefore: separatorBefore || undefined }, "aria-label": accessibilityLabel, destructive: item.destructive ?? itemProps?.destructive, disabled: item.disabled ?? itemProps?.disabled, justify: itemProps?.justify ?? "space-between", textValue: textValue, children: [_jsx(MenuItemTitle, { children: label }), shouldRenderItemIcon ? (_jsx(MenuItemIcon, { ...item.iconProps, children: item.icon })) : null, item.indicator, web ? (_jsx(MenuItemIcon, { children: _jsx(ChevronRight, { color: "$color10", size: 16 }) })) : null] }), _jsx(MenuPortal, { zIndex: 200 + depth, children: _jsxs(MenuSubContent, { children: [web && subMenuTitle != null ? _jsx(MenuLabel, { children: subMenuTitle }) : null, renderItems(item.subMenu, depth + 1)] }) })] }, item.value));
        }
        return (_createElement(MenuItem, { ...itemProps, ...{ separatorBefore: separatorBefore || undefined }, "aria-label": accessibilityLabel, destructive: item.destructive ?? itemProps?.destructive, disabled: item.disabled ?? itemProps?.disabled, justify: itemProps?.justify ?? (hasTrailingContent ? "space-between" : undefined), key: item.value, onSelect: item.onSelect ?? item.onPress, ...{
                androidIconColor: item.iconProps?.androidIconColor,
                selected: item.selected,
            }, textValue: textValue },
            _jsx(MenuItemTitle, { children: label }),
            shouldRenderItemIcon ? _jsx(MenuItemIcon, { ...item.iconProps, children: item.icon }) : null,
            item.indicator != null ? _jsx(MenuItemIndicator, { children: item.indicator }) : null));
    };
    function renderItems(menuItems, depth = 0) {
        if (ios) {
            const groups = resolveIosMenuItemGroups(menuItems);
            // Zeego 会将 Group 映射为 UIMenu.Options.displayInline，由系统在各组之间绘制分割线。
            // Tamagui 随后只会反转这些 Group，不会反转 Group 内部条目，所以组内保持原始顺序。
            if (groups.length > 1) {
                return groups.map((group, groupIndex) => (_jsx(MenuGroup, { children: group.map((item) => renderItem(item, depth)) }, `menu-group-${depth}-${groupIndex}`)));
            }
            // 没有有效分割线时，条目仍是 Content 的直接 children，需要沿用原来的扁平反转。
            return [...(groups[0] ?? [])].reverse().map((item) => renderItem(item, depth));
        }
        if (android) {
            return resolveAndroidMenuItems(menuItems).map(({ item, separatorBefore }) => renderItem(item, depth, separatorBefore));
        }
        return menuItems.map((item) => renderItem(item, depth));
    }
    if (!hasDefaultStructure) {
        return (_jsx(MenuTriggerStateContext.Provider, { value: triggerState, children: _jsx(TamaguiMenu, { ...rootProps, ...{ anchorAlignment: resolvedNativeAnchorAlignment }, ...{ isAnchoredToRight: resolvedNativeAnchorAlignment === "end" }, ...(nativeSelectedItemBackgroundColor != null
                    ? { selectedItemBackgroundColor: nativeSelectedItemBackgroundColor }
                    : undefined), ...iosOpenWillChangeProps, offset: offset ?? 8, onOpenChange: handleOpenChange, placement: resolvedPlacement, children: resolvedChildren }) }));
    }
    return (_jsx(MenuTriggerStateContext.Provider, { value: triggerState, children: _jsxs(TamaguiMenu, { ...rootProps, ...{ anchorAlignment: resolvedNativeAnchorAlignment }, ...{ isAnchoredToRight: resolvedNativeAnchorAlignment === "end" }, ...(nativeSelectedItemBackgroundColor != null
                ? { selectedItemBackgroundColor: nativeSelectedItemBackgroundColor }
                : undefined), ...iosOpenWillChangeProps, offset: offset ?? 8, onOpenChange: handleOpenChange, placement: resolvedPlacement, children: [shouldRenderTrigger ? (_jsx(MenuTrigger, { ...resolvedTriggerProps, asChild: nativeTrigger ? true : triggerProps?.asChild, children: triggerIsRenderFunction ? (renderedTrigger) : nativeTrigger ? (_jsx(NativeTrigger, { active: isNativeTriggerActive, containerStyle: nativeTriggerContainerStyle, content: nativeTriggerContent, icon: nativeTriggerIcon, keepPressedOpacity: ios, label: resolvedNativeTriggerLabel, labelProps: nativeTriggerLabelProps })) : (renderedTrigger) })) : null, _jsx(MenuPortal, { ...portalProps, children: _jsxs(MenuContent, { ...contentProps, children: [arrow ? _jsx(MenuArrow, { ...arrowProps }) : null, _jsxs(MenuScrollView, { children: [items ? renderItems(items) : null, resolvedChildren] })] }) })] }) }));
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
