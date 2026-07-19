import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const BottomSheetStackHostContext = createContext(null);
export function BottomSheetStackHostProvider({ children, onRequestClose, }) {
    return (_jsx(BottomSheetStackHostContext.Provider, { value: { onRequestClose }, children: children }));
}
export function useBottomSheetStackHost() {
    const value = useContext(BottomSheetStackHostContext);
    if (value == null) {
        throw new Error("useBottomSheetStackHost must be used within BottomSheetStackHost");
    }
    return value;
}
