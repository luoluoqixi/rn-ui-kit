import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { ComponentProps, ComponentType, ReactNode } from "react";
import type { YStack } from "tamagui";

import type {
  NativeSheetStackScreenOptions,
  NativeSheetStackSheetProps,
} from "../core/components/ui/sheet/native_sheet/types";

export type RnUiKitDebugRouteKey = string;
export type RnUiKitDebugSectionPresentation = "scroll" | "static";
export type RnUiKitDebugPanelPageScreenOptions = NativeStackNavigationOptions;
export type RnUiKitDebugPanelNativeSheetScreenOptions = NativeSheetStackScreenOptions;
export type RnUiKitDebugPanelSheetProps = NativeSheetStackSheetProps;

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
  /**
   * 宿主原生栈返回按钮的自定义文案，仅在 navigationMode="host" 的首页生效。
   * iOS 26 默认只显示箭头；显式传入非空文案后，调试首页会显示该文案。
   */
  backButtonLabel?: string;
  defaultOpen?: boolean;
  initialRouteKey?: RnUiKitDebugRouteKey;
  /**
   * independent：使用调试面板自己的 NavigationContainer。
   * host：复用调用侧当前 Native Stack，并由面板自动管理宿主 route 参数和 header。
   */
  navigationMode?: "host" | "independent";
  /** 普通调试页面的 Native Stack screenOptions 覆盖。未传时保留内置 Header。 */
  pageScreenOptions?: RnUiKitDebugPanelPageScreenOptions;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  pages?: RnUiKitDebugRouteDefinition[];
  /** “以 NativeSheet 打开调试首页”使用的 Sheet 属性覆盖。未传时保持 88% 高度等默认值。 */
  panelSheetProps?: RnUiKitDebugPanelSheetProps;
  /** “以 NativeSheet 打开调试首页”内部导航的 screenOptions 覆盖。 */
  nativeSheetScreenOptions?: RnUiKitDebugPanelNativeSheetScreenOptions;
  sheetMode?: boolean;
};

export type RnUiKitUiComponentsDebugPageProps = RnUiKitDebugSectionContentProps;
