import type { ComponentProps, ComponentType, ReactNode } from "react";
import type { YStack } from "tamagui";

export type RnUiKitDebugRouteKey = "components" | "controls" | "layout";
export type RnUiKitDebugSectionPresentation = "scroll" | "static";

export type RnUiKitDebugSectionContentProps = {
  header?: ReactNode;
  instanceId?: string;
};

export type RnUiKitDebugRouteDefinition = {
  description?: string;
  key: RnUiKitDebugRouteKey;
  label: string;
  Page: ComponentType<RnUiKitDebugSectionContentProps>;
  presentation: RnUiKitDebugSectionPresentation;
};

export type RnUiKitDebugPanelProps = ComponentProps<typeof YStack> & {
  defaultOpen?: boolean;
  initialRouteKey?: RnUiKitDebugRouteKey;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  sheetMode?: boolean;
};

export type RnUiKitUiComponentsDebugPageProps = RnUiKitDebugSectionContentProps;
