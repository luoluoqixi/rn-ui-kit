import React from "react";
export declare const ParentSheetContext: React.Context<{
    zIndex: number;
}>;
export type InnerSheetState = {
    hasVisibleChild: boolean;
    shouldLockParentDrag: boolean;
};
export declare const SheetInsideSheetContext: React.Context<((state: InnerSheetState) => void) | null>;
