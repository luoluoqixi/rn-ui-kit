import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDefaultTextStyle } from "../provider/font_provider";
import { Popover as HeroPopover } from "heroui-native/popover";
import { isValidElement } from "react";
import { Platform } from "react-native";
import { Button } from "../button";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { useOverlayState } from "../utils/overlay/overlay_state";
import { HeroUIWindowAnchor, HeroUIWindowOverlayScope, useHeroUIOverlayPortalHostName } from "../utils/overlay/heroui_anchor.native";
export function PopoverHeroUI(p) {
    const portalHostName = useHeroUIOverlayPortalHostName();
    const font = useDefaultTextStyle();
    const s = useOverlayState(p, p.isDisabled);
    const c = p.contentProps;
    const trigger = p.trigger ?? p.children;
    const content = resolveRenderProp(p.content, { open: s.open, close: s.close });
    return _jsxs(HeroPopover, { ...p.herouiNativeProps, isOpen: s.open, onOpenChange: s.setOpen, children: [_jsx(HeroPopover.Trigger, { asChild: true, isDisabled: p.isDisabled, children: _jsx(HeroUIWindowAnchor, { isOpen: s.open, children: isValidElement(trigger) ? trigger : _jsx(Button, { isDisabled: p.isDisabled, children: trigger }) }) }), _jsx(HeroPopover.Portal, { hostName: portalHostName, children: _jsxs(HeroUIWindowOverlayScope, { children: [_jsx(HeroPopover.Overlay, {}), _jsxs(HeroPopover.Content
                        // Composite Android entering opacity here; the HeroUI patch does the
                        // same on its exit wrapper. Keep hardware texture caching off so the
                        // surface's outer box-shadow is not clipped to rectangular bounds.
                        , { 
                            // Composite Android entering opacity here; the HeroUI patch does the
                            // same on its exit wrapper. Keep hardware texture caching off so the
                            // surface's outer box-shadow is not clipped to rectangular bounds.
                            needsOffscreenAlphaCompositing: Platform.OS === "android", ...c?.herouiNativeProps, presentation: "popover", placement: c?.herouiNativeProps?.placement ?? c?.side ?? "bottom", align: c?.herouiNativeProps?.align ?? c?.align ?? "center", offset: c?.herouiNativeProps?.offset ?? c?.sideOffset ?? 8, className: cn("gap-3", p.contentClassName, c?.className), children: [p.showArrow && _jsx(HeroPopover.Arrow, {}), p.title != null && _jsx(HeroPopover.Title, { style: font, children: p.title }), p.description != null && _jsx(HeroPopover.Description, { style: font, children: p.description }), typeof content === "string" || typeof content === "number" ? _jsx(Text, { children: content }) : content] })] }) })] });
}
