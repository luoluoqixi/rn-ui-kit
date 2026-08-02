import type { ComponentProps, ReactNode } from "react";
import type { Menu as TamaguiMenu } from "tamagui";

import type { NativeTriggerFaceProps, NativeTriggerIcon } from "../native_trigger";
import type { NativeHapticsSetting } from "../utils";

export interface MenuItemData {
  "aria-label"?: string;
  destructive?: boolean;
  disabled?: boolean;
  indicator?: ReactNode;
  label?: ReactNode;
  onPress?: MenuItemProps["onSelect"];
  onSelect?: MenuItemProps["onSelect"];
  separator?: boolean;
  textValue?: string;
  value: string;
}

export interface MenuProps extends ComponentProps<typeof TamaguiMenu> {
  arrow?: boolean;
  arrowProps?: MenuArrowProps;
  contentProps?: MenuContentProps;
  itemProps?: Omit<MenuItemProps, "children" | "onPress" | "onSelect">;
  items?: MenuItemData[];
  nativeHaptics?: NativeHapticsSetting;
  /** 是否以通用 native trigger 外观渲染菜单入口。 */
  nativeTrigger?: boolean;
  /** 自定义 native trigger 的完整内容。 */
  nativeTriggerContent?: NativeTriggerFaceProps["content"];
  /** native trigger 默认内容容器的样式。 */
  nativeTriggerContainerStyle?: NativeTriggerFaceProps["containerStyle"];
  /** native trigger 的图标样式。 */
  nativeTriggerIcon?: NativeTriggerIcon;
  /** native trigger 的 label；未提供时使用 `trigger`。 */
  nativeTriggerLabel?: NativeTriggerFaceProps["label"];
  /** native trigger 默认 label 的文本属性。 */
  nativeTriggerLabelProps?: NativeTriggerFaceProps["labelProps"];
  portalProps?: MenuPortalProps;
  /** 菜单入口；启用 `nativeTrigger` 时作为其默认 label。 */
  trigger?: ReactNode;
  triggerProps?: MenuTriggerProps;
}
export type MenuTriggerProps = ComponentProps<typeof TamaguiMenu.Trigger>;
export type MenuPortalProps = ComponentProps<typeof TamaguiMenu.Portal>;
export type MenuContentProps = ComponentProps<typeof TamaguiMenu.Content>;
export type MenuScrollViewProps = ComponentProps<typeof TamaguiMenu.ScrollView>;
export type MenuGroupProps = ComponentProps<typeof TamaguiMenu.Group>;
export type MenuLabelProps = ComponentProps<typeof TamaguiMenu.Label>;
export type MenuItemProps = ComponentProps<typeof TamaguiMenu.Item>;
export type MenuItemTitleProps = ComponentProps<typeof TamaguiMenu.ItemTitle>;
export type MenuItemIconProps = ComponentProps<typeof TamaguiMenu.ItemIcon>;
export type MenuCheckboxItemProps = ComponentProps<typeof TamaguiMenu.CheckboxItem>;
export type MenuRadioGroupProps = ComponentProps<typeof TamaguiMenu.RadioGroup>;
export type MenuRadioItemProps = ComponentProps<typeof TamaguiMenu.RadioItem>;
export type MenuItemIndicatorProps = ComponentProps<typeof TamaguiMenu.ItemIndicator>;
export type MenuSeparatorProps = ComponentProps<typeof TamaguiMenu.Separator>;
export type MenuArrowProps = ComponentProps<typeof TamaguiMenu.Arrow>;
export type MenuSubProps = ComponentProps<typeof TamaguiMenu.Sub>;
export type MenuSubTriggerProps = ComponentProps<typeof TamaguiMenu.SubTrigger>;
export type MenuSubContentProps = ComponentProps<typeof TamaguiMenu.SubContent>;
