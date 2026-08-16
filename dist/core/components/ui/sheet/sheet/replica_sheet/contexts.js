import React from "react";
export const ParentSheetContext = React.createContext({
    zIndex: 100_000,
});
// eslint-disable-next-line no-spaced-func
export const SheetInsideSheetContext = React.createContext(null);
