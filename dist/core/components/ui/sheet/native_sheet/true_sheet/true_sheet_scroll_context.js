import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from "react";
const TrueSheetScrollLayoutContext = createContext(null);
export function TrueSheetScrollLayoutProvider({ automaticContentInsetAdjustment = false, children, insetAdjustment = "automatic", nativeScrollInsetsApplied = false, presentationActive = false, }) {
    const value = useMemo(() => ({
        active: true,
        automaticContentInsetAdjustment,
        insetAdjustment,
        nativeScrollInsetsApplied,
        presentationActive,
    }), [
        automaticContentInsetAdjustment,
        insetAdjustment,
        nativeScrollInsetsApplied,
        presentationActive,
    ]);
    return (_jsx(TrueSheetScrollLayoutContext.Provider, { value: value, children: children }));
}
export function useTrueSheetScrollLayout() {
    return (useContext(TrueSheetScrollLayoutContext) ?? {
        active: false,
        automaticContentInsetAdjustment: false,
        insetAdjustment: "automatic",
        nativeScrollInsetsApplied: false,
        presentationActive: false,
    });
}
