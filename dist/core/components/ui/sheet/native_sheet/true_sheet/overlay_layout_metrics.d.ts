/** v4 lays out in the visible detent viewport; no inferred full-window offsets. */
export declare const TRUE_SHEET_DIALOG_DETENT_OFFSET_BLEND = 0;
export declare function getTrueSheetPartialDetentCompensationScale(_detent: number, _customScale?: number): number;
export declare function getTrueSheetCenteredModalDetentOffsetY(_sheetTopPosition: number | null, _detent: number): number;
export declare function getTrueSheetOverlayToastDetentOffset(_sheetTopPosition: number | null, _detent: number): number;
