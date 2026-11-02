import type { DetentChangeEvent, DidPresentEvent, DragChangeEvent, DragEndEvent, PositionChangeEvent, TrueSheetProps, WillPresentEvent } from "@lodev09/react-native-true-sheet";
/**
 * 合并 TrueSheet 布局事件与 overlay 上下文同步；回调须写在 `{...sheetProps}` 之后以免被覆盖。
 */
export declare function useTrueSheetOverlayLayoutSync(sheetProps?: Omit<TrueSheetProps, "children" | "header" | "name">): {
    onDetentChange: (event: DetentChangeEvent) => void;
    onDidDismiss: (event: Parameters<NonNullable<TrueSheetProps["onDidDismiss"]>>[0]) => void;
    onDidPresent: (event: DidPresentEvent) => void;
    onDragChange: (event: DragChangeEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    onPositionChange: (event: PositionChangeEvent) => void;
    onWillPresent: (event: WillPresentEvent) => void;
};
