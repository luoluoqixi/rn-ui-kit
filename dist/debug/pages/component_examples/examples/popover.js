import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input, Popover, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const styles = StyleSheet.create({
    dialogContent: { gap: 8 },
    nativeSheetHost: { left: 0, position: "absolute", top: 0 },
    popoverContent: { gap: 12, minWidth: 240, padding: 12 },
    sheetContent: { gap: 16, padding: 24 },
    sheetItem: {
        borderColor: "rgba(128, 128, 128, 0.28)",
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
});
export function PopoverExample() {
    const [name, setName] = useState("rn-ui-kit");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "Popover \u66F4\u9002\u5408\u951A\u5B9A\u5728\u89E6\u53D1\u5143\u7D20\u65C1\u7684\u5C0F\u8303\u56F4\u7F16\u8F91\u3002", title: `当前名称：${name}`, children: _jsx(Popover, { arrow: true, content: _jsxs(View, { style: styles.popoverContent, children: [_jsx(Text, { fontWeight: "600", children: "\u7F16\u8F91\u540D\u79F0" }), _jsx(Input, { onChangeText: setName, value: name })] }), trigger: _jsx(Button, { variant: "outlined", children: "\u6253\u5F00 Popover" }) }) }) }));
}
