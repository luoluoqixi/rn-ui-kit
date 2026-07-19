import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { NativeList, NativeListItem, NativeListSection, isIos26Plus } from "rn-ui-kit/core";
import debugPackage from "../../../../package.json";
const GITHUB_URL = "https://github.com/luoluoqixi/rn-ui-kit";
const platformNames = {
    android: "Android",
    ios: "iOS",
    web: "Web",
};
export function RnUiKitAboutDebugPage() {
    const usesPreIos26ScrollEdgeHeader = Platform.OS === "ios" && !isIos26Plus();
    return (_jsx(View, { style: styles.nativeListHost, children: _jsxs(NativeList, { automaticallyAdjustsScrollIndicatorInsets: usesPreIos26ScrollEdgeHeader ? true : undefined, contentInsetAdjustmentBehavior: usesPreIos26ScrollEdgeHeader ? "automatic" : undefined, tracksNavigationBarScrollEdge: usesPreIos26ScrollEdgeHeader, children: [_jsxs(NativeListSection, { title: "\u5173\u4E8E", children: [_jsx(NativeListItem, { title: "UI", value: "rn-ui-kit" }), _jsx(NativeListItem, { title: "\u7248\u672C", value: debugPackage.version }), _jsx(NativeListItem, { onPress: () => void Linking.openURL(GITHUB_URL), title: "Github", value: GITHUB_URL, chevron: true })] }), _jsxs(NativeListSection, { title: "\u8FD0\u884C\u73AF\u5883", children: [_jsx(NativeListItem, { title: "\u5E73\u53F0", value: platformNames[Platform.OS] ?? Platform.OS }), _jsx(NativeListItem, { title: "\u5E73\u53F0\u7248\u672C", value: String(Platform.Version) }), _jsx(NativeListItem, { title: "\u6784\u5EFA\u6A21\u5F0F", value: __DEV__ ? "开发" : "生产" })] })] }) }));
}
const styles = StyleSheet.create({
    nativeListHost: { flex: 1, minHeight: 0 },
});
