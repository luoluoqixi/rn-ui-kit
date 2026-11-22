import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { Fragment, type ComponentProps, type CSSProperties } from "react";
import { Dropdown as Menu } from "@heroui/react/dropdown";
import { Label } from "@heroui/react/label";
import { Description } from "@heroui/react/description";
import { Separator } from "../separator";
import { Pressable } from "react-aria-components/Pressable";
import { resolveRenderProp } from "../utils/render";
import { useOverlayPortalContainer } from "../utils/overlay/overlay_portal_scope";
import { HeroUIOverlayLayer } from "../utils/overlay/heroui_layer.web";
import { useMenuConfig } from "../context_menu/menu_provider";
import { dropdownText, useDropdownModel } from "./dropdown_heroui_shared";
import type { DropdownItemData, DropdownProps } from "./types";

// Dialog and TrueSheet provide zero-size positioning hosts. Preserve HeroUI's
// 55-spacing floor and viewport cap without resolving 100% against those hosts.
const menuViewportStyle: CSSProperties = {
  minWidth: "min(calc(var(--spacing) * 55), calc(100svw - 2rem))",
  maxWidth: "calc(100svw - 2rem)",
};

function Items({ items, props: p, activate }: { items: DropdownItemData[]; props: DropdownProps; activate: (i: DropdownItemData) => void }) {
  const font = textWebStyle(useDefaultTextStyle());
  return <>{items.map(item => {
    if (item.separator) return <Separator key={item.value} variant={item.separatorVariant}
      thickness={item.separatorVariant === "thick" ? 6 : undefined}
      className={item.separatorVariant === "thick" ? "-mx-1 my-1 opacity-25" : "mx-2 my-1 opacity-75"} />;
    const label = resolveRenderProp(item.label, item);
    const icon = resolveRenderProp(item.icon, item);
    const indicator = resolveRenderProp(item.indicator, item);
    const isChoice = item.checkbox || item.selected !== undefined;
    const position = item.selectionIndicatorPosition ?? p.selectionIndicatorPosition ?? "left";
    const content = <>
      {isChoice && position === "left" && <Menu.ItemIndicator>{indicator ?? (item.selectionIndicatorVariant === "dot" ? <span className="size-1.5 rounded-full bg-current" /> : undefined)}</Menu.ItemIndicator>}
      {(icon != null || item.reserveIconSpace === true) && <span className="size-5 shrink-0">{icon}</span>}
      <span className="flex min-w-0 flex-1 flex-col"><Label>{label}</Label>{item.subtitle && <Description>{item.subtitle}</Description>}</span>
      {item.shortcut != null && <span className="shrink-0 text-sm text-muted">{item.shortcut}</span>}
      {isChoice && position === "right" && <Menu.ItemIndicator>{indicator ?? (item.selectionIndicatorVariant === "dot" ? <span className="size-1.5 rounded-full bg-current" /> : undefined)}</Menu.ItemIndicator>}
      {item.subMenu && <Menu.SubmenuIndicator />}
    </>;
    if (item.subMenu) return <Menu.SubmenuTrigger key={item.value}>
      <Menu.Item id={item.value} textValue={dropdownText(item)} isDisabled={item.disabled}>{content}</Menu.Item>
      {/* React Aria owns the submenu portal inside the root popover group.
          Moving it to the surrounding Dialog scope makes the root menu inert it. */}
      <Menu.Popover style={menuViewportStyle}>
        <HeroUIOverlayLayer><Menu.Menu aria-label={dropdownText(item)} style={font}><Items items={item.subMenu} props={p} activate={activate} /></Menu.Menu></HeroUIOverlayLayer>
      </Menu.Popover>
    </Menu.SubmenuTrigger>;
    const row = <Menu.Item {...p.herouiWebItemProps} {...item.herouiWebProps}
      id={item.value} textValue={dropdownText(item)} isDisabled={item.disabled}
      variant={item.destructive ? "danger" : "default"}
      shouldCloseOnSelect={item.shouldCloseOnSelect ?? item.herouiWebProps?.shouldCloseOnSelect ?? !item.checkbox}
      onAction={() => activate(item)}>{content}</Menu.Item>;
    return isChoice ? <Menu.Section key={item.value} aria-label={dropdownText(item)} selectionMode={item.selectionIndicatorVariant === "dot" ? "single" : "multiple"}
      selectedKeys={item.selected ? [item.value] : []} onSelectionChange={() => {}}>{row}</Menu.Section>
      : <Fragment key={item.value}>{row}</Fragment>;
  })}</>;
}
export function DropdownHeroUI(p: DropdownProps) {
  const font = textWebStyle(useDefaultTextStyle());
  const m = useDropdownModel(p);
  const container = useOverlayPortalContainer();
  const config = useMenuConfig();
  const c = p.contentProps;
  const side = c?.side ?? "bottom";
  const horizontal = side === "left" || side === "right";
  const align = c?.align ?? (horizontal ? "center" : "start");
  const edge = align === "center" ? "" : horizontal ? (align === "start" ? "top" : "bottom") : align;
  const placement = side + (edge ? " " + edge : "");
  return <Menu {...p.herouiWebProps} isOpen={m.open} onOpenChange={m.setOpen}>
    <Pressable isDisabled={m.disabled}>{m.trigger}</Pressable>
    <Menu.Popover {...c?.herouiWebProps} UNSTABLE_portalContainer={container ?? undefined}
      maxHeight={c?.maxHeight ?? c?.herouiWebProps?.maxHeight ?? (config.webContentMaxHeight == null ? 320 : undefined)}
      className={c?.className} placement={c?.herouiWebProps?.placement ?? placement as ComponentProps<typeof Menu.Popover>["placement"]}
      offset={c?.sideOffset ?? 8} style={{ ...menuViewportStyle, maxHeight: c?.maxHeight ?? config.webContentMaxHeight ?? 320, overflowY: "auto", ...c?.herouiWebProps?.style }}>
      <HeroUIOverlayLayer><Menu.Menu aria-label={p.accessibilityLabel ?? "菜单"}
        style={{ ...font, ...(config.webContentMaxHeight != null && c?.maxHeight == null ? { maxHeight: config.webContentMaxHeight, overflowY: "auto" } : {}) }}><Items items={p.items ?? []} props={p} activate={m.activate} /></Menu.Menu></HeroUIOverlayLayer>
    </Menu.Popover>
  </Menu>;
}
