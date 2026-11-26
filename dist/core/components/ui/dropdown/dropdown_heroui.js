import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dropdown as Menu } from "@heroui/react/dropdown";
import { Pressable } from "react-aria-components/Pressable";
import { MenuSurface } from "../menu/menu_heroui";
import { dropdownEntries, useDropdownModel } from "./dropdown_heroui_shared";
export function DropdownHeroUI(p) {
    const m = useDropdownModel(p);
    return _jsxs(Menu, { ...p.herouiWebProps, isOpen: m.open, onOpenChange: m.setOpen, children: [_jsx(Pressable, { isDisabled: m.disabled, children: m.trigger }), _jsx(MenuSurface, { items: dropdownEntries(p.items ?? [], p, m.activate), contentProps: p.contentProps, accessibilityLabel: p.accessibilityLabel })] });
}
