import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu, useMenu } from "heroui-native/menu";
import { SubMenu } from "heroui-native/sub-menu";
import { useAnimationSettings } from "heroui-native/contexts";
import { Separator } from "../separator";
import { Text } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import { HeroUIWindowOverlayScope, useHeroUIOverlayPortalHostName } from "../utils/overlay/heroui_anchor.native";
// HeroUI reserves only the trigger row for its floating SubMenu. Inside a
// ScrollView the expanded surface must also participate in the scroll extent.
const submenuPaddingTop = 12;
const submenuSpring = { damping: 100, stiffness: 950, mass: 3 };
const submenuAnimation = {
    rootContent: {
        marginHorizontal: 0,
        marginVertical: 0,
        paddingTop: submenuPaddingTop,
        springConfig: submenuSpring,
    },
};
function ScrollableSubMenu({ item, children }) {
    const font = useDefaultTextStyle();
    const [open, setOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const { isAllAnimationsDisabled } = useAnimationSettings();
    const space = useAnimatedStyle(() => {
        const paddingBottom = open ? contentHeight + submenuPaddingTop : 0;
        return {
            paddingBottom: isAllAnimationsDisabled
                ? paddingBottom
                : withSpring(paddingBottom, submenuSpring),
        };
    }, [open, contentHeight, isAllAnimationsDisabled]);
    return (_jsx(Animated.View, { style: [space, { zIndex: open ? 50 : 0 }], children: _jsxs(SubMenu, { isDisabled: item.disabled, isOpen: open, onOpenChange: setOpen, animation: submenuAnimation, children: [_jsxs(SubMenu.Trigger, { textValue: item.textValue, children: [(item.icon != null || item.reserveIconSpace) && (_jsx(View, { className: "size-5 shrink-0", children: item.icon })), _jsx(Text, { className: "flex-1 text-base font-medium text-foreground", style: font, children: item.label }), _jsx(SubMenu.TriggerIndicator, {})] }), _jsx(SubMenu.Content, { onLayout: (event) => setContentHeight(event.nativeEvent.layout.height), children: children })] }) }));
}
function MenuScrollBody({ maxHeight, children }) {
    const { isSubMenuOpen, openSubMenuId, closeSubMenu } = useMenu();
    return (_jsxs(ScrollView, { style: { maxHeight, marginHorizontal: -5, zIndex: isSubMenuOpen ? 50 : 0 }, contentContainerStyle: { paddingHorizontal: 5 }, keyboardShouldPersistTaps: "handled", nestedScrollEnabled: true, children: [isSubMenuOpen && (_jsx(Pressable, { accessibilityLabel: "\u8FD4\u56DE\u4E0A\u7EA7\u83DC\u5355", accessibilityRole: "button", style: { position: "absolute", inset: 0, zIndex: 40 }, onPress: () => {
                    if (openSubMenuId !== null)
                        closeSubMenu(openSubMenuId);
                } })), children] }));
}
function MenuItems({ items }) {
    const font = useDefaultTextStyle();
    return (_jsx(_Fragment, { children: items.map((item) => {
            if (item.separator)
                return (_jsx(Separator, { variant: item.separatorVariant, className: item.separatorVariant === "thick"
                        ? "-mx-[5px] my-1 opacity-25"
                        : "mx-2 my-1 opacity-75" }, item.value));
            if (item.subMenu)
                return (_jsxs(ScrollableSubMenu, { item: item, children: [item.subMenuTitle !== false && (_jsx(Menu.Label, { style: font, children: item.subMenuTitle ?? item.label })), _jsx(MenuItems, { items: item.subMenu })] }, item.value));
            const choice = item.checkbox || item.selected !== undefined;
            return (_createElement(Menu.Item, { ...item.herouiNativeProps, key: item.value, id: item.value, accessibilityLabel: item.textValue, isDisabled: item.disabled, isSelected: choice ? !!item.selected : undefined, variant: item.destructive ? "danger" : "default", shouldCloseOnSelect: item.shouldCloseOnSelect ??
                    item.herouiNativeProps?.shouldCloseOnSelect ??
                    !item.checkbox, onPress: item.onAction },
                choice && item.selectionIndicatorPosition !== "right" && (_jsx(Menu.ItemIndicator, { variant: item.selectionIndicatorVariant, children: item.indicator })),
                (item.icon != null || item.reserveIconSpace) && (_jsx(View, { className: "size-5 shrink-0", children: item.icon })),
                _jsxs(View, { className: "flex-1", children: [_jsx(Menu.ItemTitle, { style: font, children: item.label }), item.subtitle && (_jsx(Menu.ItemDescription, { style: font, children: item.subtitle }))] }),
                item.shortcut != null && (_jsx(Text, { className: "shrink-0 text-sm", color: "muted", style: font, children: item.shortcut })),
                choice && item.selectionIndicatorPosition === "right" && (_jsx(Menu.ItemIndicator, { variant: item.selectionIndicatorVariant, children: item.indicator }))));
        }) }));
}
export function MenuSurface({ items, contentProps: c, accessibilityLabel }) {
    const portalHostName = useHeroUIOverlayPortalHostName();
    const placement = c?.herouiNativeProps?.placement ?? c?.side ?? "bottom";
    const align = c?.herouiNativeProps?.align ??
        c?.align ??
        (placement === "top" || placement === "bottom" ? "center" : "start");
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const maxHeight = Math.max(1, Math.min(c?.maxHeight ?? 320, height - insets.top - insets.bottom - 32));
    return (_jsx(Menu.Portal, { hostName: portalHostName, children: _jsxs(HeroUIWindowOverlayScope, { children: [_jsx(Menu.Overlay, {}), _jsx(Menu.Content, { ...c?.herouiNativeProps, presentation: "popover", placement: placement, align: align, offset: c?.herouiNativeProps?.offset ?? c?.sideOffset ?? 8, className: c?.className, accessibilityLabel: accessibilityLabel ?? "菜单", children: _jsx(MenuScrollBody, { maxHeight: maxHeight, children: _jsx(MenuItems, { items: items }) }) })] }) }));
}
