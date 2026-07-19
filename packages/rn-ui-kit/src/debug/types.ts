import type { ComponentProps, ComponentType, ReactNode } from "react";
import type { YStack } from "tamagui";

export type RnUiKitDebugRouteKey = string;
export type RnUiKitDebugSectionPresentation = "scroll" | "static";

export type RnUiKitDebugSectionContentProps = {
  header?: ReactNode;
  headerTransparent?: boolean;
  instanceId?: string;
  layoutHost?: "default" | "nativeSheet";
  onOpenComponentExample?: (key: string) => void;
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
  /** 宿主原生栈返回按钮的自定义文案，仅在 navigationMode="host" 的首页生效。 */
  backButtonLabel?: string;
  defaultOpen?: boolean;
  initialRouteKey?: RnUiKitDebugRouteKey;
  /**
   * independent：使用调试面板自己的 NavigationContainer。
   * host：复用调用侧当前 Native Stack，并由面板自动管理宿主 route 参数和 header。
   */
  navigationMode?: "host" | "independent";
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  pages?: RnUiKitDebugRouteDefinition[];
  sheetMode?: boolean;
};

export type RnUiKitUiComponentsDebugPageProps = RnUiKitDebugSectionContentProps;
