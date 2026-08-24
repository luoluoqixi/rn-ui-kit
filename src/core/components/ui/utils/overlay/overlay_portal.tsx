import { type ReactNode } from "react";
import { Modal, Platform, type StyleProp, type ViewStyle } from "react-native";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import {
  useScopedOverlayPortalHostName,
  useScreenOverlayPortalOffset,
} from "./screen_overlay_portal";

/**
 * Renders an overlay in the current TrueSheet window when one is active.
 * The regular FullWindowOverlay is still used for app-level overlays on iOS.
 */
export function OverlayPortalWindow({
  children,
  forceFullScreen = false,
  onRequestClose,
  portalHost,
}: {
  children: ReactNode;
  forceFullScreen?: boolean;
  onRequestClose?: () => void;
  portalHost?: string;
}) {
  const scopedHostName = useScopedOverlayPortalHostName();
  const isScopedHost =
    scopedHostName != null && (portalHost == null || portalHost === scopedHostName);

  if (forceFullScreen && Platform.OS === "android") {
    return (
      <Modal
        navigationBarTranslucent
        onRequestClose={onRequestClose}
        statusBarTranslucent
        transparent
        visible
      >
        {children}
      </Modal>
    );
  }

  const WindowOverlay =
    Platform.OS === "ios" && (forceFullScreen || !isScopedHost) ? RNFullWindowOverlay : null;

  if (WindowOverlay == null) {
    return <>{children}</>;
  }

  return <WindowOverlay>{children}</WindowOverlay>;
}

/**
 * @rn-primitives positions content using page coordinates. A PortalHost nested
 * inside a TrueSheet has a local origin, so translate positioned content back
 * to the same coordinate space as the trigger measurement.
 */
export function useOverlayPortalContentStyle(style?: StyleProp<ViewStyle>): StyleProp<ViewStyle> {
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
