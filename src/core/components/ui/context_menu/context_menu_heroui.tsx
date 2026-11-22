import { cloneElement, type JSX, type ReactElement } from "react";
import { Dropdown as Menu } from "@heroui/react/dropdown";
import { Pressable } from "react-aria-components/Pressable";
import { ClearPressResponder } from "react-aria/private/interactions/PressResponder";
import { Image, ScrollView, Text, View } from "react-native";
import { MenuSurface } from "../menu/menu_heroui";
import { useContextMenuModel } from "./context_menu_heroui_shared";
import type { ContextMenuProps } from "./types";

export function ContextMenuHeroUI(p: ContextMenuProps) {
  const m = useContextMenuModel(p);
  const { asChild, ...triggerProps } = p.triggerProps ?? {};
  const element = m.trigger as ReactElement<{ role?: string }>;
  const interactive = asChild ?? ![View, Text, Image, ScrollView].some(type => element.type === type);
  const trigger = interactive ? cloneElement(element, triggerProps) as JSX.Element
    : <div role="button" aria-disabled={m.disabled || undefined}>{cloneElement(element, triggerProps)}</div>;
  // MenuTrigger merges ancestor PressResponder handlers and refs. Isolate each
  // root so nested regions open only their own menu and restore their own focus.
  return <ClearPressResponder><Menu {...p.herouiWebProps} trigger="contextMenu" isOpen={m.open} onOpenChange={m.setOpen}>
    <Pressable isDisabled={m.disabled}>{trigger}</Pressable>
    <MenuSurface items={m.items} contentProps={p.contentProps} accessibilityLabel={p.accessibilityLabel} />
  </Menu></ClearPressResponder>;
}
