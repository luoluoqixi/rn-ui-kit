/** v4 lays out in the visible detent viewport; no inferred full-window offsets. */
export const TRUE_SHEET_DIALOG_DETENT_OFFSET_BLEND = 0;
export function getTrueSheetPartialDetentCompensationScale(_detent: number, _customScale?: number): number {
  return 1;
}
export function getTrueSheetCenteredModalDetentOffsetY(_sheetTopPosition: number | null, _detent: number): number {
  return 0;
}
export function getTrueSheetOverlayToastDetentOffset(_sheetTopPosition: number | null, _detent: number): number {
  return 0;
}
