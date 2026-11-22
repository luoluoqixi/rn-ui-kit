import { Dropdown as Menu } from "@heroui/react/dropdown";
import { Pressable } from "react-aria-components/Pressable";
import { MenuSurface } from "../menu/menu_heroui";
import { dropdownEntries, useDropdownModel } from "./dropdown_heroui_shared";
import type { DropdownProps } from "./types";

export function DropdownHeroUI(p: DropdownProps) {
  const m = useDropdownModel(p);
  return <Menu {...p.herouiWebProps} isOpen={m.open} onOpenChange={m.setOpen}>
    <Pressable isDisabled={m.disabled}>{m.trigger}</Pressable>
    <MenuSurface items={dropdownEntries(p.items ?? [], p, m.activate)}
      contentProps={p.contentProps} accessibilityLabel={p.accessibilityLabel} />
  </Menu>;
}
