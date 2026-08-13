import { jsx as _jsx } from "react/jsx-runtime";
import { getDefaultHeaderHeight } from "@react-navigation/elements";
import { DarkTheme, DefaultTheme, NavigationContainer, NavigationIndependentTree, createNavigationContainerRef, } from "@react-navigation/native";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { withNativeStackGestureOptions } from "../../../utils/navigation";
import { useResolvedeColorScheme } from "../../../utils/theme";
import { createStackNavigator } from "./stack_js_stack";
import { createNativeStackNavigator, } from "./stack_native_stack";
import { trueSheetUsesNativeStackNavigator, } from "./stack_navigator";
const NativeStack = createNativeStackNavigator();
const JsStack = createStackNavigator();
export function createTrueSheetStackNavigationRef() {
    return createNavigationContainerRef();
}
function TrueSheetStackNavigationInner({ children, initialRouteName, navigationRef, screenOptions, }) {
    const ref = navigationRef;
    const layout = useWindowDimensions();
    const resolvedColorScheme = useResolvedeColorScheme();
    const navigationTheme = resolvedColorScheme === "dark" ? DarkTheme : DefaultTheme;
    if (trueSheetUsesNativeStackNavigator) {
        const configuredScreenOptions = (screenOptions ?? {});
        const configuredGestureDistance = configuredScreenOptions.gestureResponseDistance ?? {};
        // Keep the native header as a TrueSheet drag surface; full-screen back starts below it.
        const defaultHeaderHeight = getDefaultHeaderHeight(layout, true, 0);
        const configuredTop = configuredGestureDistance.top;
        const fullScreenGestureTop = configuredScreenOptions.headerShown === false
            ? configuredTop
            : Math.max(defaultHeaderHeight, configuredTop ?? 0);
        const nativeScreenOptions = withNativeStackGestureOptions({
            ...configuredScreenOptions,
            gestureResponseDistance: {
                ...configuredGestureDistance,
                ...(fullScreenGestureTop == null ? {} : { top: fullScreenGestureTop }),
            },
        });
        return (_jsx(NavigationIndependentTree, { children: _jsx(NavigationContainer, { ref: ref, theme: navigationTheme, children: _jsx(View, { style: styles.nativeStackRoot, children: _jsx(NativeStack.Navigator, { initialRouteName: initialRouteName, screenOptions: nativeScreenOptions, children: children }) }) }) }));
    }
    return (_jsx(NavigationIndependentTree, { children: _jsx(NavigationContainer, { ref: ref, theme: navigationTheme, children: _jsx(View, { style: styles.stackRoot, children: _jsx(JsStack.Navigator, { detachInactiveScreens: false, initialRouteName: initialRouteName, screenOptions: screenOptions, children: children }) }) }) }));
}
/**
 * True Sheet 内独立 NavigationContainer + Stack（iOS 原生 / Android JS）。
 */
export function TrueSheetStackNavigation(props) {
    return _jsx(TrueSheetStackNavigationInner, { ...props });
}
/** 与当前平台匹配的 Stack.Screen */
export const TrueSheetInnerStack = trueSheetUsesNativeStackNavigator ? NativeStack : JsStack;
const styles = StyleSheet.create({
    nativeStackRoot: {
        flex: Platform.OS === "ios" ? 1 : undefined,
        minHeight: Platform.OS === "ios" ? 0 : undefined,
    },
    stackRoot: {
        flex: 1,
        minHeight: 0,
    },
});
