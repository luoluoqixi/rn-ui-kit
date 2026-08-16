import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Input, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
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
export function DialogExample() {
    const [open, setOpen] = useState(false);
    const [draftName, setDraftName] = useState("组件实验室");
    const [savedName, setSavedName] = useState("尚未保存");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `已保存名称：${savedName}`, title: "\u7F16\u8F91\u5DE5\u4F5C\u533A", children: _jsx(Dialog, { actions: _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setOpen(false), variant: "outlined", children: "\u53D6\u6D88" }), _jsx(Button, { onPress: () => {
                                setSavedName(draftName || "未命名工作区");
                                setOpen(false);
                            }, theme: "accent", children: "\u4FDD\u5B58" })] }), description: "\u53D7\u63A7 Dialog \u53EF\u627F\u8F7D\u4E00\u4E2A\u5C0F\u578B\u7F16\u8F91\u6D41\u7A0B\uFF0C\u5E76\u5728\u5173\u95ED\u524D\u63D0\u4EA4\u7ED3\u679C\u3002", onOpenChange: setOpen, open: open, title: "\u91CD\u547D\u540D\u5DE5\u4F5C\u533A", trigger: _jsx(Button, { onPress: () => setOpen(true), children: "\u7F16\u8F91\u540D\u79F0" }), children: _jsxs(View, { style: styles.dialogContent, children: [_jsx(Text, { opacity: 0.6, children: "\u65B0\u540D\u79F0" }), _jsx(Input, { onChangeText: setDraftName, value: draftName })] }) }) }) }));
}
