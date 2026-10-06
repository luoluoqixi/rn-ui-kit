import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { type ReactNode } from "react";
import { type ScrollView } from "react-native";
type ScrollableBindingOwner = object;
type TrueSheetScrollableBindingContextValue = {
    registerScrollableView: (owner: ScrollableBindingOwner, scrollView: ScrollView | null) => void;
    refreshScrollableView: (owner: ScrollableBindingOwner) => void;
};
export declare function useTrueSheetScrollableBindingController(): {
    providerValue: TrueSheetScrollableBindingContextValue;
    setPresented: (presented: boolean) => void;
    setSheetRef: (sheet: TrueSheet | null) => void;
};
export declare function TrueSheetScrollableBindingProvider({ children, value, }: {
    children: ReactNode;
    value: TrueSheetScrollableBindingContextValue;
}): import("react").JSX.Element;
export declare function useOptionalTrueSheetScrollableBinding(): TrueSheetScrollableBindingContextValue | null;
export {};
