import { RnUiKitComponentExamplesDebugPage } from "./pages/component_examples/component_examples_page";
import { RnUiKitAboutDebugPage } from "./pages/sections/about_debug_page";
import { RnUiKitUiComponentsDebugPage } from "./pages/sections/ui_components_debug_page";
import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "./types";

export const rnUiKitDebugRouteDefinitions = [
  {
    Page: RnUiKitComponentExamplesDebugPage,
    description: "按组件浏览独立、可交互的使用示例。",
    key: "component-examples",
    label: "组件示例",
    order: 10,
    presentation: "scroll",
  },
  {
    Page: RnUiKitUiComponentsDebugPage,
    description: "完整展示组件与交互行为。",
    key: "components",
    label: "组件总览",
    order: 20,
    presentation: "static",
  },
  {
    Page: RnUiKitAboutDebugPage,
    description: "查看 rn-ui-kit 版本及当前运行环境。",
    key: "app-about",
    label: "关于",
    order: 100,
    presentation: "scroll",
  },
] satisfies RnUiKitDebugRouteDefinition[];

export function isRnUiKitDebugRouteKey(value: string | undefined): value is RnUiKitDebugRouteKey {
  return (
    value != null && rnUiKitDebugRouteDefinitions.some((definition) => definition.key === value)
  );
}

export function getRnUiKitDebugRouteDefinition(
  key: RnUiKitDebugRouteKey,
  definitions: RnUiKitDebugRouteDefinition[] = rnUiKitDebugRouteDefinitions,
) {
  const route = definitions.find((definition) => definition.key === key);
  if (route == null) throw new Error(`Unknown rn-ui-kit debug route: ${key}`);
  return route;
}
