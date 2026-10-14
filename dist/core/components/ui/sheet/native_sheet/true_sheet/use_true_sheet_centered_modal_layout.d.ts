/**
 * True Sheet 内居中 Dialog / AlertDialog：上移内容，不缩短 teleport 层（避免遮罩底部漏光）。
 * 视觉位移约 liftAmount / 2。
 */
export declare function getTrueSheetCenteredModalContentOffsetY(hostName: string, safeAreaBottom: number, detent?: number, sheetTopPosition?: number | null): number;
export declare function useTrueSheetCenteredModalContentOffsetY(): number;
