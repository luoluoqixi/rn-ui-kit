export interface SheetScrollGestureOwnershipInput {
    isPaneAtTop: boolean;
    isDraggingDown: boolean;
    currentScrollY: number;
    hasScrollableContent: boolean;
    scrollEngaged: boolean;
    allowSheetDragOnScrollEdge: boolean;
}
export declare function shouldSheetPanHandleScrollGesture({ isPaneAtTop, isDraggingDown, currentScrollY, hasScrollableContent, scrollEngaged, allowSheetDragOnScrollEdge, }: SheetScrollGestureOwnershipInput): boolean;
