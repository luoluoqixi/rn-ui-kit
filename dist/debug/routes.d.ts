import { RnUiKitUiComponentsDebugPage } from "./pages/sections/ui_components_debug_page";
import { RnUiKitComponentExamplesDebugPage } from "./pages/component_examples/component_examples_page";
import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "./types";
export declare const rnUiKitDebugRouteDefinitions: ({
    Page: typeof RnUiKitComponentExamplesDebugPage;
    description: string;
    key: string;
    label: string;
    order: number;
    presentation: "scroll";
} | {
    Page: typeof RnUiKitUiComponentsDebugPage;
    description: string;
    key: string;
    label: string;
    order: number;
    presentation: "static";
})[];
export declare function isRnUiKitDebugRouteKey(value: string | undefined): value is RnUiKitDebugRouteKey;
export declare function getRnUiKitDebugRouteDefinition(key: RnUiKitDebugRouteKey, definitions?: RnUiKitDebugRouteDefinition[]): RnUiKitDebugRouteDefinition;
