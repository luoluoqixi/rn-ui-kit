import type { NativeSheetStackProps } from "./types";
declare function NativeSheetStackRoot({ children, initialRouteName, name, onOpenChange, open, overlayPortalHostName, screenOptions, sheetProps, }: NativeSheetStackProps): import("react").JSX.Element;
export declare const NativeSheetStack: typeof NativeSheetStackRoot & {
    Screen: <RouteName extends string>(_: import("@react-navigation/native").RouteConfig<import("@react-navigation/native").ParamListBase, RouteName, import("@react-navigation/native").StackNavigationState<import("@react-navigation/native").ParamListBase>, import("@react-navigation/stack").StackNavigationOptions, import("@react-navigation/stack").StackNavigationEventMap, import("@react-navigation/stack").StackNavigationProp<import("@react-navigation/native").ParamListBase, string, string | undefined>>) => null;
};
export {};
