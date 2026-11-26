import { type ReactNode } from "react";
/**
 * Renders an overlay in the current TrueSheet window when one is active.
 * The regular FullWindowOverlay is still used for app-level overlays on iOS.
 */
export declare function OverlayPortalWindow({ children, forceFullScreen, onRequestClose, portalHost, }: {
    children: ReactNode;
    forceFullScreen?: boolean;
    onRequestClose?: () => void;
    portalHost?: string;
}): import("react").JSX.Element;
