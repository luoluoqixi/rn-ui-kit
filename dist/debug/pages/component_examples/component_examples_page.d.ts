import type { RnUiKitDebugSectionContentProps } from "../../types";
import type { ComponentExampleDefinition } from "./types";
export declare function getComponentExampleRouteName(key: string): string;
/** The examples list lives on the debug panel stack; only its detail routes are separate screens. */
export declare function RnUiKitComponentExamplesDebugPage({ header, layoutHost, }: RnUiKitDebugSectionContentProps): import("react").JSX.Element;
export declare function RnUiKitComponentExampleDetailPage({ definition, headerTransparent, layoutHost, }: {
    definition: ComponentExampleDefinition;
    headerTransparent?: boolean;
    layoutHost?: "default" | "nativeSheet";
}): import("react").JSX.Element;
