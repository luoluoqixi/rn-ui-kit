import { useDefaultTextStyle } from "../provider/font_provider";
import { Fragment } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu } from "heroui-native/menu";
import { SubMenu } from "heroui-native/sub-menu";
import { Separator } from "../separator";
import { Text } from "../text";
import { resolveRenderProp } from "../utils/render";
import { HeroUIWindowAnchor, HeroUIWindowOverlayScope } from "../utils/overlay/heroui_anchor.native";
import { dropdownText, useDropdownModel } from "./dropdown_heroui_shared";
import type { DropdownItemData, DropdownProps } from "./types";

function Items({ items, props: p, activate }: { items: DropdownItemData[]; props: DropdownProps; activate: (i: DropdownItemData) => void }) {
  const font = useDefaultTextStyle();
  return <>{items.map(item => {
    if (item.separator) return <Separator key={item.value} variant={item.separatorVariant}
      className={item.separatorVariant === "thick" ? "-mx-[5px] my-1 opacity-25" : "mx-2 my-1 opacity-75"} />;
    const label = resolveRenderProp(item.label, item);
    const icon = resolveRenderProp(item.icon, item);
    const choice = item.checkbox || item.selected !== undefined;
    const position = item.selectionIndicatorPosition ?? p.selectionIndicatorPosition ?? "left";
    const content = <>
      {choice && position === "left" && <Menu.ItemIndicator variant={item.selectionIndicatorVariant}>{resolveRenderProp(item.indicator, item)}</Menu.ItemIndicator>}
      {(icon != null || item.reserveIconSpace === true) && <View className="size-5 shrink-0">{icon}</View>}
      <View className="flex-1"><Menu.ItemTitle style={font}>{label}</Menu.ItemTitle>{item.subtitle && <Menu.ItemDescription style={font}>{item.subtitle}</Menu.ItemDescription>}</View>
      {item.shortcut != null && <Text className="shrink-0 text-sm" color="muted" style={font}>{item.shortcut}</Text>}
      {choice && position === "right" && <Menu.ItemIndicator variant={item.selectionIndicatorVariant}>{resolveRenderProp(item.indicator, item)}</Menu.ItemIndicator>}
    </>;
    if (item.subMenu) return <SubMenu key={item.value} isDisabled={item.disabled}>
      <SubMenu.Trigger textValue={dropdownText(item)}>{icon}<Text className="flex-1 text-base font-medium text-foreground" style={font}>{label}</Text><SubMenu.TriggerIndicator /></SubMenu.Trigger>
      <SubMenu.Content>
        {item.subMenuTitle !== false && <Menu.Label style={font}>{resolveRenderProp(item.subMenuTitle, item) ?? label}</Menu.Label>}
        <Items items={item.subMenu} props={p} activate={activate} />
      </SubMenu.Content>
    </SubMenu>;
    return <Fragment key={item.value}><Menu.Item {...p.herouiNativeItemProps} {...item.herouiNativeProps}
      id={item.value} accessibilityLabel={dropdownText(item)} isDisabled={item.disabled}
      isSelected={choice ? !!item.selected : undefined} variant={item.destructive ? "danger" : "default"}
      shouldCloseOnSelect={item.shouldCloseOnSelect ?? item.herouiNativeProps?.shouldCloseOnSelect ?? !item.checkbox}
      onPress={() => activate(item)}>{content}</Menu.Item></Fragment>;
  })}</>;
}
export function DropdownHeroUI(p: DropdownProps) {
  const m = useDropdownModel(p);
  const c = p.contentProps;
  const placement = c?.herouiNativeProps?.placement ?? c?.side ?? "bottom";
  const align = c?.herouiNativeProps?.align ?? c?.align ?? (placement === "top" || placement === "bottom" ? "center" : "start");
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const maxHeight = Math.max(1, Math.min(c?.maxHeight ?? 320, height - insets.top - insets.bottom - 32));
  return <Menu {...p.herouiNativeProps} isOpen={m.open} onOpenChange={m.setOpen} isDisabled={m.disabled}>
    <Menu.Trigger asChild><HeroUIWindowAnchor isOpen={m.open}>{m.trigger}</HeroUIWindowAnchor></Menu.Trigger>
    <Menu.Portal><HeroUIWindowOverlayScope><Menu.Overlay /><Menu.Content {...c?.herouiNativeProps} presentation="popover"
      placement={placement} align={align} offset={c?.herouiNativeProps?.offset ?? c?.sideOffset ?? 8}
      className={c?.className} accessibilityLabel={p.accessibilityLabel ?? "菜单"}>
      <ScrollView style={{ maxHeight, marginHorizontal: -5 }} contentContainerStyle={{ paddingHorizontal: 5 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
        <Items items={p.items ?? []} props={p} activate={m.activate} />
      </ScrollView>
    </Menu.Content></HeroUIWindowOverlayScope></Menu.Portal>
  </Menu>;
}
