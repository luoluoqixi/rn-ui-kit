import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment } from "react";
import { Dropdown as Menu } from "@heroui/react/dropdown";
import { Label } from "@heroui/react/label";
import { Description } from "@heroui/react/description";
import { Separator } from "../separator";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { useOverlayPortalContainer } from "../utils/overlay/overlay_portal_scope";
import { HeroUIOverlayLayer } from "../utils/overlay/heroui_layer.web";
import { useMenuConfig } from "../context_menu/menu_provider";
// Scoped Dialog / Sheet hosts may have zero size. Size against the viewport.
const menuViewportStyle = {
    minWidth: "min(calc(var(--spacing) * 55), calc(100svw - 2rem))",
    maxWidth: "calc(100svw - 2rem)",
};
function MenuItems({ items, menubarOwner }) {
    const font = textWebStyle(useDefaultTextStyle());
    return _jsx(_Fragment, { children: items.map(item => {
            if (item.separator)
                return _jsx(Separator, { variant: item.separatorVariant, thickness: item.separatorVariant === "thick" ? 6 : undefined, className: item.separatorVariant === "thick" ? "-mx-1 my-1 opacity-25" : "mx-2 my-1 opacity-75" }, item.value);
            const choice = item.checkbox || item.selected !== undefined;
            const indicator = _jsx(Menu.ItemIndicator, { type: item.selectionIndicatorVariant, children: item.indicator == null ? undefined : _jsx("span", { style: { visibility: item.selected ? "visible" : "hidden" }, children: item.indicator }) });
            const content = _jsxs(_Fragment, { children: [choice && item.selectionIndicatorPosition !== "right" && indicator, (item.icon != null || item.reserveIconSpace) && _jsx("span", { className: "size-5 shrink-0", children: item.icon }), _jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [_jsx(Label, { children: item.label }), item.subtitle && _jsx(Description, { children: item.subtitle })] }), item.shortcut != null && _jsx("span", { className: "shrink-0 text-sm text-muted", children: item.shortcut }), choice && item.selectionIndicatorPosition === "right" && indicator, item.subMenu && _jsx(Menu.SubmenuIndicator, {})] });
            if (item.subMenu)
                return _jsxs(Menu.SubmenuTrigger, { children: [_jsx(Menu.Item, { ...item.herouiWebProps, id: item.value, textValue: item.textValue, isDisabled: item.disabled, children: content }), _jsx(Menu.Popover, { style: menuViewportStyle, "data-ui-menubar-owner": menubarOwner, children: _jsx(HeroUIOverlayLayer, { children: _jsx(Menu.Menu, { "aria-label": item.textValue, style: font, "data-ui-submenu": "", children: _jsx(MenuItems, { items: item.subMenu, menubarOwner: menubarOwner }) }) }) })] }, item.value);
            const row = _jsx(Menu.Item, { ...item.herouiWebProps, id: item.value, textValue: item.textValue, isDisabled: item.disabled, variant: item.destructive ? "danger" : "default", shouldCloseOnSelect: item.shouldCloseOnSelect ?? item.herouiWebProps?.shouldCloseOnSelect ?? !item.checkbox, onAction: item.onAction, children: content });
            return choice ? _jsx(Menu.Section, { "aria-label": item.textValue, selectionMode: item.selectionIndicatorVariant === "dot" ? "single" : "multiple", selectedKeys: item.selected ? [item.value] : [], onSelectionChange: () => { }, children: row }, item.value)
                : _jsx(Fragment, { children: row }, item.value);
        }) });
}
export function MenuSurface({ items, contentProps: c, accessibilityLabel, isNonModal, menubarOwner, onKeyDownCapture }) {
    const font = textWebStyle(useDefaultTextStyle());
    const container = useOverlayPortalContainer();
    const config = useMenuConfig();
    const { maxHeight, ...webProps } = c?.herouiWebProps ?? {};
    // RAC builds its collection after the first position pass. A maxHeight on
    // Popover prevents that pass from resetting the initial (empty) height, so
    // a bottom menu stays squeezed instead of flipping. Bound the menu instead.
    const contentMaxHeight = c?.maxHeight ?? maxHeight ?? config.webContentMaxHeight ?? 320;
    const side = c?.side ?? "bottom";
    const horizontal = side === "left" || side === "right";
    const align = c?.align ?? (horizontal ? "center" : "start");
    const edge = align === "center" ? "" : horizontal ? (align === "start" ? "top" : "bottom") : align;
    const placement = side + (edge ? " " + edge : "");
    const menu = _jsx(Menu.Menu, { "aria-label": accessibilityLabel ?? "菜单", style: { ...font, maxHeight: contentMaxHeight, overflowY: "auto" }, children: _jsx(MenuItems, { items: items, menubarOwner: menubarOwner }) });
    return _jsx(Menu.Popover, { ...webProps, UNSTABLE_portalContainer: container ?? undefined, "data-ui-menubar-owner": menubarOwner, isNonModal: isNonModal ?? c?.herouiWebProps?.isNonModal, shouldFlip: c?.herouiWebProps?.shouldFlip ?? true, className: c?.className, placement: c?.herouiWebProps?.placement ?? placement, offset: c?.sideOffset ?? c?.herouiWebProps?.offset ?? 8, style: { ...menuViewportStyle, ...c?.herouiWebProps?.style }, children: _jsx(HeroUIOverlayLayer, { children: onKeyDownCapture ? _jsx("div", { onKeyDownCapture: onKeyDownCapture, children: menu }) : menu }) });
}
