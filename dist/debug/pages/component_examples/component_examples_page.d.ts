import type { RnUiKitDebugSectionContentProps } from "../../types";
import type { ComponentExampleDefinition } from "./types";
export declare function getComponentExampleRouteName(key: string): string;
export declare function getRnUiKitComponentExampleTitle(key: string): string;
export declare function RnUiKitComponentExamplesDebugPage({ header, onOpenComponentExample, }: RnUiKitDebugSectionContentProps): import("react").JSX.Element;
export declare function RnUiKitComponentExampleDebugPage({ exampleKey, headerTransparent, layoutHost, }: {
    exampleKey: string;
    headerTransparent?: boolean;
    layoutHost?: "default" | "nativeSheet";
}): import("react").JSX.Element;
export declare function RnUiKitComponentExampleDetailPage({ definition, headerTransparent, layoutHost, }: {
    definition: ComponentExampleDefinition;
    headerTransparent?: boolean;
    layoutHost?: "default" | "nativeSheet";
}): import("react").JSX.Element;
