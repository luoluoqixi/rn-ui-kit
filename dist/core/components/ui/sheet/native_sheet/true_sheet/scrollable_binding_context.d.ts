import { type ReactNode, type Ref } from "react";
import type { ScrollView } from "react-native";
type ScrollableBindingOwner = object;
type TrueSheetScrollableBindingContextValue = {
    registerScrollableView: (owner: ScrollableBindingOwner, scrollView: ScrollView | null) => void;
    refreshScrollableView: (owner: ScrollableBindingOwner) => void;
};
/** A new ref object triggers v4's PureComponent update after page/focus changes. */
export declare function useTrueSheetScrollableBindingController(): {
    providerValue: {
        registerScrollableView: (owner: ScrollableBindingOwner, view: ScrollView | null) => void;
        refreshScrollableView: (owner: ScrollableBindingOwner) => void;
    };
    scrollableRef: import("react").RefObject<import("react-native").ReactNativeElement | import("react").Component<unknown, {}, any> | {
        getScrollableNode(): unknown;
    } | {
        getNativeScrollRef(): unknown;
    } | null> | undefined;
    setPresented: (presented: boolean) => void;
};
export declare function TrueSheetScrollableBindingProvider({ children, value }: {
    children: ReactNode;
    value: TrueSheetScrollableBindingContextValue;
}): import("react").JSX.Element;
export declare function useOptionalTrueSheetScrollableBinding(): TrueSheetScrollableBindingContextValue | null;
/** Works with a plain sheet and with optional native/JS stack navigation. */
export declare function useTrueSheetScrollableRegistration(ref: Ref<ScrollView> | undefined, enabled?: boolean): (node: ScrollView | null) => void;
export {};
