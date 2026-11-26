import type { ComponentProps } from "react";
import type { Tabs as NativeTabs } from "heroui-native/tabs";
import type { Tabs as WebTabs } from "@heroui/react/tabs";
import type { FieldSlotProps } from "../utils/field_types";
import type { NativeHapticsSetting, RenderProp } from "../utils";
export type TabsRenderContext = {
  value: string;
  isSelected: boolean;
  isDisabled: boolean;
};
export type TabsTriggerProps = FieldSlotProps<
  ComponentProps<typeof NativeTabs.Trigger>,
  ComponentProps<typeof WebTabs.Tab>,
  "value" | "id" | "isDisabled"
>;
export type TabsContentProps = FieldSlotProps<
  ComponentProps<typeof NativeTabs.Content>,
  ComponentProps<typeof WebTabs.Panel>,
  "value" | "id" | "forceMount" | "shouldForceMount"
>;
export type TabsListProps = FieldSlotProps<
  ComponentProps<typeof NativeTabs.List>,
  ComponentProps<typeof WebTabs.List>
>;
export type TabsItemData = {
  value: string;
  title: RenderProp<TabsRenderContext>;
  content: RenderProp<TabsRenderContext>;
  isDisabled?: boolean;
  triggerProps?: TabsTriggerProps;
  contentProps?: TabsContentProps;
  titleClassName?: string;
};
export type TabsProps = FieldSlotProps<
  ComponentProps<typeof NativeTabs>,
  ComponentProps<typeof WebTabs>,
  | "value"
  | "onValueChange"
  | "variant"
  | "selectedKey"
  | "defaultSelectedKey"
  | "onSelectionChange"
  | "isDisabled"
  | "orientation"
> & {
  items: TabsItemData[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "primary" | "secondary";
  isDisabled?: boolean;
  accessibilityLabel?: string;
  nativeHaptics?: NativeHapticsSetting;
  listProps?: TabsListProps;
  triggerProps?: TabsTriggerProps;
  contentProps?: TabsContentProps;
  indicatorProps?: FieldSlotProps<
    ComponentProps<typeof NativeTabs.Indicator>,
    ComponentProps<typeof WebTabs.Indicator>
  >;
  /** Keep inactive panels mounted on both platforms. */
  keepMounted?: boolean;
  /** Horizontal overflow; Native uses the official animated ScrollView. */
  isScrollable?: boolean;
};
