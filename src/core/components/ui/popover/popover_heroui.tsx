import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { Popover as HeroPopover } from "@heroui/react/popover";
import { Pressable } from "react-aria-components/Pressable";
import { Button } from "../button";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { isValidElement, type ComponentProps } from "react";
import { resolveRenderProp } from "../utils/render";
import { useOverlayState } from "../utils/overlay/overlay_state";
import { useOverlayPortalContainer } from "../utils/overlay/overlay_portal_scope";
import { HeroUIOverlayLayer } from "../utils/overlay/heroui_layer.web";
import type { PopoverProps } from "./types";
export function PopoverHeroUI(p: PopoverProps) {
  const font = textWebStyle(useDefaultTextStyle());
  const s = useOverlayState(p, p.isDisabled);
  const container = useOverlayPortalContainer();
  const c = p.contentProps;
  const trigger = p.trigger ?? p.children;
  const content = resolveRenderProp(p.content, { open: s.open, close: s.close });
  return <HeroPopover {...p.herouiWebProps} isOpen={s.open} onOpenChange={s.setOpen}>
    <Pressable isDisabled={p.isDisabled}>{isValidElement(trigger) ? trigger : <Button isDisabled={p.isDisabled}>{trigger}</Button>}</Pressable>
    <HeroPopover.Content {...c?.herouiWebProps} UNSTABLE_portalContainer={container ?? undefined}
      placement={(c?.herouiWebProps?.placement ?? `${c?.side ?? "bottom"}${c?.align && c.align !== "center" ? ` ${c.align}` : ""}`) as ComponentProps<typeof HeroPopover.Content>["placement"]}
      offset={c?.herouiWebProps?.offset ?? c?.sideOffset ?? 8}
      className={cn(p.contentClassName, c?.className)}>
      {p.showArrow && <HeroPopover.Arrow />}
      <HeroUIOverlayLayer><HeroPopover.Dialog aria-label={p.accessibilityLabel ?? (typeof p.title === "string" ? p.title : "详细信息")} className="gap-3" style={font}>
        {p.title != null && <HeroPopover.Heading>{p.title}</HeroPopover.Heading>}
        {p.description != null && <Text color="muted">{p.description}</Text>}
        {typeof content === "string" || typeof content === "number" ? <Text>{content}</Text> : content}
      </HeroPopover.Dialog></HeroUIOverlayLayer>
    </HeroPopover.Content>
  </HeroPopover>;
}
