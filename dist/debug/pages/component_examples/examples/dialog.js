import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Dialog, Input, Text } from "rn-ui-kit/core";
import { View } from "react-native";
import { ExampleBlock, ExampleStack } from "../shared";
export function DialogExample() {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState("组件实验室");
    const [saved, setSaved] = useState("尚未保存");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `已保存名称：${saved}`, title: "\u7F16\u8F91\u5DE5\u4F5C\u533A", children: _jsx(Dialog, { actionLabel: "\u4FDD\u5B58", actionProps: {
                    onPress: () => {
                        setSaved(draft || "未命名工作区");
                        setOpen(false);
                    },
                }, cancelLabel: "\u53D6\u6D88", content: () => (_jsxs(View, { className: "gap-3", children: [_jsx(Text, { children: "\u65B0\u540D\u79F0" }), _jsx(Input, { placeholder: "\u65B0\u540D\u79F0", onChangeText: setDraft, value: draft })] })), description: "\u793A\u4F8B description", onOpenChange: setOpen, open: open, title: "\u91CD\u547D\u540D\u5DE5\u4F5C\u533A", trigger: _jsx(Button, { children: "\u7F16\u8F91\u540D\u79F0" }) }) }) }));
}
