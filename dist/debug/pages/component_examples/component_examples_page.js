import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { HeaderHeightContext } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeList, NativeListNavigationItem, NativeListSection, NativeSheetFillContent, NativeSheetScrollContent, ScrollView, Text, isIos26Plus, useAppBackgroundColors, } from "../../../core/components/ui";
import { componentExampleDefinitions } from "./catalog";
const sortedComponentExampleDefinitions = [...componentExampleDefinitions].sort((left, right) => left.label.localeCompare(right.label, "en", { numeric: true, sensitivity: "base" }) ||
    left.key.localeCompare(right.key));
export function getComponentExampleRouteName(key) {
    return `component-example:${key}`;
}
function getComponentExampleDefinition(key) {
    const definition = componentExampleDefinitions.find((item) => item.key === key);
    if (definition == null)
        throw new Error(`Unknown rn-ui-kit component example: ${key}`);
    return definition;
}
export function getRnUiKitComponentExampleTitle(key) {
    return getComponentExampleDefinition(key).label;
}
export function RnUiKitComponentExamplesDebugPage({ header, onOpenComponentExample, }) {
    const navigation = useNavigation();
    const isNativeIosPage = Platform.OS === "ios";
    const insets = useSafeAreaInsets();
    const tracksScrollEdgeHeader = Platform.OS === "android" || Platform.OS === "web" || isNativeIosPage;
    const horizontalContentInset = Platform.OS === "ios" ? undefined : { paddingLeft: insets.left, paddingRight: insets.right };
    return (_jsxs(View, { style: styles.root, children: [header != null ? (_jsx(View, { style: [
                    styles.routeHeader,
                    Platform.OS !== "ios" && {
                        paddingLeft: 20 + insets.left,
                        paddingRight: 20 + insets.right,
                    },
                ], children: header })) : null, _jsx(NativeList, { automaticallyAdjustsScrollIndicatorInsets: isNativeIosPage ? true : undefined, contentInsetAdjustmentBehavior: isNativeIosPage ? "automatic" : undefined, contentContainerStyle: horizontalContentInset, tracksNavigationBarScrollEdge: tracksScrollEdgeHeader, children: _jsx(NativeListSection, { children: sortedComponentExampleDefinitions.map((definition) => (_jsx(NativeListNavigationItem, { onPress: () => {
                            if (onOpenComponentExample != null)
                                onOpenComponentExample(definition.key);
                            else
                                navigation.navigate(getComponentExampleRouteName(definition.key));
                        }, title: definition.label }, definition.key))) }) })] }));
}
export function RnUiKitComponentExampleDebugPage({ exampleKey, headerTransparent = false, layoutHost = "default", }) {
    return (_jsx(RnUiKitComponentExampleDetailPage, { definition: getComponentExampleDefinition(exampleKey), headerTransparent: headerTransparent, layoutHost: layoutHost }));
}
export function RnUiKitComponentExampleDetailPage({ definition, headerTransparent = false, layoutHost = "default", }) {
    const headerHeight = useContext(HeaderHeightContext) ?? 0;
    const insets = useSafeAreaInsets();
    const appBackgroundColors = useAppBackgroundColors();
    const ActiveExample = definition.Component;
    if (definition.layout === "fill") {
        const pageBackgroundColor = layoutHost === "nativeSheet" && isIos26Plus() ? "transparent" : appBackgroundColors.screen;
        const fillBodyStyle = [
            styles.detailBody,
            {
                backgroundColor: pageBackgroundColor,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            },
            headerTransparent &&
                !definition.handlesHeaderInsets && { paddingTop: headerHeight },
        ];
        if (layoutHost === "nativeSheet") {
            return (_jsx(NativeSheetFillContent, { style: fillBodyStyle, children: _jsx(ActiveExample, {}) }));
        }
        return (_jsx(View, { style: fillBodyStyle, children: _jsx(ActiveExample, {}) }));
    }
    const page = (_jsxs(View, { style: [
            styles.scrollContent,
            { paddingLeft: 16 + insets.left, paddingRight: 16 + insets.right },
        ], children: [_jsx(Text, { className: "text-muted-foreground", children: definition.description ?? `${definition.label} 示例` }), _jsx(ActiveExample, {})] }));
    if (layoutHost === "nativeSheet") {
        return (_jsx(NativeSheetScrollContent
        // Native Stack 中的 ScrollView 不属于 TrueSheetContentView 子树；显式绑定会让
        // iOS 15 在低 detent 下按窗口高度重写它的 frame。详情页使用自身的 inset 处理。
        , { 
            // Native Stack 中的 ScrollView 不属于 TrueSheetContentView 子树；显式绑定会让
            // iOS 15 在低 detent 下按窗口高度重写它的 frame。详情页使用自身的 inset 处理。
            bindToNativeSheet: false, constrainToNativeSheetViewport: true, 
            // 详情内容自身已经有 32px 的底部留白；TrueSheet 只负责安全区避让，
            // 不再叠加通用滚动容器的额外 24px。
            extraBottomPadding: 0, iosEmptyViewportScrollEnabled: Platform.OS === "ios" ? true : undefined, style: styles.detailBody, tracksNavigationBarScrollEdge: Platform.OS === "android" || Platform.OS === "web", children: page }));
    }
    return (_jsx(ScrollView, { automaticallyAdjustsScrollIndicatorInsets: Platform.OS === "ios" ? true : undefined, contentInsetAdjustmentBehavior: Platform.OS === "ios" ? "automatic" : undefined, iosEmptyViewportScrollEnabled: Platform.OS === "ios" ? true : undefined, nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: styles.detailBody, tracksNavigationBarScrollEdge: Platform.OS === "android" || Platform.OS === "web", children: page }));
}
const styles = StyleSheet.create({
    detailBody: { flex: 1, minHeight: 0 },
    root: { flex: 1, minHeight: 0 },
    routeHeader: { paddingHorizontal: 20, paddingTop: 8 },
    scrollContent: { gap: 16, padding: 16, paddingBottom: 32 },
});
