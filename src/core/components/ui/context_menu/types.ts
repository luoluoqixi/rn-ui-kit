import type { ComponentProps, ReactNode, RefObject } from "react";
import type * as ContextMenuPrimitive from "@rn-primitives/context-menu";
import type { StyleProp, TextProps, ViewStyle } from "react-native";

import type { NativeHapticsSetting } from "../utils";
import type { RenderProp } from "../utils/render";

export type ContextMenuRenderContext = {
  native: boolean;
  open: boolean;
};

export type ContextMenuItemData = {
  "aria-label"?: string;
  "checked"?: boolean;
  "destructive"?: boolean;
  "disabled"?: boolean;
  "icon"?: RenderProp<ContextMenuItemData>;
  "iconProps"?: Record<string, unknown>;
  "indicator"?: RenderProp<ContextMenuItemData>;
  "itemProps"?: Record<string, unknown>;
  "label"?: RenderProp<ContextMenuItemData>;
  "nativeHaptics"?: NativeHapticsSetting;
  "onPress"?: () => void;
  "onCheckedChange"?: (checked: boolean) => void;
  "onSelect"?: () => void;
  "selected"?: boolean;
  "separator"?: boolean;
  "subMenu"?: ContextMenuItemData[];
  "subMenuTitle"?: RenderProp<ContextMenuItemData> | false;
  "triggerProps"?: Record<string, unknown>;
  "subMenuProps"?: Record<string, unknown>;
  "contentProps"?: Record<string, unknown>;
  "subtitle"?: string;
  "textValue"?: string;
  "value": string;
};

export type ContextMenuItemProps = Partial<ContextMenuItemData> & Record<string, unknown>;

export type ContextMenuSubTriggerProps = ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  iconClassName?: string;
  inset?: boolean;
  nativeHaptics?: NativeHapticsSetting;
};

export type ContextMenuSubContentProps = ComponentProps<typeof ContextMenuPrimitive.SubContent>;

export type ContextMenuContentProps = ComponentProps<typeof ContextMenuPrimitive.Content> & {
  overlayStyle?: StyleProp<ViewStyle>;
  overlayClassName?: string;
  portalHost?: string;
  itemNativeHaptics?: NativeHapticsSetting;
};

export type ContextMenuItemComponentProps = ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  nativeHaptics?: NativeHapticsSetting;
  variant?: "default" | "destructive";
};

export type ContextMenuCheckboxItemProps = ComponentProps<
  typeof ContextMenuPrimitive.CheckboxItem
> & {
  nativeHaptics?: NativeHapticsSetting;
};

export type ContextMenuRadioItemProps = ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
  nativeHaptics?: NativeHapticsSetting;
};

export type ContextMenuLabelProps = ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
};
export type ContextMenuSeparatorProps = ComponentProps<typeof ContextMenuPrimitive.Separator>;
export type ContextMenuShortcutProps = TextProps;
export type ContextMenuItemTitleProps = ContextMenuShortcutProps;
export type ContextMenuItemSubtitleProps = ContextMenuShortcutProps;
export type ContextMenuItemIconProps = { children?: ReactNode };
export type ContextMenuItemImageProps = { children?: ReactNode };
export type ContextMenuArrowProps = { children?: ReactNode };
export type ContextMenuPreviewProps = { children?: ReactNode };
export type ContextMenuAuxiliaryProps = { children?: ReactNode };
export type ContextMenuNativeIosProps = {
  shouldWaitForMenuToHideBeforeFiringOnPressMenuItem?: boolean;
  [key: string]: unknown;
};

export type ContextMenuProps = ComponentProps<typeof ContextMenuPrimitive.Root> &
  ContextMenuRootExtensions;

export type ContextMenuRootExtensions = {
  /** Internal handle used by NativeList's Android programmatic anchor. */
  __menuRef?: RefObject<{ presentMenu: () => void } | null>;
  __unsafeIosProps?: ContextMenuNativeIosProps;
  items?: ContextMenuItemData[];
  itemProps?: ContextMenuItemProps;
  itemNativeHaptics?: NativeHapticsSetting;
  native?: boolean;
  nativeHaptics?: NativeHapticsSetting;
  /** iOS native only. Defaults to false so item callbacks run before menu-dismiss animation. */
  nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem?: boolean;
  onOpenWillChange?: (open: boolean) => void;
  trigger?: RenderProp<ContextMenuRenderContext>;
  triggerProps?: Omit<ComponentProps<typeof ContextMenuPrimitive.Trigger>, "children"> &
    Record<string, unknown>;
};
