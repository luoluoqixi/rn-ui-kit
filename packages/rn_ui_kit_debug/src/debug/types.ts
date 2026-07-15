import type { ComponentProps, ComponentType, ReactNode } from "react";
import type { YStack } from "tamagui";

export type RnUiKitDebugRouteKey = string;
export type RnUiKitDebugSectionPresentation = "scroll" | "static";

export type RnUiKitDebugSectionContentProps = {
  header?: ReactNode;
  headerTransparent?: boolean;
  instanceId?: string;
  layoutHost?: "default" | "nativeSheet";
};

export type RnUiKitDebugRouteDefinition = {
  description?: string;
  key: RnUiKitDebugRouteKey;
  label: string;
  contentTitle?: string;
  order?: number;
  Page: ComponentType<RnUiKitDebugSectionContentProps>;
  presentation: RnUiKitDebugSectionPresentation;
  section?: string;
};

export type RnUiKitDebugPanelProps = ComponentProps<typeof YStack> & {
  defaultOpen?: boolean;
  initialRouteKey?: RnUiKitDebugRouteKey;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  pages?: RnUiKitDebugRouteDefinition[];
  sheetMode?: boolean;
};

export type RnUiKitUiComponentsDebugPageProps = RnUiKitDebugSectionContentProps;
