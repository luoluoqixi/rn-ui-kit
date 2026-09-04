import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollView, Switch, Text } from "rn-ui-kit/core";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ExampleBlock, ExampleStack } from "../shared";
export function ScrollViewExample() {
    const [customScrollbar, setCustomScrollbar] = useState(false);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { title: "\u72EC\u7ACB\u6EDA\u52A8\u533A\u57DF", children: [_jsx(Switch, { checked: customScrollbar, label: "\u53EF\u62D6\u62FD\u6EDA\u52A8\u6761", onCheckedChange: setCustomScrollbar }), _jsx(View, { style: styles.scrollFrame, children: _jsx(ScrollView, { contentContainerStyle: styles.scrollContent, customScrollbar: customScrollbar, nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: styles.scrollView, children: Array.from({ length: 30 }, (_, index) => (_jsx(View, { style: styles.listRow, children: _jsxs(Text, { children: ["\u7B2C ", index + 1, " \u884C\u793A\u4F8B\u5185\u5BB9"] }) }, index))) }) })] }) }));
}
const styles = StyleSheet.create({
    listRow: {
        borderBottomColor: "rgba(128, 128, 128, 0.22)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        minHeight: 48,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    scrollContent: { paddingBottom: 16 },
    scrollFrame: { height: 260, minHeight: 0 },
    scrollView: { flex: 1 },
});
