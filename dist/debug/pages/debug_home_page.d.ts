import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "../types";
export declare function RnUiKitDebugHomePage({ layoutHost, openSectionsInSheet, pages, onOpenPanelSheet, sectionSheetPosition, onOpenSection, onSectionSheetPositionChange, onOpenSectionsInSheetChange, }: {
    /** @deprecated iOS header 的内容 inset 现由页面的原生导航栏模式自动决定。 */
    headerTransparent?: boolean;
    layoutHost?: "default" | "nativeSheet";
    openSectionsInSheet: boolean;
    pages: RnUiKitDebugRouteDefinition[];
    onOpenPanelSheet?: () => void;
    sectionSheetPosition: number;
    onOpenSection?: (key: RnUiKitDebugRouteKey) => void;
    onSectionSheetPositionChange?: (position: number) => void;
    onOpenSectionsInSheetChange?: (openInSheet: boolean) => void;
}): import("react").JSX.Element;
