import { type NavigationContainerRef, type ParamListBase } from "@react-navigation/native";
import type { ReactNode } from "react";
import { type TrueSheetInnerStackScreenOptions } from "./stack_navigator";
export type TrueSheetStackNavigationRef<ParamList extends ParamListBase = ParamListBase> = NavigationContainerRef<ParamList>;
export declare function createTrueSheetStackNavigationRef<ParamList extends ParamListBase = ParamListBase>(): import("@react-navigation/core").NavigationContainerRefWithCurrent<ParamList>;
type TrueSheetStackNavigationProps = {
    children: ReactNode;
    initialRouteName?: string;
    navigationRef?: TrueSheetStackNavigationRef;
    screenOptions?: TrueSheetInnerStackScreenOptions;
};
/**
 * True Sheet 内独立 NavigationContainer + Stack（iOS 原生 / Android JS）。
 */
export declare function TrueSheetStackNavigation(props: TrueSheetStackNavigationProps): import("react").JSX.Element;
/** 与当前平台匹配的 Stack.Screen */
export declare const TrueSheetInnerStack: import("@react-navigation/core").TypedNavigator<import("@react-navigation/stack").StackTypeBag<ParamListBase, string | undefined>, import("@react-navigation/core").StaticConfig<import("@react-navigation/stack").StackTypeBag<ParamListBase, string | undefined>>> | import("@react-navigation/core").TypedNavigator<import("@react-navigation/native-stack").NativeStackTypeBag<ParamListBase, string | undefined>, import("@react-navigation/core").StaticConfig<import("@react-navigation/native-stack").NativeStackTypeBag<ParamListBase, string | undefined>>>;
export {};
