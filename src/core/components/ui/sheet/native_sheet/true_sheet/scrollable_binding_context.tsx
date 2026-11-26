import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import { NavigationContext } from "@react-navigation/native";
import {
  type ReactNode, type Ref, createContext, useCallback, useContext, useEffect,
  useMemo, useRef, useState,
} from "react";
import type { ScrollView } from "react-native";

type ScrollableBindingOwner = object;
type TrueSheetScrollableBindingContextValue = {
  registerScrollableView: (owner: ScrollableBindingOwner, scrollView: ScrollView | null) => void;
  refreshScrollableView: (owner: ScrollableBindingOwner) => void;
};
const TrueSheetScrollableBindingContext = createContext<TrueSheetScrollableBindingContextValue | null>(null);

/** A new ref object triggers v4's PureComponent update after page/focus changes. */
export function useTrueSheetScrollableBindingController() {
  const activeOwner = useRef<ScrollableBindingOwner | null>(null);
  const activeView = useRef<ScrollView | null>(null);
  const registrations = useRef(new Map<ScrollableBindingOwner, ScrollView>());
  const [scrollableRef, setScrollableRef] = useState<TrueSheetProps["scrollableRef"]>();
  const registerScrollableView = useCallback((owner: ScrollableBindingOwner, view: ScrollView | null) => {
    if (view != null) {
      if (activeOwner.current === owner && activeView.current === view) return;
      registrations.current.delete(owner);
      registrations.current.set(owner, view);
      activeOwner.current = owner;
      activeView.current = view;
      setScrollableRef({ current: view });
    } else {
      registrations.current.delete(owner);
      if (activeOwner.current !== owner) return;
      // A temporary overlay can register its own list. Restore the focused
      // page on removal; outgoing pages cannot clear a newer registration.
      const previous = Array.from(registrations.current.entries()).at(-1);
      activeOwner.current = previous?.[0] ?? null;
      activeView.current = previous?.[1] ?? null;
      setScrollableRef(previous ? { current: previous[1] } : undefined);
    }
  }, []);
  const refreshScrollableView = useCallback((owner: ScrollableBindingOwner) => {
    if (activeOwner.current === owner && activeView.current != null) {
      setScrollableRef({ current: activeView.current });
    }
  }, []);
  const setPresented = useCallback((presented: boolean) => {
    if (presented && activeView.current != null) setScrollableRef({ current: activeView.current });
  }, []);
  const providerValue = useMemo(() => ({ registerScrollableView, refreshScrollableView }),
    [registerScrollableView, refreshScrollableView]);
  return { providerValue, scrollableRef, setPresented };
}

export function TrueSheetScrollableBindingProvider({ children, value }: {
  children: ReactNode; value: TrueSheetScrollableBindingContextValue;
}) {
  return <TrueSheetScrollableBindingContext.Provider value={value}>{children}</TrueSheetScrollableBindingContext.Provider>;
}
export function useOptionalTrueSheetScrollableBinding() {
  return useContext(TrueSheetScrollableBindingContext);
}

/** Works with a plain sheet and with optional native/JS stack navigation. */
export function useTrueSheetScrollableRegistration(ref: Ref<ScrollView> | undefined, enabled = true) {
  const binding = useOptionalTrueSheetScrollableBinding();
  const navigation = useContext(NavigationContext);
  const owner = useRef<object>({});
  const view = useRef<ScrollView | null>(null);
  const [focused, setFocused] = useState(() => navigation?.isFocused() ?? true);
  useEffect(() => {
    setFocused(navigation?.isFocused() ?? true);
    const focus = navigation?.addListener("focus", () => setFocused(true));
    const blur = navigation?.addListener("blur", () => setFocused(false));
    return () => { focus?.(); blur?.(); };
  }, [navigation]);
  const active = enabled && focused;
  const setRef = useCallback((node: ScrollView | null) => {
    view.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
    if (active) binding?.registerScrollableView(owner.current, node);
  }, [active, binding, ref]);
  useEffect(() => {
    const token = owner.current;
    binding?.registerScrollableView(token, active ? view.current : null);
    return () => binding?.registerScrollableView(token, null);
  }, [active, binding]);
  return setRef;
}
