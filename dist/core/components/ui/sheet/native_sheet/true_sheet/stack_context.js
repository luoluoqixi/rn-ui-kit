import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const TrueSheetStackHostContext = createContext(null);
export function TrueSheetStackHostProvider({ children, onRequestClose, }) {
    return (_jsx(TrueSheetStackHostContext.Provider, { value: { onRequestClose }, children: children }));
}
export function useTrueSheetStackHost() {
    const value = useContext(TrueSheetStackHostContext);
    if (value == null) {
        throw new Error("useTrueSheetStackHost must be used within TrueSheetStackHost");
    }
    return value;
}
