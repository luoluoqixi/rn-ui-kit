import type { ComponentProps, ReactNode } from "react";
import type { ColorValue, PressableProps } from "react-native";
import type { Menu as TamaguiMenu } from "tamagui";

import type { NativeTriggerFaceProps, NativeTriggerIcon } from "../native_trigger";
import type { NativeHapticsSetting } from "../utils";

export interface MenuItemData {
  "aria-label"?: string;
  "destructive"?: boolean;
  "disabled"?: boolean;
  /** 菜单项右侧的自定义图标。 */
  "icon"?: ReactNode;
  "indicator"?: ReactNode;
  "label"?: ReactNode;
  "onPress"?: MenuItemProps["onSelect"];
  "onSelect"?: MenuItemProps["onSelect"];
  "separator"?: boolean;
  /** 原生 Menu 中标识当前项；Android 会应用选中状态。 */
  "selected"?: boolean;
  /**
   * 子菜单条目。存在非空数组时，当前项会作为子菜单入口。
   * Android 原生 Menu 仅支持一级子菜单。
   */
  "subMenu"?: MenuItemData[];
  /** Web 子菜单标题。默认使用当前项名称；传 `false` 可隐藏标题。 */
  "subMenuTitle"?: ReactNode | false;
  "textValue"?: string;
  "value": string;
}

/** Menu trigger 的实时交互状态。`opacity` 与默认 native trigger 的反馈保持一致。 */
export interface MenuTriggerState {
  /** 菜单是否已经处于打开状态。 */
  isOpen: boolean;
  /** 原生菜单已开始打开、但尚未稳定为打开状态。 */
  isOpening: boolean;
  /** trigger 是否正被按住。 */
  isPressed: boolean;
  /** 默认 trigger 应保持按压反馈的状态。 */
  isActive: boolean;
  /** 默认 trigger 在当前状态下应使用的不透明度。 */
  opacity: number;
}

/**
 * 自定义 Menu trigger 的 render function。
 *
 * 如需在独立组件中读取同一状态，可在该函数返回的组件内调用
 * `useMenuTriggerState`。
 */
export type MenuTriggerRender = (state: MenuTriggerState) => ReactNode;

export interface MenuProps extends ComponentProps<typeof TamaguiMenu> {
  arrow?: boolean;
  arrowProps?: MenuArrowProps;
  contentProps?: MenuContentProps;
  itemProps?: Omit<MenuItemProps, "children" | "onPress" | "onSelect">;
  items?: MenuItemData[];
  nativeHaptics?: NativeHapticsSetting;
  /** Android 原生 Menu 相对 trigger 的水平锚点对齐方式，默认 `center`。 */
  nativeAnchorAlignment?: "start" | "center" | "end";
  /** Android 原生 Menu 中已选项的自定义背景色。未传时保留平台原生选中样式。 */
  nativeSelectedItemBackgroundColor?: ColorValue;
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
  /**
   * 菜单入口；也可传 render function 以读取实时 trigger 状态。
   * 启用 `nativeTrigger` 时，ReactNode 会作为其默认 label；render function 则完全替换默认 trigger。
   */
  trigger?: ReactNode | MenuTriggerRender;
  triggerProps?: MenuTriggerProps;
}
export type MenuTriggerProps = ComponentProps<typeof TamaguiMenu.Trigger> &
  Pick<PressableProps, "onHoverIn" | "onHoverOut">;
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
