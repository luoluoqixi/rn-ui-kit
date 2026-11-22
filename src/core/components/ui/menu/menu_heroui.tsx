import { Fragment, type ComponentProps, type CSSProperties } from "react";
import { Dropdown as Menu } from "@heroui/react/dropdown";
import { Label } from "@heroui/react/label";
import { Description } from "@heroui/react/description";
import { Separator } from "../separator";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { useOverlayPortalContainer } from "../utils/overlay/overlay_portal_scope";
import { HeroUIOverlayLayer } from "../utils/overlay/heroui_layer.web";
import { useMenuConfig } from "../context_menu/menu_provider";
import type { MenuEntry, MenuSurfaceProps } from "./types";

// Scoped Dialog / Sheet hosts may have zero size. Size against the viewport.
const menuViewportStyle: CSSProperties = {
  minWidth: "min(calc(var(--spacing) * 55), calc(100svw - 2rem))",
  maxWidth: "calc(100svw - 2rem)",
};

function MenuItems({ items }: { items: MenuEntry[] }) {
  const font = textWebStyle(useDefaultTextStyle());
  return <>{items.map(item => {
    if (item.separator) return <Separator key={item.value} variant={item.separatorVariant}
      thickness={item.separatorVariant === "thick" ? 6 : undefined}
      className={item.separatorVariant === "thick" ? "-mx-1 my-1 opacity-25" : "mx-2 my-1 opacity-75"} />;
    const choice = item.checkbox || item.selected !== undefined;
    const indicator = <Menu.ItemIndicator type={item.selectionIndicatorVariant}>
      {item.indicator == null ? undefined : <span style={{ visibility: item.selected ? "visible" : "hidden" }}>{item.indicator}</span>}
    </Menu.ItemIndicator>;
    const content = <>
      {choice && item.selectionIndicatorPosition !== "right" && indicator}
      {(item.icon != null || item.reserveIconSpace) && <span className="size-5 shrink-0">{item.icon}</span>}
      <span className="flex min-w-0 flex-1 flex-col"><Label>{item.label}</Label>
        {item.subtitle && <Description>{item.subtitle}</Description>}</span>
      {item.shortcut != null && <span className="shrink-0 text-sm text-muted">{item.shortcut}</span>}
      {choice && item.selectionIndicatorPosition === "right" && indicator}
      {item.subMenu && <Menu.SubmenuIndicator />}
    </>;
    if (item.subMenu) return <Menu.SubmenuTrigger key={item.value}>
      <Menu.Item {...item.herouiWebProps} id={item.value} textValue={item.textValue} isDisabled={item.disabled}>{content}</Menu.Item>
      {/* Keep nested popovers in React Aria's own group, inside the root portal. */}
      <Menu.Popover style={menuViewportStyle}>
        <HeroUIOverlayLayer><Menu.Menu aria-label={item.textValue} style={font} data-ui-submenu="">
          <MenuItems items={item.subMenu} />
        </Menu.Menu></HeroUIOverlayLayer>
      </Menu.Popover>
    </Menu.SubmenuTrigger>;
    const row = <Menu.Item {...item.herouiWebProps} id={item.value} textValue={item.textValue}
      isDisabled={item.disabled} variant={item.destructive ? "danger" : "default"}
      shouldCloseOnSelect={item.shouldCloseOnSelect ?? item.herouiWebProps?.shouldCloseOnSelect ?? !item.checkbox}
      onAction={item.onAction}>{content}</Menu.Item>;
    return choice ? <Menu.Section key={item.value} aria-label={item.textValue}
      selectionMode={item.selectionIndicatorVariant === "dot" ? "single" : "multiple"}
      selectedKeys={item.selected ? [item.value] : []} onSelectionChange={() => {}}>{row}</Menu.Section>
      : <Fragment key={item.value}>{row}</Fragment>;
  })}</>;
}

export function MenuSurface({ items, contentProps: c, accessibilityLabel, isNonModal, onKeyDownCapture }: MenuSurfaceProps) {
  const font = textWebStyle(useDefaultTextStyle());
  const container = useOverlayPortalContainer();
  const config = useMenuConfig();
  const side = c?.side ?? "bottom";
  const horizontal = side === "left" || side === "right";
  const align = c?.align ?? (horizontal ? "center" : "start");
  const edge = align === "center" ? "" : horizontal ? (align === "start" ? "top" : "bottom") : align;
  const placement = side + (edge ? " " + edge : "");
  const menu = <Menu.Menu aria-label={accessibilityLabel ?? "菜单"}
    style={{ ...font, ...(config.webContentMaxHeight != null && c?.maxHeight == null ? { maxHeight: config.webContentMaxHeight, overflowY: "auto" } : {}) }}>
    <MenuItems items={items} />
  </Menu.Menu>;
  return <Menu.Popover {...c?.herouiWebProps} UNSTABLE_portalContainer={container ?? undefined}
    isNonModal={isNonModal ?? c?.herouiWebProps?.isNonModal}
    maxHeight={c?.maxHeight ?? c?.herouiWebProps?.maxHeight ?? (config.webContentMaxHeight == null ? 320 : undefined)}
    className={c?.className} placement={c?.herouiWebProps?.placement ?? placement as ComponentProps<typeof Menu.Popover>["placement"]}
    offset={c?.sideOffset ?? c?.herouiWebProps?.offset ?? 8}
    style={{ ...menuViewportStyle, maxHeight: c?.maxHeight ?? config.webContentMaxHeight ?? 320, overflowY: "auto", ...c?.herouiWebProps?.style }}>
    <HeroUIOverlayLayer>{onKeyDownCapture ? <div onKeyDownCapture={onKeyDownCapture}>{menu}</div> : menu}</HeroUIOverlayLayer>
  </Menu.Popover>;
}
