import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { Platform } from "react-native";
const TrueSheetScrollableBindingContext = createContext(null);
function applyScrollableView(sheet, scrollView) {
    if (Platform.OS !== "ios" || sheet == null)
        return;
    void sheet.setScrollableView(scrollView).catch((error) => {
        if (__DEV__) {
            console.warn("[rn-ui-kit] Failed to bind TrueSheet ScrollView", error);
        }
    });
}
export function useTrueSheetScrollableBindingController() {
    const sheetRef = useRef(null);
    const presentedRef = useRef(false);
    const activeOwnerRef = useRef(null);
    const scrollViewRef = useRef(null);
    const setSheetRef = useCallback((sheet) => {
        sheetRef.current = sheet;
        if (presentedRef.current && sheet != null && activeOwnerRef.current != null) {
            applyScrollableView(sheet, scrollViewRef.current);
        }
    }, []);
    const setPresented = useCallback((presented) => {
        presentedRef.current = presented;
        if (presented && activeOwnerRef.current != null) {
            applyScrollableView(sheetRef.current, scrollViewRef.current);
        }
    }, []);
    const registerScrollableView = useCallback((owner, scrollView) => {
        if (scrollView != null) {
            activeOwnerRef.current = owner;
            scrollViewRef.current = scrollView;
            if (presentedRef.current) {
                applyScrollableView(sheetRef.current, scrollView);
            }
            return;
        }
        // A stale screen must not clear the ScrollView registered by the newly focused screen.
        if (activeOwnerRef.current !== owner)
            return;
        activeOwnerRef.current = null;
        scrollViewRef.current = null;
        if (presentedRef.current) {
            applyScrollableView(sheetRef.current, null);
        }
    }, []);
    const refreshScrollableView = useCallback((owner) => {
        if (!presentedRef.current ||
            activeOwnerRef.current !== owner ||
            scrollViewRef.current == null) {
            return;
        }
        applyScrollableView(sheetRef.current, scrollViewRef.current);
    }, []);
    const providerValue = useMemo(() => ({ refreshScrollableView, registerScrollableView }), [refreshScrollableView, registerScrollableView]);
    return { providerValue, setPresented, setSheetRef };
}
export function TrueSheetScrollableBindingProvider({ children, value, }) {
    return (_jsx(TrueSheetScrollableBindingContext.Provider, { value: value, children: children }));
}
export function useOptionalTrueSheetScrollableBinding() {
    return useContext(TrueSheetScrollableBindingContext);
}
