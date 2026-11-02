import { type ReactNode } from "react";
export type TrueSheetOverlayLayoutState = {
    /** 当前 detent 比例 0–1，默认 1（全高）。 */
    detent: number;
    /** TrueSheet `nativeEvent.position`：Sheet 顶边距屏幕顶部的 Y（px）。 */
    sheetTopPosition: number | null;
};
/** 供 TrueSheet 宿主同步 detent / position，用于嵌套 Sheet 内 overlay 定位。 */
export declare function TrueSheetOverlayLayoutProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useTrueSheetOverlayLayout(): TrueSheetOverlayLayoutState;
export declare function useTrueSheetOverlayDetent(): number;
export declare function useTrueSheetOverlaySheetTopPosition(): number | null;
export declare function useTrueSheetOverlayLayoutSetter(): ((patch: Partial<TrueSheetOverlayLayoutState>) => void) | null;
