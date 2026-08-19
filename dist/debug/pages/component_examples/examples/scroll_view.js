import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { ScrollView, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const styles = StyleSheet.create({
    listFrame: { height: 320, minHeight: 0 },
    listItem: { borderRadius: 12, borderWidth: StyleSheet.hairlineWidth },
    listRow: {
        borderBottomColor: "rgba(128, 128, 128, 0.22)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        minHeight: 48,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    nativeListFrame: { height: 620, minHeight: 0 },
    scrollFrame: { height: 260, minHeight: 0 },
    scrollView: { flex: 1 },
});
export function ScrollViewExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u5D4C\u5957\u5BB9\u5668\u4FDD\u6301\u81EA\u5DF1\u7684\u6EDA\u52A8\u4F4D\u7F6E\uFF0C\u4E0D\u5F71\u54CD\u793A\u4F8B\u8BE6\u60C5\u9875\u3002", title: "\u72EC\u7ACB\u6EDA\u52A8\u533A\u57DF", children: _jsx(View, { style: styles.scrollFrame, children: _jsx(ScrollView, { nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: styles.scrollView, children: Array.from({ length: 20 }, (_, index) => (_jsx(View, { style: styles.listRow, children: _jsxs(Text, { children: ["ScrollView row ", index + 1] }) }, index))) }) }) }) }));
}
