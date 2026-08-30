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
import type { NativeHapticsSetting, RenderProp } from "../utils";
import type * as Zeego from "zeego/dropdown-menu";
import type * as DropdownPrimitive from "@rn-primitives/dropdown-menu";

export type DropdownSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

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
  "iconProps"?: NativeDropdownItemIconProps;
  "indicator"?: RenderProp<NativeDropdownItemData>;
  "itemProps"?: Record<string, unknown>;
  "label"?: RenderProp<NativeDropdownItemData>;
  "nativeHaptics"?: NativeHapticsSetting;
  "onPress"?: () => void;
  "onSelect"?: () => void;
  "selected"?: boolean;
  "separator"?: boolean;
  "subMenu"?: NativeDropdownItemData[];
  "triggerProps"?: Record<string, unknown>;
  "subMenuProps"?: Record<string, unknown>;
  "contentProps"?: Record<string, unknown>;
  "subMenuTitle"?: RenderProp<NativeDropdownItemData> | false;
  "subtitle"?: string;
  "textValue"?: string;
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
  nativeAnchorAlignment?: "start" | "center" | "end";
  nativeHaptics?: NativeHapticsSetting;
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
export type DropdownContentProps = Omit<
  ComponentProps<typeof DropdownPrimitive.Content>,
  "children"
> & {
  children?: ReactNode | ((state: unknown) => ReactNode);
  size?: DropdownSize;
  overlayClassName?: string;
  overlayStyle?: import("react-native").StyleProp<import("react-native").ViewStyle>;
  portalHost?: string;
};

export type DropdownSubContentProps = Omit<
  ComponentProps<typeof DropdownPrimitive.SubContent>,
  "children"
> & {
  children?: ReactNode;
  size?: DropdownSize;
};

/** Props applied to the generated Zeego menu content on native platforms. */
export type NativeDropdownContentProps = Omit<ComponentProps<typeof Zeego.Content>, "children"> &
  Record<string, unknown>;

export type DropdownItemData = NativeDropdownItemData;
export type DropdownItemProps = NativeDropdownItemProps;
export type DropdownRootExtensions = NativeDropdownRootExtensions & {
  native?: boolean;
  /** Props applied to the generated non-native menu content. */
  contentProps?: DropdownContentProps;
  /** Size of the generated non-native menu content. */
  contentSize?: DropdownSize;
};
export type DropdownProps = ComponentProps<typeof Zeego.Root> & DropdownRootExtensions;
export type NativeDropdownProps = ComponentProps<typeof Zeego.Root> & NativeDropdownRootExtensions;
