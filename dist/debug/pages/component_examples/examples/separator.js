import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { Separator, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const styles = StyleSheet.create({
    avatarRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 16 },
    imageHost: { alignSelf: "center", width: "100%" },
    verticalSeparatorRow: { alignItems: "center", flexDirection: "row", gap: 12, height: 40 },
});
export function SeparatorExample() {
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u6C34\u5E73\u5206\u9694\u5185\u5BB9\u533A\u5757\uFF0C\u5782\u76F4\u5206\u9694\u5E76\u5217\u4FE1\u606F\u3002", title: "\u5185\u5BB9\u5C42\u7EA7", children: [_jsx(Text, { children: "\u4E0A\u65B9\u5185\u5BB9" }), _jsx(Separator, {}), _jsx(Text, { children: "\u4E0B\u65B9\u5185\u5BB9" }), _jsxs(View, { style: styles.verticalSeparatorRow, children: [_jsx(Text, { children: "\u5DE6\u4FA7" }), _jsx(Separator, { height: 24, vertical: true }), _jsx(Text, { children: "\u53F3\u4FA7" })] })] }) }));
}
