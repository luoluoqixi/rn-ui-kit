import { useButtonWebInterop } from "../button/button_web_interop";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { forwardRef, type ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { Select as HeroSelect } from "@heroui/react/select";
import { ListBox } from "@heroui/react/list-box";
import { Header } from "react-aria-components/Header";
import { Label } from "@heroui/react/label";
import { Description } from "@heroui/react/description";
import { NativeTriggerFace } from "../native_trigger";
import { useOverlayPortalContainer } from "../utils/overlay/overlay_portal_scope";
import { HeroUIOverlayLayer } from "../utils/overlay/heroui_layer.web";
import { useMenuConfig } from "../context_menu/menu_provider";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { getSelectTriggerFontSize, itemLabel, SelectedLabel } from "./shared";
import { useHeroSelect } from "./select_heroui_shared";
import type { SelectHandle, SelectProps } from "./types";

export const SelectHeroUI = forwardRef<SelectHandle, SelectProps>(function SelectHeroUI(p, ref) {
  const m = useHeroSelect(p, ref);
  const container = useOverlayPortalContainer();
  const config = useMenuConfig();
  const c = p.contentProps;
  const native = p.nativeTrigger;
  const np = p.nativeTriggerProps;
  const font = textWebStyle(useDefaultTextStyle());
  const bridge = useButtonWebInterop({ ...(native ? np : p.triggerProps), disabled: m.disabled }, undefined, undefined);
  const side = c?.side ?? "bottom";
  const horizontal = side === "left" || side === "right";
  const align = c?.align ?? (horizontal ? "center" : "start");
  const edge = align === "center" ? "" : horizontal ? (align === "start" ? "top" : "bottom") : align;
  const placement = side + (edge ? " " + edge : "");
  return <HeroSelect {...p.herouiWebProps} aria-label={p.accessibilityLabel ?? "选择"} isDisabled={m.disabled}
    value={m.value ?? null} onChange={key => m.setValue(key == null ? null : String(key))}
    isOpen={m.open} onOpenChange={m.setOpen} placeholder={typeof p.placeholder === "string" ? p.placeholder : "选择"}
    className={p.className} style={{ ...font, ...StyleSheet.flatten(p.style) as React.CSSProperties }}>
    <HeroSelect.Trigger {...bridge.domProps} ref={bridge.ref} style={bridge.domProps.style} className={cn(native && "h-auto min-h-0 w-auto border-0 bg-transparent p-0 shadow-none", native && p.nativeTriggerHoverBackground !== false && "rounded-md hover:bg-accent-soft data-[pressed=true]:bg-accent-soft", native && np?.className, p.triggerProps?.className)}
      onClick={e => { bridge.domProps.onClick?.(e); if (native) e.stopPropagation(); }}
      onContextMenu={e => { if (native) { e.preventDefault(); e.stopPropagation(); } bridge.domProps.onContextMenu?.(e); }}>
      {({ isPressed, isHovered }) => native ? <NativeTriggerFace
        label={<SelectedLabel props={p} value={m.value} labelProps={p.nativeTriggerLabelProps} defaultFontSize={getSelectTriggerFontSize(p)} defaultFontWeight={p.triggerFontWeight} />}
        content={p.nativeTriggerContent} containerStyle={p.nativeTriggerContainerStyle} icon={p.nativeTriggerIcon} iconColor={np?.iconColor}
        labelProps={p.nativeTriggerLabelProps} fontWeight={p.triggerFontWeight ?? np?.fontWeight} size={p.triggerSize ?? np?.size}
        opacity={m.disabled ? p.nativeTriggerFeedbackOpacity?.disabled ?? .5 : m.open || isPressed ? p.nativeTriggerFeedbackOpacity?.webPress ?? .6 : isHovered && p.nativeTriggerHoverOpacity ? p.nativeTriggerFeedbackOpacity?.webHover ?? .7 : 1} />
        : <><HeroSelect.Value>{() => <SelectedLabel props={p} value={m.value} defaultOpacity={1} />}</HeroSelect.Value><HeroSelect.Indicator /></>}
    </HeroSelect.Trigger>
    <HeroSelect.Popover {...c?.herouiWebProps} UNSTABLE_portalContainer={container ?? undefined}
      className={c?.className} placement={c?.herouiWebProps?.placement ?? placement as ComponentProps<typeof HeroSelect.Popover>["placement"]}
      offset={c?.sideOffset ?? 8} style={{ maxHeight: config.webContentMaxHeight, ...c?.herouiWebProps?.style }}>
      <HeroUIOverlayLayer><ListBox aria-label={p.accessibilityLabel ?? "选项"}>
        {m.groups.map(group => <ListBox.Section key={group.key} aria-label={typeof group.label === "string" ? group.label : "选项"}>
          {group.label != null && <Header>{resolveRenderProp(group.label, { value: m.value ?? "" })}</Header>}
          {group.items.map(item => {
            const ctx = { checked: item.value === m.value, selected: item.value === m.value, disabled: !!(item.disabled ?? item.isDisabled), value: item.value };
            return <ListBox.Item {...p.itemProps?.herouiWebProps} {...item.itemProps?.herouiWebProps} key={item.value} id={item.value}
              textValue={itemLabel(item, m.value)} isDisabled={ctx.disabled} className={item.itemProps?.className ?? p.itemProps?.className}>
              {item.swatchColor && <span className="size-4 shrink-0 rounded-full" style={{ backgroundColor: item.swatchColor }} />}
              {resolveRenderProp(item.startContent, ctx)}
              <span className="flex min-w-0 flex-1 flex-col"><Label>{resolveRenderProp(item.label, ctx)}</Label>
                {item.description != null && <Description>{resolveRenderProp(item.description, ctx)}</Description>}
              </span>{resolveRenderProp(item.endContent, ctx)}<ListBox.ItemIndicator {...p.itemIndicatorProps} />
            </ListBox.Item>;
          })}
        </ListBox.Section>)}
      </ListBox></HeroUIOverlayLayer>
    </HeroSelect.Popover>
  </HeroSelect>;
});
