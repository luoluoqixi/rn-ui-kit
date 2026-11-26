/** v4 lays out in the visible detent viewport; no inferred full-window offsets. */
export const TRUE_SHEET_DIALOG_DETENT_OFFSET_BLEND = 0;
export function getTrueSheetPartialDetentCompensationScale(_detent, _customScale) {
    return 1;
}
export function getTrueSheetCenteredModalDetentOffsetY(_sheetTopPosition, _detent) {
    return 0;
}
export function getTrueSheetOverlayToastDetentOffset(_sheetTopPosition, _detent) {
    return 0;
}
