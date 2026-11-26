import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { Popover as HeroPopover } from "@heroui/react/popover";
import { Pressable } from "react-aria-components/Pressable";
import { Button } from "../button";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { isValidElement } from "react";
import { resolveRenderProp } from "../utils/render";
import { useOverlayState } from "../utils/overlay/overlay_state";
import { useOverlayPortalContainer } from "../utils/overlay/overlay_portal_scope";
import { HeroUIOverlayLayer } from "../utils/overlay/heroui_layer.web";
export function PopoverHeroUI(p) {
    const font = textWebStyle(useDefaultTextStyle());
    const s = useOverlayState(p, p.isDisabled);
    const container = useOverlayPortalContainer();
    const c = p.contentProps;
    const trigger = p.trigger ?? p.children;
    const content = resolveRenderProp(p.content, { open: s.open, close: s.close });
    return _jsxs(HeroPopover, { ...p.herouiWebProps, isOpen: s.open, onOpenChange: s.setOpen, children: [_jsx(Pressable, { isDisabled: p.isDisabled, children: isValidElement(trigger) ? trigger : _jsx(Button, { isDisabled: p.isDisabled, children: trigger }) }), _jsxs(HeroPopover.Content, { ...c?.herouiWebProps, UNSTABLE_portalContainer: container ?? undefined, placement: (c?.herouiWebProps?.placement ?? `${c?.side ?? "bottom"}${c?.align && c.align !== "center" ? ` ${c.align}` : ""}`), offset: c?.herouiWebProps?.offset ?? c?.sideOffset ?? 8, className: cn("w-72 max-w-[calc(100svw-2rem)]", p.contentClassName, c?.className), children: [p.showArrow && _jsx(HeroPopover.Arrow, {}), _jsx(HeroUIOverlayLayer, { children: _jsxs(HeroPopover.Dialog, { "aria-label": p.accessibilityLabel ?? (typeof p.title === "string" ? p.title : "详细信息"), className: "gap-3", style: font, children: [p.title != null && _jsx(HeroPopover.Heading, { children: p.title }), p.description != null && _jsx(Text, { color: "muted", children: p.description }), typeof content === "string" || typeof content === "number" ? _jsx(Text, { children: content }) : content] }) })] })] });
}
