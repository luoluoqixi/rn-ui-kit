import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from "react";
import { Modal, Platform } from "react-native";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScopedVariables } from "uniwind";
import { ScreenOverlayPortalProvider, useScopedOverlayPortalHostName, useScreenOverlayPortalOffset, } from "./screen_overlay_portal";
import { semanticColorsToVariables, useUiTheme } from "../theme";
/**
 * Renders an overlay in the current TrueSheet window when one is active.
 * The regular FullWindowOverlay is still used for app-level overlays on iOS.
 */
export function OverlayPortalWindow({ children, forceFullScreen = false, onRequestClose, portalHost, }) {
    const theme = useUiTheme();
    const modalHostName = `ui-modal-${useId()}`;
    // Web Radix portals mount under document.body, outside the provider's
    // scoped CSS variables. Re-apply the current semantic tokens at the portal
    // boundary so popup text and surfaces keep the active light/dark theme.
    const themedChildren = (_jsx(ScopedVariables, { variables: semanticColorsToVariables(theme), children: children }));
    const scopedHostName = useScopedOverlayPortalHostName();
    const isScopedHost = scopedHostName != null && (portalHost == null || portalHost === scopedHostName);
    // Dialog 使用原生 Modal 参与控制器呈现顺序；FullWindowOverlay 会始终盖住其子 TrueSheet。
    if (forceFullScreen && Platform.OS !== "web") {
        // 子弹层挂到当前 Modal，避免继承外层 Sheet host 或与父 Modal 平级呈现。
        const modalContent = (_jsx(ScreenOverlayPortalProvider, { hostName: modalHostName, children: themedChildren }));
        return (_jsx(Modal, { navigationBarTranslucent: true, onRequestClose: onRequestClose, statusBarTranslucent: true, supportedOrientations: [
                "portrait",
                "portrait-upside-down",
                "landscape-left",
                "landscape-right",
            ], transparent: true, visible: true, children: Platform.OS === "android" ? (_jsx(GestureHandlerRootView, { style: { flex: 1 }, children: modalContent })) : (modalContent) }));
    }
    const WindowOverlay = Platform.OS === "ios" && !isScopedHost ? RNFullWindowOverlay : null;
    if (WindowOverlay == null) {
        return _jsx(_Fragment, { children: themedChildren });
    }
    return _jsx(WindowOverlay, { children: themedChildren });
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
