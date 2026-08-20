import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const GestureSheetContext = createContext(null);
export function useGestureSheetContext() {
    return useContext(GestureSheetContext);
}
export function GestureSheetProvider({ children, isDragging, blockPan, setBlockPan, panGesture, panGestureRef, }) {
    const value = {
        panGesture,
        panGestureRef,
        isDragging,
        blockPan,
        setBlockPan,
    };
    return _jsx(GestureSheetContext.Provider, { value: value, children: children });
}
