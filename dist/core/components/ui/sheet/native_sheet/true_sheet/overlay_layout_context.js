import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
const defaultOverlayLayoutState = {
    detent: 1,
    sheetTopPosition: null,
};
const TrueSheetOverlayLayoutStateContext = createContext(defaultOverlayLayoutState);
// eslint-disable-next-line no-spaced-func
const TrueSheetOverlayLayoutSetterContext = createContext(null);
/** 供 TrueSheet 宿主同步 detent / position，用于嵌套 Sheet 内 overlay 定位。 */
export function TrueSheetOverlayLayoutProvider({ children }) {
    const [state, setState] = useState(defaultOverlayLayoutState);
    const setOverlayLayout = useCallback((patch) => {
        setState((previous) => {
            const next = { ...previous, ...patch };
            if (next.detent === previous.detent && next.sheetTopPosition === previous.sheetTopPosition) {
                return previous;
            }
            return next;
        });
    }, []);
    const setter = useMemo(() => setOverlayLayout, [setOverlayLayout]);
    return (_jsx(TrueSheetOverlayLayoutSetterContext.Provider, { value: setter, children: _jsx(TrueSheetOverlayLayoutStateContext.Provider, { value: state, children: children }) }));
}
export function useTrueSheetOverlayLayout() {
    return useContext(TrueSheetOverlayLayoutStateContext);
}
export function useTrueSheetOverlayDetent() {
    return useTrueSheetOverlayLayout().detent;
}
export function useTrueSheetOverlaySheetTopPosition() {
    return useTrueSheetOverlayLayout().sheetTopPosition;
}
export function useTrueSheetOverlayLayoutSetter() {
    return useContext(TrueSheetOverlayLayoutSetterContext);
}
