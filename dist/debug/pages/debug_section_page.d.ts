import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "../types";
export declare function RnUiKitDebugSectionPage({ bindToNativeSheet, contentTitle, headerTransparent, instanceId, layoutHost, pages, sectionKey, }: {
    bindToNativeSheet?: boolean;
    contentTitle?: string;
    headerTransparent?: boolean;
    instanceId?: string;
    layoutHost?: "default" | "nativeSheet";
    pages: RnUiKitDebugRouteDefinition[];
    sectionKey: RnUiKitDebugRouteKey;
}): import("react").JSX.Element;
