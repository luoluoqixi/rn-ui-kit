import type { ReactNode } from "react";
export type OverlayPortalProps = {
    children: ReactNode;
    name: string;
    hostName?: string;
};
export type OverlayPortalHostProps = {
    name?: string;
};
export declare function OverlayPortal({ children }: OverlayPortalProps): import("react").JSX.Element;
export declare function OverlayPortalHost(_props: OverlayPortalHostProps): null;
