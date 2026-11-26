import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from "react";
const TrueSheetScrollLayoutContext = createContext(null);
export function TrueSheetScrollLayoutProvider({ autoDetent = false, automaticContentInsetAdjustment = false, children, insetAdjustment = "automatic", nativeScrollInsetsApplied = false, presentationActive = false, }) {
    const value = useMemo(() => ({
        active: true,
        autoDetent,
        automaticContentInsetAdjustment,
        insetAdjustment,
        nativeScrollInsetsApplied,
        presentationActive,
    }), [
        autoDetent,
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
        autoDetent: false,
        automaticContentInsetAdjustment: false,
        insetAdjustment: "automatic",
        nativeScrollInsetsApplied: false,
        presentationActive: false,
    });
}
