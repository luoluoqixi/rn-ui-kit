import type { PortalProps } from "@tamagui/portal";
import type { ReactNode } from "react";
export type OverlayScopedPortalProps = PortalProps & {
    active?: boolean;
    children?: ReactNode;
};
/**
 * 在 ScreenOverlayPortalProvider 子树内替代 Tamagui Portal / Dialog.Portal 的 root 硬编码。
 * Toast 走 Toaster viewport；Dialog / Menu 等须显式使用本组件。
 */
export declare function OverlayScopedPortal({ active, children, passThrough, stackZIndex, zIndex, ...rest }: OverlayScopedPortalProps): import("react").JSX.Element;
