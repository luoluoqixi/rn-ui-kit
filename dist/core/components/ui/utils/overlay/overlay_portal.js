import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Modal, Platform } from "react-native";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import { useScopedOverlayPortalHostName, useScreenOverlayPortalOffset, } from "./screen_overlay_portal";
/**
 * Renders an overlay in the current TrueSheet window when one is active.
 * The regular FullWindowOverlay is still used for app-level overlays on iOS.
 */
export function OverlayPortalWindow({ children, forceFullScreen = false, onRequestClose, portalHost, }) {
    const scopedHostName = useScopedOverlayPortalHostName();
    const isScopedHost = scopedHostName != null && (portalHost == null || portalHost === scopedHostName);
    if (forceFullScreen && Platform.OS === "android") {
        return (_jsx(Modal, { navigationBarTranslucent: true, onRequestClose: onRequestClose, statusBarTranslucent: true, transparent: true, visible: true, children: children }));
    }
    const WindowOverlay = Platform.OS === "ios" && (forceFullScreen || !isScopedHost) ? RNFullWindowOverlay : null;
    if (WindowOverlay == null) {
        return _jsx(_Fragment, { children: children });
    }
    return _jsx(WindowOverlay, { children: children });
}
/**
 * @rn-primitives positions content using page coordinates. A PortalHost nested
 * inside a TrueSheet has a local origin, so translate positioned content back
 * to the same coordinate space as the trigger measurement.
 */
export function useOverlayPortalContentStyle(style) {
    const offset = useScreenOverlayPortalOffset();
    if (offset == null || (offset.x === 0 && offset.y === 0)) {
        return style;
    }
    return [
        style,
        {
            transform: [{ translateX: -offset.x }, { translateY: -offset.y }],
        },
    ];
}
