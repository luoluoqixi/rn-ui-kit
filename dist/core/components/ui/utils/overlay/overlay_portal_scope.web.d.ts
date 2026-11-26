import { type ReactNode } from "react";
export declare const OverlayPortalContainerContext: import("react").Context<HTMLElement | undefined>;
export declare function OverlayPortalScope({ children }: {
    children?: ReactNode;
}): import("react").JSX.Element;
export declare function useOverlayPortalContainer(): HTMLElement | undefined;
