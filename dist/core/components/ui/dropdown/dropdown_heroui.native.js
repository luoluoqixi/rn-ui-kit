import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu } from "heroui-native/menu";
import { HeroUIWindowAnchor } from "../utils/overlay/heroui_anchor.native";
import { MenuSurface } from "../menu/menu_heroui.native";
import { dropdownEntries, useDropdownModel } from "./dropdown_heroui_shared";
export function DropdownHeroUI(p) {
    const m = useDropdownModel(p);
    return _jsxs(Menu, { ...p.herouiNativeProps, isOpen: m.open, onOpenChange: m.setOpen, isDisabled: m.disabled, children: [_jsx(Menu.Trigger, { asChild: true, children: _jsx(HeroUIWindowAnchor, { isOpen: m.open, children: m.trigger }) }), _jsx(MenuSurface, { items: dropdownEntries(p.items ?? [], p, m.activate), contentProps: p.contentProps, accessibilityLabel: p.accessibilityLabel })] });
}
