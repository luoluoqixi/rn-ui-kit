import { RnUiKitUiComponentsDebugPage } from "./pages/sections/ui_components_debug_page";

import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "./types";

export const rnUiKitDebugRouteDefinitions = [
  {
    Page: RnUiKitUiComponentsDebugPage,
    description: "完整展示 rn_ui_kit 组件与交互行为。",
    key: "components",
    label: "组件总览",
    presentation: "static",
  },
] satisfies RnUiKitDebugRouteDefinition[];

const routeKeys = new Set<RnUiKitDebugRouteKey>(
  rnUiKitDebugRouteDefinitions.map((definition) => definition.key),
);

export function isRnUiKitDebugRouteKey(value: string | undefined): value is RnUiKitDebugRouteKey {
  return value != null && routeKeys.has(value);
}

export function getRnUiKitDebugRouteDefinition(
  key: RnUiKitDebugRouteKey,
  definitions: RnUiKitDebugRouteDefinition[] = rnUiKitDebugRouteDefinitions,
): RnUiKitDebugRouteDefinition {
  const routeDefinition = definitions.find((definition) => definition.key === key);
  if (!routeDefinition) throw new Error(`Unknown rn_ui_kit debug route: ${key}`);
  return routeDefinition;
}
