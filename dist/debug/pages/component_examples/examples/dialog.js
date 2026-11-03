import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AlertDialog, Button, ContextMenu, Dialog, Dropdown, Input, NativeSheet, Popover, Select, Text, Tooltip, useToast, } from "rn-ui-kit/core";
import { View } from "react-native";
import { ExampleBlock, ExampleStack } from "../shared";
export function DialogExample() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState("组件实验室");
    const [saved, setSaved] = useState("尚未保存");
    const [sheetOpen, setSheetOpen] = useState(false);
    const [choice, setChoice] = useState("first");
    const options = [
        { label: "第一个选项", value: "first" },
        { label: "第二个选项", value: "second" },
    ];
    const menuItems = [
        ...options,
        { value: "more", label: "更多操作", subMenu: options },
    ];
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: `已保存名称：${saved}`, title: "\u7F16\u8F91\u5DE5\u4F5C\u533A", children: _jsx(Dialog, { actionLabel: "\u4FDD\u5B58", actionProps: {
                        onPress: () => {
                            setSaved(draft || "未命名工作区");
                            setOpen(false);
                        },
                    }, cancelLabel: "\u53D6\u6D88", content: () => (_jsxs(View, { className: "gap-3", children: [_jsx(Text, { children: "\u65B0\u540D\u79F0" }), _jsx(Input, { placeholder: "\u65B0\u540D\u79F0", onChangeText: setDraft, value: draft })] })), description: "\u793A\u4F8B description", onOpenChange: setOpen, open: open, title: "\u91CD\u547D\u540D\u5DE5\u4F5C\u533A", trigger: _jsx(Button, { children: "\u7F16\u8F91\u540D\u79F0" }) }) }), _jsx(ExampleBlock, { title: "Dialog \u5185\u7684\u5F39\u5C42", description: "\u68C0\u67E5\u9009\u9879\u3001\u83DC\u5355\u548C Sheet \u7684\u5C42\u7EA7\uFF0C\u4EE5\u53CA Escape\u3001\u5916\u90E8\u70B9\u51FB\u548C\u7126\u70B9\u8FD4\u56DE\u3002", children: _jsx(Dialog, { title: "\u5D4C\u5957\u5F39\u5C42", trigger: _jsx(Button, { children: "\u6253\u5F00\u5D4C\u5957\u5F39\u5C42" }), content: _jsxs(View, { className: "gap-3", children: [_jsx(Select, { native: false, items: options, value: choice, onValueChange: setChoice }), _jsx(Dropdown, { trigger: _jsx(Button, { variant: "outline", children: "\u6253\u5F00\u83DC\u5355" }), items: menuItems }), _jsx(ContextMenu, { items: menuItems, trigger: _jsx(Button, { variant: "outline", children: "\u53F3\u952E\u68C0\u67E5\u4E8C\u7EA7\u83DC\u5355" }) }), _jsx(Popover, { content: _jsx(Input, { placeholder: "Popover \u8F93\u5165\u7126\u70B9" }), children: _jsx(Button, { variant: "outline", children: "\u6253\u5F00 Popover" }) }), _jsx(Tooltip, { content: "Dialog \u5185 Tooltip", children: _jsx(Button, { variant: "outline", children: "\u60AC\u505C\u67E5\u770B\u63D0\u793A" }) }), _jsx(AlertDialog, { title: "Dialog \u5185\u7684\u786E\u8BA4", description: "\u53D6\u6D88\u540E\u5E94\u4FDD\u7559\u5916\u5C42 Dialog\u3002", actions: _jsx(Button, { onPress: () => toast.info("AlertDialog 内提示", { native: false }), children: "\u663E\u793A\u786E\u8BA4\u6846 Toast" }), trigger: _jsx(Button, { variant: "outline", children: "\u6253\u5F00\u5B50 AlertDialog" }), cancelLabel: "\u53D6\u6D88", actionLabel: "\u786E\u8BA4" }), _jsx(Button, { onPress: () => toast.info("Dialog 内提示", { native: false }), children: "\u663E\u793A Toast" }), _jsx(Button, { onPress: () => setSheetOpen(true), children: "\u6253\u5F00\u5B50 Sheet" }), _jsx(NativeSheet, { name: "dialog-child-sheet", open: sheetOpen, onOpenChange: setSheetOpen, snapPoints: ["60%"], children: _jsxs(View, { className: "gap-3 p-6", children: [_jsx(Text, { children: "Dialog \u4E2D\u7684 Sheet" }), _jsx(Button, { onPress: () => toast.success("Sheet 内提示", { native: false }), children: "\u663E\u793A Sheet Toast" }), _jsx(Input, { placeholder: "\u68C0\u67E5\u8F93\u5165\u7126\u70B9" }), _jsx(Select, { native: false, items: options, value: choice, onValueChange: setChoice }), _jsx(Dropdown, { trigger: _jsx(Button, { variant: "outline", children: "Sheet \u4E8C\u7EA7\u83DC\u5355" }), items: menuItems }), _jsx(Dialog, { title: "Sheet \u5185\u7684 Dialog", trigger: _jsx(Button, { variant: "outline", children: "\u6253\u5F00 Sheet \u5185 Dialog" }), content: _jsxs(View, { className: "gap-3", children: [_jsx(Input, { placeholder: "Sheet \u5185 Dialog \u8F93\u5165" }), _jsx(Select, { native: false, items: options, value: choice, onValueChange: setChoice }), _jsx(Popover, { content: _jsx(Input, { placeholder: "\u5D4C\u5957 Dialog \u7684 Popover \u8F93\u5165" }), children: _jsx(Button, { variant: "outline", children: "\u5185\u5C42 Popover" }) })] }), cancelLabel: "\u8FD4\u56DE Sheet" }), _jsx(AlertDialog, { title: "Sheet \u5185\u7684\u786E\u8BA4", description: "\u53D6\u6D88\u540E\u5E94\u4FDD\u7559 Sheet \u548C\u5916\u5C42 Dialog\u3002", trigger: _jsx(Button, { variant: "outline", children: "\u6253\u5F00 Sheet \u5185 AlertDialog" }), cancelLabel: "\u53D6\u6D88", actionLabel: "\u786E\u8BA4" }), _jsx(Button, { onPress: () => setSheetOpen(false), children: "\u5173\u95ED\u5B50 Sheet" })] }) })] }) }) })] }));
}
