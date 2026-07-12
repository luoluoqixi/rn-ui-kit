import { RnUiKitUiComponentsDebugPage } from "./pages/sections/ui_components_debug_page";
import { RnUiKitExampleControlsPage } from "./pages/sections/example_controls_page";
import { RnUiKitExampleLayoutPage } from "./pages/sections/example_layout_page";

import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "./types";

export const rnUiKitDebugRouteDefinitions = [
  {
    Page: RnUiKitUiComponentsDebugPage,
    description: "完整展示 rn_ui_kit 组件与交互行为。",
    key: "components",
    label: "组件总览",
    presentation: "static",
  },
  {
    Page: RnUiKitExampleControlsPage,
    description: "用于切换状态、数值和视觉模式的小示例页。",
    key: "controls",
    label: "控件示例",
    presentation: "scroll",
  },
  {
    Page: RnUiKitExampleLayoutPage,
    description: "用于展示布局、列表和卡片导航的小示例页。",
    key: "layout",
    label: "布局示例",
    presentation: "scroll",
  },
] satisfies RnUiKitDebugRouteDefinition[];

const routeKeys = new Set<RnUiKitDebugRouteKey>(
  rnUiKitDebugRouteDefinitions.map((definition) => definition.key),
);

export function isRnUiKitDebugRouteKey(value: string | undefined): value is RnUiKitDebugRouteKey {
  return value != null && routeKeys.has(value as RnUiKitDebugRouteKey);
}

export function getRnUiKitDebugRouteDefinition(
  key: RnUiKitDebugRouteKey,
): RnUiKitDebugRouteDefinition {
  const routeDefinition = rnUiKitDebugRouteDefinitions.find((definition) => definition.key === key);

  if (!routeDefinition) {
    throw new Error(`Unknown rn_ui_kit debug route: ${key}`);
  }

  return routeDefinition;
}
