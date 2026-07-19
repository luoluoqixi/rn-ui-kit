import { jsx as _jsx } from "react/jsx-runtime";
import { NavigationContainer, NavigationIndependentTree, createNavigationContainerRef, } from "@react-navigation/native";
import { createStackNavigator, } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
const BottomSheetStack = createStackNavigator();
export function createBottomSheetStackNavigationRef() {
    return createNavigationContainerRef();
}
export function BottomSheetStackNavigation({ children, initialRouteName, navigationRef, screenOptions, }) {
    const ref = navigationRef;
    return (_jsx(NavigationIndependentTree, { children: _jsx(NavigationContainer, { ref: ref, children: _jsx(View, { style: styles.stackRoot, children: _jsx(BottomSheetStack.Navigator, { initialRouteName: initialRouteName, screenOptions: screenOptions, children: children }) }) }) }));
}
export const BottomSheetInnerStack = BottomSheetStack;
const styles = StyleSheet.create({
    stackRoot: {
        flex: 1,
        minHeight: 0,
    },
});
