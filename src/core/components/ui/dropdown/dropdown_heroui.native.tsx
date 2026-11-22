import { Menu } from "heroui-native/menu";
import { HeroUIWindowAnchor } from "../utils/overlay/heroui_anchor.native";
import { MenuSurface } from "../menu/menu_heroui.native";
import { dropdownEntries, useDropdownModel } from "./dropdown_heroui_shared";
import type { DropdownProps } from "./types";

export function DropdownHeroUI(p: DropdownProps) {
  const m = useDropdownModel(p);
  return <Menu {...p.herouiNativeProps} isOpen={m.open} onOpenChange={m.setOpen} isDisabled={m.disabled}>
    <Menu.Trigger asChild><HeroUIWindowAnchor isOpen={m.open}>{m.trigger}</HeroUIWindowAnchor></Menu.Trigger>
    <MenuSurface items={dropdownEntries(p.items ?? [], p, m.activate)}
      contentProps={p.contentProps} accessibilityLabel={p.accessibilityLabel} />
  </Menu>;
}
