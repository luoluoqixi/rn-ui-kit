/**
 * Dialog 几何校正混合系数。
 */
export declare const TRUE_SHEET_DIALOG_DETENT_OFFSET_BLEND = 0.8;
/**
 * 部分 detent 时 RN 布局仍含 `insetAdjustment` 垫高，Toast / Dialog 补偿缩放。
 */
export declare function getTrueSheetPartialDetentCompensationScale(detent: number, customScale?: number): number;
/**
 * Dialog / AlertDialog：teleport 按整窗高度居中，嵌套 Sheet 偏低 detent 时需额外上移。
 * 返回加到 Tamagui `y` 上的增量（负值 = 上移）。
 */
export declare function getTrueSheetCenteredModalDetentOffsetY(sheetTopPosition: number | null, detent: number): number;
/**
 * 嵌套 TrueSheet 局部 detent 时，Toast 所在 overlay 容器撑满完整内容高度，
 * 而 Sheet 只显示顶部 detent 比例的内容。返回 toastLayer 相对 hostStack 底部
 * 的上移量（px），使 toast 出现在可视区域底部而非完整内容底部。
 *
 * 计算依据：
 *   visibleHeight = windowHeight - sheetTopPosition
 *   fullContentHeight ≈ visibleHeight / detent
 *   hiddenBottom = fullContentHeight × (1 - detent) = visibleHeight × (1/detent - 1)
 */
export declare function getTrueSheetOverlayToastDetentOffset(sheetTopPosition: number | null, detent: number): number;
