import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { AlertDialog, Button, ContextMenu, Dialog, Input, Menu, NativeSheet, Popover, Sheet, Switch, Text, Tooltip, } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
function DialogExample() {
    const [open, setOpen] = useState(false);
    const [draftName, setDraftName] = useState("组件实验室");
    const [savedName, setSavedName] = useState("尚未保存");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `已保存名称：${savedName}`, title: "\u7F16\u8F91\u5DE5\u4F5C\u533A", children: _jsx(Dialog, { actions: _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setOpen(false), variant: "outlined", children: "\u53D6\u6D88" }), _jsx(Button, { onPress: () => {
                                setSavedName(draftName || "未命名工作区");
                                setOpen(false);
                            }, theme: "accent", children: "\u4FDD\u5B58" })] }), description: "\u53D7\u63A7 Dialog \u53EF\u627F\u8F7D\u4E00\u4E2A\u5C0F\u578B\u7F16\u8F91\u6D41\u7A0B\uFF0C\u5E76\u5728\u5173\u95ED\u524D\u63D0\u4EA4\u7ED3\u679C\u3002", onOpenChange: setOpen, open: open, title: "\u91CD\u547D\u540D\u5DE5\u4F5C\u533A", trigger: _jsx(Button, { onPress: () => setOpen(true), children: "\u7F16\u8F91\u540D\u79F0" }), children: _jsxs(View, { style: styles.dialogContent, children: [_jsx(Text, { opacity: 0.6, children: "\u65B0\u540D\u79F0" }), _jsx(Input, { onChangeText: setDraftName, value: draftName })] }) }) }) }));
}
function AlertDialogExample() {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState("尚未操作");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `最近结果：${result}`, title: "\u5371\u9669\u64CD\u4F5C\u786E\u8BA4", children: _jsx(AlertDialog, { cancelLabel: "\u53D6\u6D88", contentProps: { style: { width: "90%", maxWidth: 420 } }, destructiveLabel: "\u5220\u9664", description: "\u5148\u5728\u5F39\u7A97\u4E2D\u505A\u6700\u540E\u786E\u8BA4\uFF1B\u6B64\u64CD\u4F5C\u4EC5\u7528\u4E8E\u6F14\u793A\uFF0C\u4E0D\u4F1A\u5220\u9664\u771F\u5B9E\u6570\u636E\u3002", onOpenChange: setOpen, open: open, title: "\u5220\u9664 3 \u4E2A\u8349\u7A3F\uFF1F", trigger: _jsx(Button, { onPress: () => setOpen(true), children: "\u6253\u5F00 AlertDialog" }), actions: _jsx(Button, { onPress: () => {
                        setResult("确认删除");
                        setOpen(false);
                    }, theme: "red", children: "\u81EA\u5B9A\u4E49\u52A8\u4F5C" }) }) }) }));
}
function ContextMenuExample() {
    const [action, setAction] = useState("尚未选择");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u5728\u684C\u9762\u7AEF\u53F3\u952E\u3001\u5728\u89E6\u63A7\u8BBE\u5907\u957F\u6309\uFF0C\u5747\u4F1A\u6253\u5F00\u540C\u4E00\u7EC4\u64CD\u4F5C\u3002", title: "\u6587\u4EF6\u64CD\u4F5C", children: [_jsx(ContextMenu, { arrow: true, items: [
                        { label: "重命名", onSelect: () => setAction("重命名"), value: "rename" },
                        { label: "复制链接", onSelect: () => setAction("复制链接"), value: "copy-link" },
                        { label: "separator", separator: true, value: "separator" },
                        {
                            destructive: true,
                            label: "删除",
                            onSelect: () => setAction("删除"),
                            value: "delete",
                        },
                    ], trigger: _jsx(Button, { variant: "outlined", children: "\u53F3\u952E\u6216\u957F\u6309" }) }), _jsxs(Text, { opacity: 0.6, children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] }) }));
}
function MenuExample() {
    const [action, setAction] = useState("尚未选择");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "Menu \u9002\u5408\u7531\u666E\u901A\u6309\u94AE\u89E6\u53D1\u7684\u4E00\u7EC4\u8F7B\u91CF\u64CD\u4F5C\u3002", title: "\u9879\u76EE\u83DC\u5355", children: [_jsx(Menu, { arrow: true, items: [
                        { label: "新建文件", onSelect: () => setAction("新建文件"), value: "new" },
                        { label: "打开设置", onSelect: () => setAction("打开设置"), value: "settings" },
                        { label: "导出快照", onSelect: () => setAction("导出快照"), value: "export" },
                        { label: "separator", separator: true, value: "separator" },
                        {
                            destructive: true,
                            label: "清空记录",
                            onSelect: () => setAction("清空记录"),
                            value: "clear",
                        },
                    ], trigger: _jsx(Button, { variant: "outlined", children: "\u6253\u5F00 Menu" }) }), _jsxs(Text, { opacity: 0.6, children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] }) }));
}
function PopoverExample() {
    const [name, setName] = useState("rn-ui-kit");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "Popover \u66F4\u9002\u5408\u951A\u5B9A\u5728\u89E6\u53D1\u5143\u7D20\u65C1\u7684\u5C0F\u8303\u56F4\u7F16\u8F91\u3002", title: `当前名称：${name}`, children: _jsx(Popover, { arrow: true, content: _jsxs(View, { style: styles.popoverContent, children: [_jsx(Text, { fontWeight: "600", children: "\u7F16\u8F91\u540D\u79F0" }), _jsx(Input, { onChangeText: setName, value: name })] }), trigger: _jsx(Button, { variant: "outlined", children: "\u6253\u5F00 Popover" }) }) }) }));
}
function ExampleModalSheet({ content, native, onOpenChange, onPositionChange, open, position, snapPoints, snapPointsMode, }) {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    if (native) {
        return (_jsx(View, { pointerEvents: "box-none", style: [styles.nativeSheetHost, { height: windowHeight, width: windowWidth }], children: _jsx(NativeSheet, { content: content, handle: true, modal: true, onOpenChange: onOpenChange, onPositionChange: onPositionChange, open: open, overlay: true, position: position, snapPoints: snapPoints, snapPointsMode: snapPointsMode }) }));
    }
    return (_jsx(Sheet, { content: content, dismissOnSnapToBottom: true, handle: true, modal: true, onOpenChange: onOpenChange, onPositionChange: onPositionChange, open: open, overlay: true, position: position, snapPoints: snapPoints, snapPointsMode: snapPointsMode, transition: "200ms" }));
}
function SheetContent({ children, description, onClose, title, }) {
    return (_jsxs(View, { style: styles.sheetContent, children: [_jsx(Text, { fontSize: "$6", fontWeight: "700", children: title }), _jsx(Text, { opacity: 0.6, children: description }), children, _jsx(Button, { onPress: onClose, theme: "accent", children: "\u5173\u95ED Sheet" })] }));
}
function SheetExample() {
    const [native, setNative] = useState(true);
    const [inlineOpen, setInlineOpen] = useState(false);
    const [inlinePosition, setInlinePosition] = useState(0);
    const [percentOpen, setPercentOpen] = useState(false);
    const [percentPosition, setPercentPosition] = useState(0);
    const [constantOpen, setConstantOpen] = useState(false);
    const [constantPosition, setConstantPosition] = useState(0);
    const [fitOpen, setFitOpen] = useState(false);
    const [fitPosition, setFitPosition] = useState(0);
    const [mixedOpen, setMixedOpen] = useState(false);
    const [mixedPosition, setMixedPosition] = useState(0);
    const [nestedOpen, setNestedOpen] = useState(false);
    const [nestedPosition, setNestedPosition] = useState(0);
    const sheetItems = ["最近工作区", "主题与外观", "同步状态", "导出设置"];
    const openSheet = (setOpen, setPosition) => {
        setPosition(0);
        setOpen(true);
    };
    const renderItems = () => sheetItems.map((item) => (_jsx(View, { style: styles.sheetItem, children: _jsx(Text, { children: item }) }, item)));
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u9664\u57FA\u7840 Sheet \u5916\uFF0C\u8FD9\u91CC\u8986\u76D6 percent\u3001constant\u3001fit\u3001mixed \u548C\u5D4C\u5957\u6D6E\u5C42\u3002", title: "\u591A\u79CD Sheet \u5F62\u5F0F", children: [_jsx(Switch, { checked: native, label: "\u4F7F\u7528 NativeSheet", labelPosition: "end", onCheckedChange: setNative }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => openSheet(setInlineOpen, setInlinePosition), variant: "outlined", children: "Inline percent" }), _jsx(Button, { onPress: () => openSheet(setPercentOpen, setPercentPosition), variant: "outlined", children: "\u5168\u5C40 percent" }), _jsx(Button, { onPress: () => openSheet(setConstantOpen, setConstantPosition), variant: "outlined", children: "constant" }), _jsx(Button, { onPress: () => openSheet(setFitOpen, setFitPosition), variant: "outlined", children: "fit" }), _jsx(Button, { onPress: () => openSheet(setMixedOpen, setMixedPosition), variant: "outlined", children: "mixed" })] }), _jsxs(Text, { opacity: 0.6, children: ["inline\uFF1A", inlineOpen ? `打开，position=${inlinePosition}` : "关闭", " \u00B7 percent\uFF1A", percentOpen ? `打开，position=${percentPosition}` : "关闭"] }), _jsxs(Text, { opacity: 0.6, children: ["constant\uFF1A", constantOpen ? `打开，position=${constantPosition}` : "关闭", " \u00B7 fit\uFF1A", fitOpen ? `打开，position=${fitPosition}` : "关闭", " \u00B7 mixed\uFF1A", mixedOpen ? `打开，position=${mixedPosition}` : "关闭"] }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setInlineOpen, open: inlineOpen, children: _jsx(Sheet, { content: _jsxs(SheetContent, { description: "\u975E modal \u7684 inline Sheet \u4F7F\u7528 percent snap points\uFF0C\u5E76\u53EF\u5728\u5F53\u524D\u9875\u9762\u5185\u62D6\u62FD\u3002", onClose: () => setInlineOpen(false), title: "Inline Sheet", children: [renderItems(), _jsx(Button, { onPress: () => setInlinePosition(1), variant: "outlined", children: "\u5207\u5230\u7B2C\u4E8C\u6863" })] }), dismissOnSnapToBottom: true, handle: true, modal: false, onOpenChange: setInlineOpen, onPositionChange: setInlinePosition, open: inlineOpen, overlay: true, position: inlinePosition, snapPoints: ["76%", "56%"], snapPointsMode: "percent", transition: "medium" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setPercentOpen, open: percentOpen, children: _jsx(ExampleModalSheet, { content: _jsxs(SheetContent, { description: "modal \u5168\u5C40 Sheet\uFF0C\u767E\u5206\u6BD4\u6863\u4F4D\u53EF\u9002\u914D\u4E0D\u540C\u5C4F\u5E55\u9AD8\u5EA6\u3002", onClose: () => setPercentOpen(false), title: "\u5168\u5C40 Sheet \u00B7 percent", children: [renderItems(), _jsx(Button, { onPress: () => openSheet(setNestedOpen, setNestedPosition), variant: "outlined", children: "\u6253\u5F00\u5185\u5C42 Sheet" }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setNestedOpen, open: nestedOpen, children: _jsx(ExampleModalSheet, { content: _jsx(SheetContent, { description: "\u5728\u5916\u5C42 Sheet \u4E2D\u7EE7\u7EED\u6253\u5F00 modal Sheet\uFF0C\u9002\u5408\u4E8C\u6B21\u786E\u8BA4\u6216\u8865\u5145\u914D\u7F6E\u3002", onClose: () => setNestedOpen(false), title: "\u5185\u5C42 Sheet", children: renderItems() }), native: native, onOpenChange: setNestedOpen, onPositionChange: setNestedPosition, open: nestedOpen, position: nestedPosition, snapPoints: ["72%", "88%"], snapPointsMode: "percent" }) })] }), native: native, onOpenChange: (nextOpen) => {
                            setPercentOpen(nextOpen);
                            if (!nextOpen)
                                setNestedOpen(false);
                        }, onPositionChange: setPercentPosition, open: percentOpen, position: percentPosition, snapPoints: ["62%", "90%"], snapPointsMode: "percent" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setConstantOpen, open: constantOpen, children: _jsx(ExampleModalSheet, { content: _jsx(SheetContent, { description: "constant \u4EE5\u56FA\u5B9A\u50CF\u7D20\u9AD8\u5EA6\u5B9A\u4E49\u6863\u4F4D\uFF0C\u9002\u5408\u5185\u5BB9\u5C3A\u5BF8\u660E\u786E\u7684\u64CD\u4F5C\u9762\u677F\u3002", onClose: () => setConstantOpen(false), title: "\u5168\u5C40 Sheet \u00B7 constant", children: renderItems() }), native: native, onOpenChange: setConstantOpen, onPositionChange: setConstantPosition, open: constantOpen, position: constantPosition, snapPoints: [360, 560], snapPointsMode: "constant" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setFitOpen, open: fitOpen, children: _jsx(ExampleModalSheet, { content: _jsx(SheetContent, { description: "fit \u6839\u636E\u5185\u5BB9\u9AD8\u5EA6\u8BA1\u7B97\u9762\u677F\u5C3A\u5BF8\uFF0C\u9002\u5408\u5185\u5BB9\u8F83\u77ED\u4E14\u4E0D\u9700\u8981\u56FA\u5B9A\u6863\u4F4D\u7684\u573A\u666F\u3002", onClose: () => setFitOpen(false), title: "\u5168\u5C40 Sheet \u00B7 fit", children: renderItems() }), native: native, onOpenChange: setFitOpen, onPositionChange: setFitPosition, open: fitOpen, position: fitPosition, snapPointsMode: "fit" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setMixedOpen, open: mixedOpen, children: _jsx(ExampleModalSheet, { content: _jsx(SheetContent, { description: "mixed \u53EF\u7EC4\u5408 fit \u548C\u767E\u5206\u6BD4\u6863\u4F4D\uFF0C\u517C\u987E\u5185\u5BB9\u9AD8\u5EA6\u4E0E\u66F4\u5927\u53EF\u5C55\u5F00\u7A7A\u95F4\u3002", onClose: () => setMixedOpen(false), title: "\u5168\u5C40 Sheet \u00B7 mixed", children: renderItems() }), native: native, onOpenChange: setMixedOpen, onPositionChange: setMixedPosition, open: mixedOpen, position: mixedPosition, snapPoints: ["fit", "80%"], snapPointsMode: "mixed" }) })] }) }));
}
function TooltipExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "Web \u60AC\u505C\u663E\u793A\uFF1BNative \u4E3B\u8981\u63D0\u4F9B\u53EF\u8BBF\u95EE\u6027\u8BED\u4E49\u3002", title: "\u8865\u5145\u8BF4\u660E", children: _jsxs(ExampleRow, { children: [_jsx(Tooltip, { arrow: true, content: "\u8FD9\u4F1A\u628A\u5F53\u524D\u7248\u672C\u53D1\u5E03\u5230\u9884\u89C8\u73AF\u5883\u3002", children: _jsx(Button, { variant: "outlined", children: "\u53D1\u5E03\u8BF4\u660E" }) }), _jsx(Tooltip, { arrow: true, content: "\u5220\u9664\u540E\u5C06\u65E0\u6CD5\u6062\u590D\u3002", children: _jsx(Button, { theme: "red", children: "\u5371\u9669\u64CD\u4F5C" }) })] }) }) }));
}
export const overlayExamples = [
    {
        Component: DialogExample,
        group: "浮层与菜单",
        key: "dialog",
        label: "Dialog",
    },
    {
        Component: AlertDialogExample,
        group: "浮层与菜单",
        key: "alert-dialog",
        label: "AlertDialog",
    },
    {
        Component: ContextMenuExample,
        group: "浮层与菜单",
        key: "context-menu",
        label: "ContextMenu",
    },
    {
        Component: MenuExample,
        group: "浮层与菜单",
        key: "menu",
        label: "Menu",
    },
    {
        Component: PopoverExample,
        group: "浮层与菜单",
        key: "popover",
        label: "Popover",
    },
    {
        Component: SheetExample,
        group: "浮层与菜单",
        key: "sheet",
        label: "Sheet",
    },
    {
        Component: TooltipExample,
        group: "浮层与菜单",
        key: "tooltip",
        label: "Tooltip",
    },
];
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
