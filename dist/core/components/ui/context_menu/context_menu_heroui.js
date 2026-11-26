import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement } from "react";
import { Dropdown as Menu } from "@heroui/react/dropdown";
import { Pressable } from "react-aria-components/Pressable";
import { ClearPressResponder } from "react-aria/private/interactions/PressResponder";
import { Image, ScrollView, Text, View } from "react-native";
import { MenuSurface } from "../menu/menu_heroui";
import { useContextMenuModel } from "./context_menu_heroui_shared";
export function ContextMenuHeroUI(p) {
    const m = useContextMenuModel(p);
    const { asChild, ...triggerProps } = p.triggerProps ?? {};
    const element = m.trigger;
    const interactive = asChild ?? ![View, Text, Image, ScrollView].some(type => element.type === type);
    const trigger = interactive ? cloneElement(element, triggerProps)
        : _jsx("div", { role: "button", "aria-disabled": m.disabled || undefined, children: cloneElement(element, triggerProps) });
    // MenuTrigger merges ancestor PressResponder handlers and refs. Isolate each
    // root so nested regions open only their own menu and restore their own focus.
    return _jsx(ClearPressResponder, { children: _jsxs(Menu, { ...p.herouiWebProps, trigger: "contextMenu", isOpen: m.open, onOpenChange: m.setOpen, children: [_jsx(Pressable, { isDisabled: m.disabled, children: trigger }), _jsx(MenuSurface, { items: m.items, contentProps: p.contentProps, accessibilityLabel: p.accessibilityLabel })] }) });
}
