import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HeaderHeightContext } from "@react-navigation/elements";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { NativeList, NativeListNavigationItem, NativeListSection, NativeSheetFillContent, NativeSheetScrollContent, ScrollView, Text, isIos26Plus, useAppBackgroundColors, } from "rn-ui-kit/core";
import { blurActiveElementOnWeb } from "../../web_focus";
import { componentExampleDefinitions } from "./catalog";
const sortedComponentExampleDefinitions = [...componentExampleDefinitions].sort((left, right) => left.label.localeCompare(right.label, "en", { numeric: true, sensitivity: "base" }) ||
    left.key.localeCompare(right.key));
export function getComponentExampleRouteName(key) {
    return `component-example:${key}`;
}
/** The examples list lives on the debug panel stack; only its detail routes are separate screens. */
export function RnUiKitComponentExamplesDebugPage({ header, layoutHost = "default", }) {
    const appBackgroundColors = useAppBackgroundColors();
    const navigation = useNavigation();
    const isNativeIosPage = Platform.OS === "ios";
    const usesPreIos26ScrollEdgeHeader = isNativeIosPage && !isIos26Plus();
    const pageBackgroundColor = layoutHost === "nativeSheet" && isIos26Plus() ? "transparent" : appBackgroundColors.screen;
    return (_jsxs(View, { style: [styles.root, { backgroundColor: pageBackgroundColor }], children: [header != null ? _jsx(View, { style: styles.routeHeader, children: header }) : null, _jsx(NativeList, { automaticallyAdjustsScrollIndicatorInsets: isNativeIosPage ? true : undefined, contentInsetAdjustmentBehavior: usesPreIos26ScrollEdgeHeader ? "automatic" : undefined, tracksNavigationBarScrollEdge: usesPreIos26ScrollEdgeHeader, children: _jsx(NativeListSection, { children: sortedComponentExampleDefinitions.map((definition) => (_jsx(NativeListNavigationItem, { onPress: () => {
                            blurActiveElementOnWeb();
                            navigation.navigate(getComponentExampleRouteName(definition.key));
                        }, subtitle: definition.description, title: definition.label }, definition.key))) }) })] }));
}
export function RnUiKitComponentExampleDetailPage({ definition, headerTransparent = false, layoutHost = "default", }) {
    const appBackgroundColors = useAppBackgroundColors();
    const headerHeight = useContext(HeaderHeightContext) ?? 0;
    const isFocused = useIsFocused();
    const ActiveExample = definition.Component;
    const adjustsForNativeIosHeader = layoutHost === "default" && Platform.OS === "ios";
    const pageBackgroundColor = layoutHost === "nativeSheet" && isIos26Plus() ? "transparent" : appBackgroundColors.screen;
    if (definition.layout === "fill") {
        const fillBodyStyle = [
            styles.detailBody,
            { backgroundColor: pageBackgroundColor },
            headerTransparent && { paddingTop: headerHeight },
        ];
        if (layoutHost === "nativeSheet") {
            return (_jsx(NativeSheetFillContent, { style: fillBodyStyle, children: _jsx(ActiveExample, {}) }));
        }
        return (_jsx(View, { style: fillBodyStyle, children: _jsx(ActiveExample, {}) }));
    }
    const contents = (_jsxs(View, { style: [styles.scrollContent, { backgroundColor: pageBackgroundColor }], children: [_jsx(Text, { opacity: 0.6, children: definition.description }), _jsx(ActiveExample, {})] }));
    const scrollStyle = [styles.detailBody, { backgroundColor: pageBackgroundColor }];
    if (layoutHost === "nativeSheet") {
        return (_jsx(NativeSheetScrollContent, { bindToNativeSheet: isFocused, nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: scrollStyle, children: contents }));
    }
    return (_jsx(ScrollView, { automaticallyAdjustsScrollIndicatorInsets: adjustsForNativeIosHeader ? true : undefined, contentInsetAdjustmentBehavior: adjustsForNativeIosHeader ? "automatic" : undefined, nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: scrollStyle, children: contents }));
}
const styles = StyleSheet.create({
    detailBody: { flex: 1, minHeight: 0 },
    root: { flex: 1, minHeight: 0 },
    routeHeader: { paddingHorizontal: 20, paddingTop: 8 },
    scrollContent: { gap: 16, padding: 16, paddingBottom: 32 },
});
