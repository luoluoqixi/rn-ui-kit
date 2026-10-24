import { type ReactNode, useId } from "react";
import { Modal, Platform, type StyleProp, type ViewStyle } from "react-native";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";
import { ScopedVariables } from "uniwind";

import {
  ScreenOverlayPortalProvider,
  useScopedOverlayPortalHostName,
  useScreenOverlayPortalOffset,
} from "./screen_overlay_portal";
import { semanticColorsToVariables, useUiTheme } from "../theme";

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
  const theme = useUiTheme();
  const modalHostName = `ui-modal-${useId()}`;
  // Web Radix portals mount under document.body, outside the provider's
  // scoped CSS variables. Re-apply the current semantic tokens at the portal
  // boundary so popup text and surfaces keep the active light/dark theme.
  const themedChildren = (
    <ScopedVariables variables={semanticColorsToVariables(theme)}>
      {children}
    </ScopedVariables>
  );
  const scopedHostName = useScopedOverlayPortalHostName();
  const isScopedHost =
    scopedHostName != null &&
    (portalHost == null || portalHost === scopedHostName);

  // Dialog 使用原生 Modal 参与控制器呈现顺序；FullWindowOverlay 会始终盖住其子 TrueSheet。
  if (forceFullScreen && Platform.OS !== "web") {
    return (
      <Modal
        // Android Modal windows are software-rendered unless this is enabled. A TrueSheet
        // hosted inside the modal uses BottomSheetBehavior for swipe dismissal; removing
        // its final native animation layer can otherwise expose the dialog window's blank
        // backing buffer for one frame. App-root sheets do not hit this because the
        // Activity window is already hardware accelerated.
        hardwareAccelerated={Platform.OS === "android"}
        navigationBarTranslucent
        onRequestClose={onRequestClose}
        statusBarTranslucent
        supportedOrientations={[
          "portrait",
          "portrait-upside-down",
          "landscape-left",
          "landscape-right",
        ]}
        transparent
        visible
      >
        {/* 子弹层挂到当前 Modal，避免继承外层 Sheet host 或与父 Modal 平级呈现。 */}
        <ScreenOverlayPortalProvider hostName={modalHostName}>
          {themedChildren}
        </ScreenOverlayPortalProvider>
      </Modal>
    );
  }

  const WindowOverlay =
    Platform.OS === "ios" && !isScopedHost ? RNFullWindowOverlay : null;

  if (WindowOverlay == null) {
    return <>{themedChildren}</>;
  }

  return <WindowOverlay>{themedChildren}</WindowOverlay>;
}

/**
 * @rn-primitives positions content using page coordinates. A PortalHost nested
 * inside a TrueSheet has a local origin, so translate positioned content back
 * to the same coordinate space as the trigger measurement.
 */
export function useOverlayPortalContentStyle(
  style?: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
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
