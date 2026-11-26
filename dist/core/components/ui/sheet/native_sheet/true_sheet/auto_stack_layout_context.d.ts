import { type ReactNode } from "react";
/** Navigators absolutely position their pages, so Yoga cannot infer their natural height. */
export declare function TrueSheetAutoStackLayoutProvider({ children, onHeightChange }: {
    children: ReactNode;
    onHeightChange: (height: number | undefined) => void;
}): import("react").JSX.Element;
/** Report intrinsic scroll content plus the current native/JS navigation header. */
export declare function useTrueSheetStackContentSize(onContentSizeChange?: (width: number, height: number) => void): (width: number, contentHeight: number) => void;
