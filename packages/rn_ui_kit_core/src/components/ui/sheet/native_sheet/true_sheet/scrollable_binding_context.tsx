import { TrueSheet } from "@lodev09/react-native-true-sheet";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { Platform, type ScrollView } from "react-native";

type ScrollableBindingOwner = object;

type TrueSheetScrollableBindingContextValue = {
  registerScrollableView: (owner: ScrollableBindingOwner, scrollView: ScrollView | null) => void;
  refreshScrollableView: (owner: ScrollableBindingOwner) => void;
};

const TrueSheetScrollableBindingContext =
  createContext<TrueSheetScrollableBindingContextValue | null>(null);

function applyScrollableView(sheet: TrueSheet | null, scrollView: ScrollView | null) {
  if (Platform.OS !== "ios" || sheet == null) return;
  void sheet.setScrollableView(scrollView).catch((error: unknown) => {
    if (__DEV__) {
      console.warn("[rn_ui_kit] Failed to bind TrueSheet ScrollView", error);
    }
  });
}

export function useTrueSheetScrollableBindingController(): {
  providerValue: TrueSheetScrollableBindingContextValue;
  setPresented: (presented: boolean) => void;
  setSheetRef: (sheet: TrueSheet | null) => void;
} {
  const sheetRef = useRef<TrueSheet | null>(null);
  const presentedRef = useRef(false);
  const activeOwnerRef = useRef<ScrollableBindingOwner | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const setSheetRef = useCallback((sheet: TrueSheet | null) => {
    sheetRef.current = sheet;
    if (presentedRef.current && sheet != null && activeOwnerRef.current != null) {
      applyScrollableView(sheet, scrollViewRef.current);
    }
  }, []);

  const setPresented = useCallback((presented: boolean) => {
    presentedRef.current = presented;
    if (presented && activeOwnerRef.current != null) {
      applyScrollableView(sheetRef.current, scrollViewRef.current);
    }
  }, []);

  const registerScrollableView = useCallback(
    (owner: ScrollableBindingOwner, scrollView: ScrollView | null) => {
      if (scrollView != null) {
        activeOwnerRef.current = owner;
        scrollViewRef.current = scrollView;
        if (presentedRef.current) {
          applyScrollableView(sheetRef.current, scrollView);
        }
        return;
      }

      // A stale screen must not clear the ScrollView registered by the newly focused screen.
      if (activeOwnerRef.current !== owner) return;
      activeOwnerRef.current = null;
      scrollViewRef.current = null;
      if (presentedRef.current) {
        applyScrollableView(sheetRef.current, null);
      }
    },
    [],
  );

  const refreshScrollableView = useCallback((owner: ScrollableBindingOwner) => {
    if (
      !presentedRef.current ||
      activeOwnerRef.current !== owner ||
      scrollViewRef.current == null
    ) {
      return;
    }
    applyScrollableView(sheetRef.current, scrollViewRef.current);
  }, []);

  const providerValue = useMemo(
    () => ({ refreshScrollableView, registerScrollableView }),
    [refreshScrollableView, registerScrollableView],
  );

  return { providerValue, setPresented, setSheetRef };
}

export function TrueSheetScrollableBindingProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: TrueSheetScrollableBindingContextValue;
}) {
  return (
    <TrueSheetScrollableBindingContext.Provider value={value}>
      {children}
    </TrueSheetScrollableBindingContext.Provider>
  );
}

export function useOptionalTrueSheetScrollableBinding() {
  return useContext(TrueSheetScrollableBindingContext);
}
