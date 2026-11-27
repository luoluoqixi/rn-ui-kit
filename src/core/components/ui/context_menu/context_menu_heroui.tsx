import { cloneElement, type JSX, type ReactElement } from "react";
import { Dropdown as Menu } from "@heroui/react/dropdown";
import { Pressable } from "react-aria-components/Pressable";
import { ClearPressResponder } from "react-aria/private/interactions/PressResponder";
import { Image, ScrollView, StyleSheet, Text, View, type PressableProps, type PressableStateCallbackType } from "react-native";
import { MenuSurface } from "../menu/menu_heroui";
import { useContextMenuModel } from "./context_menu_heroui_shared";
import type { ContextMenuProps } from "./types";

export function ContextMenuHeroUI(p: ContextMenuProps) {
  const m = useContextMenuModel(p);
  const { asChild, ...triggerProps } = p.triggerProps ?? {};
  const element = m.trigger as ReactElement<{ role?: string; style?: PressableProps["style"] }>;
  // 菜单的触发区域尺寸叠加在原布局上，不能覆盖文件行的 flex、缩进和按压反馈。
  const childStyle = element.props.style;
  const addedStyle = triggerProps.style;
  const style = addedStyle === undefined ? childStyle
    : typeof element.type === "string" ? StyleSheet.flatten([
      typeof childStyle === "function" ? undefined : childStyle,
      typeof addedStyle === "function" ? undefined : addedStyle,
    ]) : typeof childStyle === "function" || typeof addedStyle === "function"
      ? (state: PressableStateCallbackType) => [
        typeof childStyle === "function" ? childStyle(state) : childStyle,
        typeof addedStyle === "function" ? addedStyle(state) : addedStyle,
      ] : [childStyle, addedStyle];
  const props = { ...triggerProps, style };
  const interactive = asChild ?? ![View, Text, Image, ScrollView].some(type => element.type === type);
  const trigger = interactive ? cloneElement(element, props) as JSX.Element
    : <div role="button" aria-disabled={m.disabled || undefined}>{cloneElement(element, props)}</div>;
  // MenuTrigger merges ancestor PressResponder handlers and refs. Isolate each
  // root so nested regions open only their own menu and restore their own focus.
  return <ClearPressResponder><Menu {...p.herouiWebProps} trigger="contextMenu" isOpen={m.open} onOpenChange={m.setOpen}>
    <Pressable isDisabled={m.disabled}>{trigger}</Pressable>
    <MenuSurface items={m.items} contentProps={p.contentProps} accessibilityLabel={p.accessibilityLabel} />
  </Menu></ClearPressResponder>;
}
