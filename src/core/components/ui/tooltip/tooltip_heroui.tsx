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
import type { TooltipProps } from "./types";
export function TooltipHeroUI(p: TooltipProps) {
  const font = textWebStyle(useDefaultTextStyle());
  const contentStyle = p.contentProps?.herouiWebProps?.style;
  const s = useOverlayState(p, p.isDisabled);
  const container = useOverlayPortalContainer();
  return <HeroTooltip {...p.herouiWebProps} isOpen={s.open} onOpenChange={s.setOpen}
    delay={p.delay ?? 400} closeDelay={p.closeDelay ?? 0} isDisabled={p.isDisabled}>
    <Pressable>{isValidElement(p.children) ? p.children : <Button>{p.children}</Button>}</Pressable>
    <HeroUIOverlayLayer><HeroTooltip.Content {...p.contentProps?.herouiWebProps} UNSTABLE_portalContainer={container ?? undefined}
      className={p.contentProps?.className} placement={p.contentProps?.herouiWebProps?.placement ?? p.contentProps?.side ?? "top"}
      style={state => ({ ...font, ...(typeof contentStyle === "function" ? contentStyle(state) : contentStyle) })}
      offset={p.contentProps?.herouiWebProps?.offset ?? p.contentProps?.sideOffset ?? 8} showArrow={p.showArrow}>
      {p.showArrow && <HeroTooltip.Arrow />}
      {resolveRenderProp(p.content, { open: s.open })}
    </HeroTooltip.Content></HeroUIOverlayLayer>
  </HeroTooltip>;
}
