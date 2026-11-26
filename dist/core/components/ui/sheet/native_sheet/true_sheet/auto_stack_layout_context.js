import { jsx as _jsx } from "react/jsx-runtime";
import { HeaderHeightContext } from "@react-navigation/elements";
import { NavigationContext } from "@react-navigation/native";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
const AutoStackLayoutContext = createContext(null);
/** Navigators absolutely position their pages, so Yoga cannot infer their natural height. */
export function TrueSheetAutoStackLayoutProvider({ children, onHeightChange }) {
    const activeOwner = useRef(null);
    const report = useCallback((owner, height) => {
        if (height != null && Number.isFinite(height) && height > 0) {
            activeOwner.current = owner;
            onHeightChange(Math.ceil(height));
        }
        else if (activeOwner.current === owner) {
            activeOwner.current = null;
            // Keep the last size through a navigation transition until the incoming
            // focused page reports its own content, rather than collapsing to zero.
        }
    }, [onHeightChange]);
    return _jsx(AutoStackLayoutContext.Provider, { value: report, children: children });
}
/** Report intrinsic scroll content plus the current native/JS navigation header. */
export function useTrueSheetStackContentSize(onContentSizeChange) {
    const report = useContext(AutoStackLayoutContext);
    const navigation = useContext(NavigationContext);
    const headerHeight = useContext(HeaderHeightContext) ?? 0;
    const owner = useRef({});
    const [height, setHeight] = useState(null);
    const [focused, setFocused] = useState(() => navigation?.isFocused() ?? true);
    useEffect(() => {
        setFocused(navigation?.isFocused() ?? true);
        const focus = navigation?.addListener("focus", () => setFocused(true));
        const blur = navigation?.addListener("blur", () => setFocused(false));
        return () => { focus?.(); blur?.(); };
    }, [navigation]);
    useEffect(() => {
        if (!report || !focused || height == null)
            return;
        const token = owner.current;
        report(token, height + headerHeight);
        return () => report(token, null);
    }, [report, focused, height, headerHeight]);
    return useCallback((width, contentHeight) => {
        if (report)
            setHeight(contentHeight);
        onContentSizeChange?.(width, contentHeight);
    }, [report, onContentSizeChange]);
}
