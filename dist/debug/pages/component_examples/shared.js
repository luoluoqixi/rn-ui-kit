import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { Card, Input, NativeList, NativeListNavigationItem, NativeListSection, Text, Textarea, } from "../../../core/components/ui";
export function ComponentExamplePlaceholder({ children, name, status = "迁移占位", }) {
    return (_jsxs(View, { className: "gap-4 p-4", children: [_jsxs(Text, { variant: "muted", children: [name, " \u793A\u4F8B\uFF1A", status] }), _jsx(Card, { content: children ?? _jsx(Text, { children: "\u6B64\u793A\u4F8B\u4FDD\u7559\u72EC\u7ACB\u6587\u4EF6\u548C\u8DEF\u7531\uFF0C\u5177\u4F53\u4EA4\u4E92\u5C06\u5728\u540E\u7EED\u8FC1\u79FB\u9636\u6BB5\u8865\u9F50\u3002" }), contentProps: { className: "gap-3" }, header: _jsx(Card.Title, { children: name }) })] }));
}
export function InputExampleContent() {
    return (_jsxs(_Fragment, { children: [_jsx(Input, { placeholder: "Input" }), _jsx(Textarea, { placeholder: "TextArea" })] }));
}
export function NativeListExampleContent() {
    return (_jsx(NativeList, { children: _jsx(NativeListSection, { title: "NativeList", children: _jsx(NativeListNavigationItem, { title: "Navigation item", subtitle: "NativeList remains available." }) }) }));
}
export function ExampleStack({ children }) {
    return _jsx(View, { style: styles.stack, children: children });
}
export function ExampleBlock({ children, description, title, }) {
    return (_jsx(Card, { contentProps: { className: "gap-3" }, description: description, content: children, title: title }));
}
export function ExampleRow({ children, style, }) {
    return _jsx(View, { style: [styles.row, style], children: children });
}
const styles = StyleSheet.create({
    row: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 12 },
    stack: { gap: 16, width: "100%" },
});
