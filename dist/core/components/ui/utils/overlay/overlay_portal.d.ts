import { type ReactNode } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
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
/**
 * @rn-primitives positions content using page coordinates. A PortalHost nested
 * inside a TrueSheet has a local origin, so translate positioned content back
 * to the same coordinate space as the trigger measurement.
 */
export declare function useOverlayPortalContentStyle(style?: StyleProp<ViewStyle>): StyleProp<ViewStyle>;
