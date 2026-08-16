import { type ReactNode } from "react";
import { View } from "react-native";
type ScreenOverlayModalLockApi = {
    acquire: () => void;
    release: () => void;
};
export type ScreenOverlayPortalLayout = "wrap" | "scroll-sibling";
/**
 * 在独立原生层（iOS pageSheet VC、Android True Sheet 等）内挂载 overlay Portal。
 * Tamagui modal 默认 teleport 到 app root 会落在 sheet 下面；此处用 react-native-teleport 抬到当前层之上。
 *
 * - `wrap`：子内容与 teleport 层包在同一 flex 容器（默认）。
 * - `scroll-sibling`：子内容（通常为 ScrollView）与 teleport 层并列，避免 TrueSheet 无法钉住滚动视图（iOS 嵌套 Sheet）。
 */
export declare function ScreenOverlayPortalProvider({ children, hostName, overlayLayout, }: {
    children: ReactNode;
    hostName: string;
    overlayLayout?: ScreenOverlayPortalLayout;
}): import("react").JSX.Element;
export declare function ScreenOverlayPortalHost({ hostName, onTeleportHostNode, }: {
    hostName: string;
    onTeleportHostNode: (node: View | null) => void;
}): import("react").JSX.Element;
export declare function useScreenOverlayPortalHost(): string | null;
/** 在 ScreenOverlayPortalProvider 子树内时返回 host，供 Toast / modal Sheet 等使用（不限 iOS）。 */
export declare function useScopedOverlayPortalHostName(): string | undefined;
/** overlay 子树内 Tamagui modal Sheet 打开时为 true，用于冻结底层 ScrollView（如 iOS pageSheet）。 */
export declare function useScreenOverlayModalLockActive(): boolean;
export declare function useScreenOverlayModalLockApi(): ScreenOverlayModalLockApi | null;
export {};
