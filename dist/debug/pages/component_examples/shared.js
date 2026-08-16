import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { Text } from "rn-ui-kit/core";
export function ExampleStack({ children }) {
    return _jsx(View, { style: styles.stack, children: children });
}
export function ExampleBlock({ children, description, title, }) {
    return (_jsxs(View, { style: styles.block, children: [title != null ? (_jsx(Text, { fontSize: "$5", fontWeight: "600", children: title })) : null, description != null ? _jsx(Text, { opacity: 0.6, children: description }) : null, _jsx(View, { style: styles.blockContent, children: children })] }));
}
export function ExampleRow({ children }) {
    return _jsx(View, { style: styles.row, children: children });
}
const styles = StyleSheet.create({
    block: {
        borderColor: "rgba(128, 128, 128, 0.28)",
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 6,
        padding: 16,
    },
    blockContent: { gap: 12, paddingTop: 6 },
    row: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 12 },
    stack: { gap: 16, width: "100%" },
});
