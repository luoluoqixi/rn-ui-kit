import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ListItem, Text } from "rn-ui-kit/core";
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
export function ListItemExample() {
    const [pressed, setPressed] = useState(0);
    const [archived, setArchived] = useState(false);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u72EC\u7ACB ListItem \u53EF\u4EE5\u8131\u79BB ListGroup \u7528\u4E8E\u5C40\u90E8\u7684\u53EF\u70B9\u51FB\u4FE1\u606F\u5361\u3002", title: "\u5355\u6761\u8BB0\u5F55", children: [_jsx(ListItem, { onPress: () => setPressed((current) => current + 1), style: styles.listItem, subTitle: "ListItem \u53EF\u4EE5\u72EC\u7ACB\u4F7F\u7528", title: "\u5355\u4E2A\u5217\u8868\u9879" }), _jsx(ListItem, { onPress: () => setArchived((current) => !current), style: styles.listItem, subTitle: archived ? "已归档，点击恢复" : "点击后归档该条记录", title: archived ? "归档记录" : "当前记录" }), _jsxs(Text, { opacity: 0.6, children: ["\u5DF2\u70B9\u51FB ", pressed, " \u6B21"] })] }) }));
}
