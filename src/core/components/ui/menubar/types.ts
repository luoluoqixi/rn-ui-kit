import type { ComponentProps, ReactNode } from "react";
import type * as MenubarPrimitive from "@rn-primitives/menubar";

import type { NativeHapticsSetting, RenderProp } from "../utils";

export type MenubarItemRenderContext = {
  checked?: boolean;
  disabled?: boolean;
  open?: boolean;
  value?: string;
};

export type MenubarTriggerProps = ComponentProps<typeof MenubarPrimitive.Trigger> & {
  /** Keep the default cursor on web. Set false to manage the cursor yourself. */
  cursorDefault?: boolean;
  nativeHaptics?: NativeHapticsSetting;
};

export type MenubarItemData = {
  type?: "item" | "separator" | "submenu" | "checkbox" | "radio-group" | "radio" | "label";
  title?: RenderProp<MenubarItemRenderContext>;
  children?: RenderProp<MenubarItemRenderContext>;
  shortcut?: RenderProp<MenubarItemRenderContext>;
  disabled?: boolean;
  inset?: boolean;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  items?: MenubarItemData[];
  nativeHaptics?: NativeHapticsSetting;
  itemProps?: Omit<ComponentProps<typeof MenubarPrimitive.Item>, "children">;
  checkboxProps?: Omit<
    ComponentProps<typeof MenubarPrimitive.CheckboxItem>,
    "children" | "checked" | "onCheckedChange"
  >;
  radioGroupProps?: Omit<ComponentProps<typeof MenubarPrimitive.RadioGroup>, "children">;
  radioItemProps?: Omit<ComponentProps<typeof MenubarPrimitive.RadioItem>, "children" | "value">;
  submenuProps?: Omit<ComponentProps<typeof MenubarPrimitive.Sub>, "children">;
  contentProps?: Omit<ComponentProps<typeof MenubarPrimitive.Content>, "children">;
  labelProps?: Omit<ComponentProps<typeof MenubarPrimitive.Label>, "children">;
  separatorProps?: ComponentProps<typeof MenubarPrimitive.Separator>;
};

export type MenubarMenuData = {
  value: string;
  title: RenderProp<MenubarItemRenderContext>;
  items: MenubarItemData[];
  nativeHaptics?: NativeHapticsSetting;
  triggerProps?: Omit<MenubarTriggerProps, "children" | "nativeHaptics">;
  contentProps?: Omit<ComponentProps<typeof MenubarPrimitive.Content>, "children">;
};

export type MenubarProps = Omit<ComponentProps<typeof MenubarPrimitive.Root>, "children"> & {
  children?: ReactNode;
  items?: MenubarMenuData[];
  /** Haptics for top-level menu triggers. */
  nativeHaptics?: NativeHapticsSetting;
  /** Default haptics for menu items; an item's nativeHaptics can override it. */
  itemNativeHaptics?: NativeHapticsSetting;
};
