import { type NavigationContainerRef, type ParamListBase } from "@react-navigation/native";
import { type StackNavigationOptions, type StackNavigationProp } from "@react-navigation/stack";
import type { ReactNode } from "react";
export type BottomSheetStackNavigationRef<ParamList extends ParamListBase = ParamListBase> = NavigationContainerRef<ParamList>;
export type BottomSheetStackNavigationOptions = StackNavigationOptions;
export type BottomSheetStackNavigationPropAlias<ParamList extends ParamListBase = ParamListBase> = StackNavigationProp<ParamList>;
export declare function createBottomSheetStackNavigationRef<ParamList extends ParamListBase = ParamListBase>(): import("@react-navigation/core").NavigationContainerRefWithCurrent<ParamList>;
type BottomSheetStackNavigationProps = {
    children: ReactNode;
    initialRouteName?: string;
    navigationRef?: BottomSheetStackNavigationRef;
    screenOptions?: BottomSheetStackNavigationOptions;
};
export declare function BottomSheetStackNavigation({ children, initialRouteName, navigationRef, screenOptions, }: BottomSheetStackNavigationProps): import("react").JSX.Element;
export declare const BottomSheetInnerStack: import("@react-navigation/core").TypedNavigator<import("@react-navigation/stack").StackTypeBag<ParamListBase, string | undefined>, import("@react-navigation/core").StaticConfig<import("@react-navigation/stack").StackTypeBag<ParamListBase, string | undefined>>>;
export {};
