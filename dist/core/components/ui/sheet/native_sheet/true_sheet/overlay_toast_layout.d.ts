/**
 * Scoped overlay host 的布局补偿（Toast viewport 间距 + True Sheet 浮层底边）。
 * Toast：toastLayer 1× + Viewport `bottom`；居中 Dialog：`getTrueSheetCenteredModalLiftAmount` → content `y` 偏移（勿缩短 teleport 遮罩）。
 */
/** Sheet / overlay 内 Toast 默认底边距（Android 等） */
export declare const SCOPED_TOAST_VIEWPORT_INSET = 24;
/** v4 bounds overlays to the visible detent; no empirical lift remains. */
export declare const TRUE_SHEET_TOAST_DETENT_LIFT = 0;
/** iOS Native Stack pageSheet 等 overlay：略抬高，避免贴 Home 条 */
export declare const IOS_PAGE_SHEET_TOAST_VIEWPORT_INSET = 36;
/**
 * iOS True Sheet 专用 Viewport 底边距（配合 toastLayer safe area 补偿）。
 * 仅用于 insetAdjustment 垫高布局的 True Sheet host，勿用于 Native Stack pageSheet。
 */
export declare const IOS_TRUE_SHEET_TOAST_VIEWPORT_INSET = 24;
/** True Sheet overlay host（`insetAdjustment="automatic"` 会垫高布局底，与 pageSheet 不同） */
export declare function isTrueSheetOverlayPortalHost(hostName: string): boolean;
/**
 * True Sheet：toastLayer 底边补偿（仅 iOS，与 Viewport bottom 分工，勿叠双份）。
 */
export declare function getTrueSheetOverlayLayoutBottomInset(hostName: string, safeAreaBottom: number, detent?: number): number;
/** v4 Yoga owns the centered modal viewport. */
export declare function getTrueSheetCenteredModalLiftAmount(_hostName: string, _safeAreaBottom: number, _detent?: number): number;
/** iOS True Sheet：toastLayer 底边补偿（与 teleport 共用 inset 计算） */
export declare function shouldApplyIosTrueSheetToastLayerInset(hostName: string): boolean;
export declare function getScopedToastViewportBottomInset(viewportName: string | undefined, detent?: number): number;
