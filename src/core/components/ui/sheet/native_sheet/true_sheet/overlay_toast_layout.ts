import { os } from "../../../utils/platform";
import { getTrueSheetPartialDetentCompensationScale } from "./overlay_layout_metrics";
import { isTrueSheetOverlayPortalHostName } from "./overlay_host_name";

const platform = os();

/**
 * Scoped overlay host 的布局补偿（Toast viewport 间距 + True Sheet 浮层底边）。
 * Toast：toastLayer 1× + Viewport `bottom`；居中 Dialog：`getTrueSheetCenteredModalLiftAmount` → content `y` 偏移（勿缩短 teleport 遮罩）。
 */

/** Sheet / overlay 内 Toast 默认底边距（Android 等） */
export const SCOPED_TOAST_VIEWPORT_INSET = 24;

/** v4 bounds overlays to the visible detent; no empirical lift remains. */
export const TRUE_SHEET_TOAST_DETENT_LIFT = 0;

/** iOS Native Stack pageSheet 等 overlay：略抬高，避免贴 Home 条 */
export const IOS_PAGE_SHEET_TOAST_VIEWPORT_INSET = 36;

/**
 * iOS True Sheet 专用 Viewport 底边距（配合 toastLayer safe area 补偿）。
 * 仅用于 insetAdjustment 垫高布局的 True Sheet host，勿用于 Native Stack pageSheet。
 */
export const IOS_TRUE_SHEET_TOAST_VIEWPORT_INSET = SCOPED_TOAST_VIEWPORT_INSET;

/** True Sheet overlay host（`insetAdjustment="automatic"` 会垫高布局底，与 pageSheet 不同） */
export function isTrueSheetOverlayPortalHost(hostName: string): boolean {
  return isTrueSheetOverlayPortalHostName(hostName);
}

/**
 * True Sheet：toastLayer 底边补偿（仅 iOS，与 Viewport bottom 分工，勿叠双份）。
 */
export function getTrueSheetOverlayLayoutBottomInset(
  hostName: string,
  safeAreaBottom: number,
  detent = 1,
): number {
  if (!isTrueSheetOverlayPortalHost(hostName)) {
    return 0;
  }

  const scale = getTrueSheetPartialDetentCompensationScale(detent);
  return Math.round(safeAreaBottom * scale);
}

/** v4 Yoga owns the centered modal viewport. */
export function getTrueSheetCenteredModalLiftAmount(
  _hostName: string, _safeAreaBottom: number, _detent = 1,
): number {
  // Yoga already bounds the teleport layer to the visible detent.
  return 0;
}

/** iOS True Sheet：toastLayer 底边补偿（与 teleport 共用 inset 计算） */
export function shouldApplyIosTrueSheetToastLayerInset(hostName: string): boolean {
  return platform === "ios" && isTrueSheetOverlayPortalHost(hostName);
}

export function getScopedToastViewportBottomInset(
  viewportName: string | undefined,
  detent = 1,
): number {
  if (viewportName == null) {
    return SCOPED_TOAST_VIEWPORT_INSET;
  }

  if (platform === "ios") {
    if (isTrueSheetOverlayPortalHost(viewportName)) {
      return SCOPED_TOAST_VIEWPORT_INSET;
    }

    return IOS_PAGE_SHEET_TOAST_VIEWPORT_INSET;
  }

  return SCOPED_TOAST_VIEWPORT_INSET;
}
