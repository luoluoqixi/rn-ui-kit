import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip as HeroTooltip } from "@heroui/react/tooltip";
import { Pressable } from "react-aria-components/Pressable";
import { isValidElement } from "react";
import { Button } from "../button";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { useOverlayState } from "../utils/overlay/overlay_state";
import { useOverlayPortalContainer } from "../utils/overlay/overlay_portal_scope";
import { HeroUIOverlayLayer } from "../utils/overlay/heroui_layer.web";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
export function TooltipHeroUI(p) {
    const font = textWebStyle(useDefaultTextStyle());
    const contentStyle = p.contentProps?.herouiWebProps?.style;
    const s = useOverlayState(p, p.isDisabled);
    const container = useOverlayPortalContainer();
    return _jsxs(HeroTooltip, { ...p.herouiWebProps, isOpen: s.open, onOpenChange: s.setOpen, delay: p.delay ?? 400, closeDelay: p.closeDelay ?? 0, isDisabled: p.isDisabled, children: [_jsx(Pressable, { children: isValidElement(p.children) ? p.children : _jsx(Button, { children: p.children }) }), _jsx(HeroUIOverlayLayer, { children: _jsxs(HeroTooltip.Content, { ...p.contentProps?.herouiWebProps, UNSTABLE_portalContainer: container ?? undefined, className: cn("w-max max-w-[min(20rem,calc(100svw-2rem))]", p.contentProps?.className), placement: p.contentProps?.herouiWebProps?.placement ?? p.contentProps?.side ?? "top", style: state => ({ ...font, ...(typeof contentStyle === "function" ? contentStyle(state) : contentStyle) }), offset: p.contentProps?.herouiWebProps?.offset ?? p.contentProps?.sideOffset ?? 8, showArrow: p.showArrow, children: [p.showArrow && _jsx(HeroTooltip.Arrow, {}), resolveRenderProp(p.content, { open: s.open })] }) })] });
}
