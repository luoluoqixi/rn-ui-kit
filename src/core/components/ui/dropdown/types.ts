import type { ComponentProps, ReactNode, RefObject } from "react";
import type { ButtonProps } from "../button";
import type { ColorValue } from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";
import type {
  NativeTriggerFaceProps,
  NativeTriggerFeedbackOpacity,
  NativeTriggerIcon,
  NativeTriggerProps,
} from "../native_trigger";
import type { NativeHapticsDelay, NativeHapticsSetting, RenderProp } from "../utils";
import type * as Zeego from "zeego/dropdown-menu";
import type { Menu } from "heroui-native/menu";
import type { Dropdown } from "@heroui/react/dropdown";
import type { MenuContentProps } from "../menu/types";
import type { MenuAdapterProps } from "../menu/menu_adapter_types";

export type DropdownSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type DropdownSelectionIndicatorPosition = "left" | "right";

export type NativeDropdownControlHandle = {
  presentMenu: () => void;
};

export type NativeDropdownRenderContext = {
  native: boolean;
  open: boolean;
};

export type NativeDropdownItemIconProps = {
  androidIconColor?: ColorValue;
  androidIconName?: string;
  ios?: {
    hierarchicalColor?: string;
    name: SFSymbol;
    paletteColors?: string[];
    scale?: "small" | "medium" | "large";
    weight?:
      | "ultraLight"
      | "thin"
      | "light"
      | "regular"
      | "medium"
      | "semibold"
      | "bold"
      | "heavy"
      | "black";
  };
  iosIconName?: string;
};

export interface NativeDropdownItemData {
  /** Render this item through the native checkbox/menu-state path (used by Select). */
  "checkbox"?: boolean;
  "aria-label"?: string;
  "destructive"?: boolean;
  "disabled"?: boolean;
  "icon"?: RenderProp<NativeDropdownItemData>;
  /** Custom menus: set false to omit this item's empty icon slot. Defaults to false; supplied icons remain visible. */
  reserveIconSpace?: boolean;
  "iconProps"?: NativeDropdownItemIconProps;
  /** 外部菜单适配器的附加数据。 */
  hostData?: Readonly<Record<string, unknown>>;
  "indicator"?: RenderProp<NativeDropdownItemData>;
  "itemProps"?: Record<string, unknown>;
  "label"?: RenderProp<NativeDropdownItemData>;
  "nativeHaptics"?: NativeHapticsSetting;
  "nativeHapticsDelay"?: NativeHapticsDelay;
  "onPress"?: () => void;
  "onSelect"?: () => void;
  "selected"?: boolean;
  /** 自定义菜单的勾选标记位置，覆盖 Dropdown 配置；系统原生菜单忽略此项。 */
  selectionIndicatorPosition?: DropdownSelectionIndicatorPosition;
  "separator"?: boolean;
  /** 自绘菜单分隔线的粗细；系统原生菜单继续采用系统分组。 */
  separatorVariant?: "thin" | "thick";
  /** 自绘菜单右侧的快捷键提示文字；不会注册键盘快捷键。 */
  shortcut?: string;
  /** 选择项默认使用勾号，单选菜单可改用圆点。 */
  selectionIndicatorVariant?: "checkmark" | "dot";
  /** 自绘菜单选择此项后是否关闭；默认 checkbox 项保持打开。 */
  shouldCloseOnSelect?: boolean;
  "subMenu"?: NativeDropdownItemData[];
  "triggerProps"?: Record<string, unknown>;
  "subMenuProps"?: Record<string, unknown>;
  "contentProps"?: Record<string, unknown>;
  "subMenuTitle"?: RenderProp<NativeDropdownItemData> | false;
  "subtitle"?: string;
  "textValue"?: string;
  herouiNativeProps?: Omit<ComponentProps<typeof Menu.Item>, "children" | "id" | "onPress">;
  herouiWebProps?: Omit<ComponentProps<typeof Dropdown.Item>, "children" | "id" | "onAction">;
  "value": string;
}

