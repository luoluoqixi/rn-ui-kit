import { useSafeAreaInsets } from "react-native-safe-area-context";

import { isWeb } from "../../../utils/platform";
import {
  useTrueSheetOverlayDetent,
  useTrueSheetOverlaySheetTopPosition,
} from "./overlay_layout_context";
import { getTrueSheetCenteredModalDetentOffsetY } from "./overlay_layout_metrics";
import { useScreenOverlayPortalHost } from "../../../utils/screen_overlay_portal";

import {
  getTrueSheetCenteredModalLiftAmount,
  isTrueSheetOverlayPortalHost,
} from "./overlay_toast_layout";

/**
 * True Sheet 内居中 Dialog / AlertDialog：上移内容，不缩短 teleport 层（避免遮罩底部漏光）。
 * 视觉位移约 liftAmount / 2。
 */
export function getTrueSheetCenteredModalContentOffsetY(
  hostName: string,
  safeAreaBottom: number,
  detent = 1,
  sheetTopPosition: number | null = null,
): number {
  const insetLift = -Math.round(
    getTrueSheetCenteredModalLiftAmount(hostName, safeAreaBottom, detent) / 2,
  );
  const detentOffset = getTrueSheetCenteredModalDetentOffsetY(sheetTopPosition, detent);
  return insetLift + detentOffset;
}

export function useTrueSheetCenteredModalContentOffsetY(): number {
  const host = useScreenOverlayPortalHost();
  const insets = useSafeAreaInsets();
  const detent = useTrueSheetOverlayDetent();
  const sheetTopPosition = useTrueSheetOverlaySheetTopPosition();

  if (isWeb() || host == null || !isTrueSheetOverlayPortalHost(host)) {
    return 0;
  }

  return getTrueSheetCenteredModalContentOffsetY(host, insets.bottom, detent, sheetTopPosition);
}
