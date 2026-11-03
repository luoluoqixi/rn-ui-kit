/**
 * Scoped overlay host 的布局补偿（Toast viewport 间距 + True Sheet 浮层底边）。
 * Toast：toastLayer 1× + Viewport `bottom`；居中 Dialog：`getTrueSheetCenteredModalLiftAmount` → content `y` 偏移（勿缩短 teleport 遮罩）。
 */
/** Sheet / overlay 内 Toast 默认底边距（Android 等） */
export declare const SCOPED_TOAST_VIEWPORT_INSET = 24;
/**
 * 嵌套 TrueSheet 局部 detent 时，`detentVisibleOffset` 的额外上移量（px）。
 * 补偿 `sheetTopPosition` 参考点与内容区域之间的固定偏差。
 *
 * Android 端低/中 detent 的嵌套 Sheet 会比可视内容底部略低一截，
 * 这里额外抬高一档，避免 Toast 落回底部留白区。
 */
export declare const TRUE_SHEET_TOAST_DETENT_LIFT: number;
/** iOS Native Stack pageSheet 等 overlay：略抬高，避免贴 Home 条 */
export declare const IOS_PAGE_SHEET_TOAST_VIEWPORT_INSET = 36;
/**
 * iOS True Sheet 专用 Viewport 底边距（配合 toastLayer safe area 补偿）。
 * 仅用于 insetAdjustment 垫高布局的 True Sheet host，勿用于 Native Stack pageSheet。
 */
export declare const IOS_TRUE_SHEET_TOAST_VIEWPORT_INSET = 56;
/** True Sheet overlay host（`insetAdjustment="automatic"` 会垫高布局底，与 pageSheet 不同） */
export declare function isTrueSheetOverlayPortalHost(hostName: string): boolean;
/**
 * True Sheet：toastLayer 底边补偿（仅 iOS，与 Viewport bottom 分工，勿叠双份）。
 */
export declare function getTrueSheetOverlayLayoutBottomInset(hostName: string, safeAreaBottom: number, detent?: number): number;
/**
 * Android True Sheet 内 SafeAreaProvider 的 bottom 常为 0，但 insetAdjustment 仍会垫高 RN 布局底。
 */
export declare const ANDROID_TRUE_SHEET_TELEPORT_LAYER_BOTTOM_FALLBACK = 48;
/** 在 2× bottom 上额外抬高 teleport 底边，使 flex 居中 Dialog 对齐可视区域（约 +EXTRA/2 视觉） */
export declare const ANDROID_TRUE_SHEET_TELEPORT_CENTER_EXTRA_BOTTOM = 6;
export declare const IOS_TRUE_SHEET_TELEPORT_CENTER_EXTRA_BOTTOM = 12;
/**
 * True Sheet 居中 Dialog 校正量（`insetAdjustment` 垫高导致 flex 居中偏下约 lift/2）。
 * 用于 `useTrueSheetCenteredModalContentOffsetY`，勿再作为 teleportLayer 的 `bottom`（会漏遮罩）。
 */
export declare function getTrueSheetCenteredModalLiftAmount(hostName: string, safeAreaBottom: number, detent?: number): number;
/** iOS True Sheet：toastLayer 底边补偿（与 teleport 共用 inset 计算） */
export declare function shouldApplyIosTrueSheetToastLayerInset(hostName: string): boolean;
export declare function getScopedToastViewportBottomInset(viewportName: string | undefined, detent?: number): number;