export type NativeDropdownItemProps = Partial<NativeDropdownItemData> & Record<string, unknown>;

export type NativeDropdownRootExtensions = {
  /** Internal Select anchor mode; not part of the public Dropdown API. */
  __nativeDetachedAnchor?: boolean;
  __menuRef?: RefObject<NativeDropdownControlHandle | null>;
  defaultOpen?: boolean;
  disabled?: boolean;
  items?: NativeDropdownItemData[];
  itemProps?: NativeDropdownItemProps;
  itemNativeHaptics?: NativeHapticsSetting;
  itemNativeHapticsDelay?: NativeHapticsDelay;
  nativeAnchorAlignment?: "start" | "center" | "end";
  nativeHaptics?: NativeHapticsSetting;
  nativeHapticsDelay?: NativeHapticsDelay;
  /** iOS 原生菜单是否等待菜单退出动画完成后再触发 item 回调，默认 `false`。 */
  nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem?: boolean;
  nativeSelectedItemBackgroundColor?: ColorValue;
  nativeTrigger?: boolean;
  nativeTriggerContainerStyle?: NativeTriggerFaceProps["containerStyle"];
  nativeTriggerContent?: NativeTriggerFaceProps["content"];
  nativeTriggerIcon?: NativeTriggerIcon;
  nativeTriggerLabelProps?: NativeTriggerFaceProps["labelProps"];
  /** Additional props for the generated NativeTrigger. */
  nativeTriggerProps?: Omit<NativeTriggerProps, "active" | "children" | "content" | "label">;
  /** Feedback opacity overrides for the generated NativeTrigger. */
  nativeTriggerFeedbackOpacity?: NativeTriggerFeedbackOpacity;
  /** Enable the Web-only hover background on the generated native trigger. Defaults to true. */
  nativeTriggerHoverBackground?: boolean;
  /** Props applied to the generated Zeego content on native platforms. */
  nativeContentProps?: NativeDropdownContentProps;
  open?: boolean;
  onOpenWillChange?: (open: boolean) => void;
  triggerClassName?: string;
  triggerLabel?: RenderProp<NativeDropdownRenderContext>;
  triggerProps?: Omit<ButtonProps, "children"> & Record<string, unknown>;
  trigger?: RenderProp<NativeDropdownRenderContext>;
};

/** Props applied to the generated non-native menu content. */
export type DropdownContentProps = MenuContentProps;

/** Props applied to the generated Zeego menu content on native platforms. */
export type NativeDropdownContentProps = Omit<ComponentProps<typeof Zeego.Content>, "children"> &
  Record<string, unknown>;

export type DropdownItemData = NativeDropdownItemData;
export type DropdownItemProps = NativeDropdownItemProps;
export type DropdownRootExtensions = NativeDropdownRootExtensions & MenuAdapterProps & {
  native?: boolean;
  accessibilityLabel?: string;
  herouiNativeProps?: Omit<ComponentProps<typeof Menu>, "children" | "isOpen" | "isDefaultOpen" | "onOpenChange">;
  herouiWebProps?: Omit<ComponentProps<typeof Dropdown>, "children" | "isOpen" | "defaultOpen" | "onOpenChange">;
  herouiNativeItemProps?: NativeDropdownItemData["herouiNativeProps"];
  herouiWebItemProps?: NativeDropdownItemData["herouiWebProps"];
  /** 自定义菜单的勾选标记位置，默认 left；系统原生菜单保持系统布局。 */
  selectionIndicatorPosition?: DropdownSelectionIndicatorPosition;
  /** Props applied to the generated non-native menu content. */
  contentProps?: DropdownContentProps;

};
export type DropdownProps = ComponentProps<typeof Zeego.Root> & DropdownRootExtensions;
export type NativeDropdownProps = ComponentProps<typeof Zeego.Root> & NativeDropdownRootExtensions;
