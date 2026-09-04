import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeList, NativeListItem, NativeListSection, useAppBackgroundColors, } from "../../../core/components/ui";
import debugPackage from "../../../../package.json";
const GITHUB_URL = "https://github.com/luoluoqixi/rn-ui-kit";
const platformNames = { android: "Android", ios: "iOS", web: "Web" };
export function RnUiKitAboutDebugPage() {
    const usesNativeIosScrollEdgeHeader = Platform.OS === "ios";
    const appBackgroundColors = useAppBackgroundColors();
    const insets = useSafeAreaInsets();
    const tracksScrollEdgeHeader = Platform.OS === "android" || Platform.OS === "web" || usesNativeIosScrollEdgeHeader;
    const horizontalContentInset = Platform.OS === "ios" ? undefined : { paddingLeft: insets.left, paddingRight: insets.right };
    return (_jsx(View, { style: styles.nativeListHost, children: _jsxs(NativeList, { backgroundColor: appBackgroundColors.screen, automaticallyAdjustsScrollIndicatorInsets: usesNativeIosScrollEdgeHeader ? true : undefined, contentInsetAdjustmentBehavior: usesNativeIosScrollEdgeHeader ? "automatic" : undefined, contentContainerStyle: horizontalContentInset, tracksNavigationBarScrollEdge: tracksScrollEdgeHeader, children: [_jsxs(NativeListSection, { title: "\u5173\u4E8E", children: [_jsx(NativeListItem, { title: "UI", value: "rn-ui-kit" }), _jsx(NativeListItem, { title: "\u7248\u672C", value: debugPackage.version }), _jsx(NativeListItem, { chevron: true, onPress: () => void Linking.openURL(GITHUB_URL), title: "Github", value: GITHUB_URL })] }), _jsxs(NativeListSection, { title: "\u8FD0\u884C\u73AF\u5883", children: [_jsx(NativeListItem, { title: "\u5E73\u53F0", value: platformNames[Platform.OS] ?? Platform.OS }), _jsx(NativeListItem, { title: "\u5E73\u53F0\u7248\u672C", value: String(Platform.Version) }), _jsx(NativeListItem, { title: "\u6784\u5EFA\u6A21\u5F0F", value: __DEV__ ? "开发" : "生产" })] })] }) }));
}
const styles = StyleSheet.create({ nativeListHost: { flex: 1, minHeight: 0 } });
