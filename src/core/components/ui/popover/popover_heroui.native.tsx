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
import type { PopoverProps } from "./types";
export function PopoverHeroUI(p: PopoverProps) {
  const portalHostName = useHeroUIOverlayPortalHostName();
  const font = useDefaultTextStyle();
  const s = useOverlayState(p, p.isDisabled);
  const c = p.contentProps;
  const trigger = p.trigger ?? p.children;
  const content = resolveRenderProp(p.content, { open: s.open, close: s.close });
  return <HeroPopover {...p.herouiNativeProps} isOpen={s.open} onOpenChange={s.setOpen}>
    <HeroPopover.Trigger asChild isDisabled={p.isDisabled}><HeroUIWindowAnchor isOpen={s.open}>{isValidElement(trigger) ? trigger : <Button isDisabled={p.isDisabled}>{trigger}</Button>}</HeroUIWindowAnchor></HeroPopover.Trigger>
    <HeroPopover.Portal hostName={portalHostName}><HeroUIWindowOverlayScope>
      <HeroPopover.Overlay />
      <HeroPopover.Content
        // Composite Android entering opacity here; the HeroUI patch does the
        // same on its exit wrapper. Keep hardware texture caching off so the
        // surface's outer box-shadow is not clipped to rectangular bounds.
        needsOffscreenAlphaCompositing={Platform.OS === "android"}
        {...c?.herouiNativeProps} presentation="popover"
        placement={c?.herouiNativeProps?.placement ?? c?.side ?? "bottom"} align={c?.herouiNativeProps?.align ?? c?.align ?? "center"}
        offset={c?.herouiNativeProps?.offset ?? c?.sideOffset ?? 8} className={cn("gap-3", p.contentClassName, c?.className)}>
        {p.showArrow && <HeroPopover.Arrow />}
        {p.title != null && <HeroPopover.Title style={font}>{p.title}</HeroPopover.Title>}
        {p.description != null && <HeroPopover.Description style={font}>{p.description}</HeroPopover.Description>}
        {typeof content === "string" || typeof content === "number" ? <Text>{content}</Text> : content}
      </HeroPopover.Content>
    </HeroUIWindowOverlayScope></HeroPopover.Portal>
  </HeroPopover>;
}
