import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Checkbox, Progress, Slider, Spinner, Switch, Text, ToggleGroup, confirmNative, useToast, } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
function ButtonExample() {
    const [count, setCount] = useState(0);
    const [saving, setSaving] = useState(false);
    const save = () => {
        setSaving(true);
        setTimeout(() => {
            setCount((current) => current + 1);
            setSaving(false);
        }, 700);
    };
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { description: "\u628A\u6309\u94AE\u53D8\u4F53\u653E\u8FDB\u4E00\u4E2A\u6709\u660E\u786E\u72B6\u6001\u7684\u4FDD\u5B58\u64CD\u4F5C\u4E2D\u3002", title: "\u4FDD\u5B58\u5DE5\u4F5C\u533A", children: [_jsxs(ExampleRow, { children: [_jsx(Button, { disabled: saving, onPress: save, theme: "accent", children: saving ? "正在保存…" : "保存更改" }), _jsx(Button, { disabled: saving, onPress: () => setCount(0), variant: "outlined", children: "\u91CD\u7F6E\u8BA1\u6570" }), _jsx(Button, { chromeless: true, onPress: () => setCount((current) => current + 1), children: "\u4EC5\u66F4\u65B0" })] }), _jsxs(Text, { opacity: 0.6, children: ["\u5DF2\u5B8C\u6210 ", count, " \u6B21\u4FDD\u5B58\uFF1B\u63D0\u4EA4\u671F\u95F4\u5176\u4ED6\u64CD\u4F5C\u4F1A\u88AB\u7981\u7528\u3002"] })] }), _jsx(ExampleBlock, { description: "\u540C\u4E00 API \u7684\u8BED\u4E49\u8272\u3001\u8F6E\u5ED3\u4E0E\u7981\u7528\u72B6\u6001\u3002", title: "\u64CD\u4F5C\u5C42\u7EA7", children: _jsxs(ExampleRow, { children: [_jsx(Button, { theme: "green", children: "\u786E\u8BA4" }), _jsx(Button, { theme: "red", children: "\u5220\u9664" }), _jsx(Button, { variant: "outlined", children: "\u6B21\u8981\u64CD\u4F5C" }), _jsx(Button, { disabled: true, children: "\u4E0D\u53EF\u7528" }), _jsx(Button, { native: true, children: "Native" })] }) })] }));
}
function CheckboxExample() {
    const [permissions, setPermissions] = useState({ analytics: true, updates: false, weekly: true });
    const selectedCount = Object.values(permissions).filter(Boolean).length;
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: `已启用 ${selectedCount}/3 项通知`, title: "\u901A\u77E5\u504F\u597D", children: [_jsx(Checkbox, { checked: permissions.updates, label: "\u4EA7\u54C1\u66F4\u65B0", onCheckedChange: (updates) => setPermissions((current) => ({ ...current, updates: updates === true })) }), _jsx(Checkbox, { checked: permissions.weekly, label: "\u6BCF\u5468\u6458\u8981", onCheckedChange: (weekly) => setPermissions((current) => ({ ...current, weekly: weekly === true })) }), _jsx(Checkbox, { checked: permissions.analytics, label: "\u533F\u540D\u4F7F\u7528\u5206\u6790", onCheckedChange: (analytics) => setPermissions((current) => ({ ...current, analytics: analytics === true })) })] }) }));
}
function SwitchExample() {
    const [syncEnabled, setSyncEnabled] = useState(true);
    const [wifiOnly, setWifiOnly] = useState(false);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u5F00\u5173\u9002\u5408\u5373\u65F6\u751F\u6548\u7684\u72EC\u7ACB\u504F\u597D\u3002", title: "\u540C\u6B65\u8BBE\u7F6E", children: [_jsx(Switch, { checked: syncEnabled, label: "\u81EA\u52A8\u540C\u6B65", labelPosition: "end", onCheckedChange: setSyncEnabled }), _jsx(Switch, { checked: wifiOnly, disabled: !syncEnabled, label: "\u4EC5 Wi-Fi \u540C\u6B65", labelPosition: "end", onCheckedChange: setWifiOnly }), _jsx(Switch, { checked: wifiOnly, disabled: !syncEnabled, label: "\u4EC5 Wi-Fi \u540C\u6B65\uFF08native=false\uFF09", labelPosition: "end", onCheckedChange: setWifiOnly, native: false })] }) }));
}
function ToggleGroupExample() {
    const [mode, setMode] = useState("preview");
    const [format, setFormat] = useState(["bold"]);
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: `当前视图：${mode}`, title: "\u5355\u9009\u6A21\u5F0F", children: _jsx(ToggleGroup, { items: [
                        { label: "编辑", value: "edit" },
                        { label: "预览", value: "preview" },
                        { label: "源码", value: "source" },
                    ], onValueChange: setMode, type: "single", value: mode }) }), _jsx(ExampleBlock, { description: `已启用：${format.join("、") || "无"}`, title: "\u591A\u9009\u683C\u5F0F", children: _jsx(ToggleGroup, { items: [
                        { label: "粗体", value: "bold" },
                        { label: "斜体", value: "italic" },
                    ], onValueChange: setFormat, type: "multiple", value: format }) })] }));
}
function SliderExample() {
    const [value, setValue] = useState(42);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: `字号：${value}px`, title: "\u53EF\u62D6\u62FD\u6570\u503C", children: [_jsx(Slider, { max: 72, min: 12, onValueChange: (next) => setValue(next[0] ?? 12), step: 1, value: [value] }), _jsx(Slider, { style: {
                        marginVertical: 15,
                    }, native: false, max: 72, min: 12, onValueChange: (next) => setValue(next[0] ?? 12), step: 1, value: [value] }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setValue(12), size: "$3", variant: "outlined", children: "\u6700\u5C0F" }), _jsx(Button, { onPress: () => setValue(42), size: "$3", variant: "outlined", children: "\u9ED8\u8BA4" }), _jsx(Button, { onPress: () => setValue(72), size: "$3", variant: "outlined", children: "\u6700\u5927" })] })] }) }));
}
function SpinnerExample() {
    const [visible, setVisible] = useState(true);
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u53EF\u5728\u52A0\u8F7D\u5360\u4F4D\u548C\u64CD\u4F5C\u6309\u94AE\u4E4B\u95F4\u5207\u6362\u3002", title: "\u52A0\u8F7D\u4E2D\u72B6\u6001", children: _jsxs(ExampleRow, { children: [visible ? _jsx(Spinner, { size: "large" }) : _jsx(Text, { children: "\u52A0\u8F7D\u5DF2\u6682\u505C" }), _jsx(Button, { onPress: () => setVisible((current) => !current), variant: "outlined", children: visible ? "停止加载" : "开始加载" })] }) }) }));
}
function ProgressExample() {
    const [value, setValue] = useState(35);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: `文件上传：${value}%`, title: "\u53D7\u63A7\u8FDB\u5EA6", children: [_jsx(Progress, { max: 100, value: value, width: "100%" }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setValue((current) => Math.max(0, current - 10)), size: "$3", variant: "outlined", children: "-10" }), _jsx(Button, { onPress: () => setValue((current) => Math.min(100, current + 10)), size: "$3", variant: "outlined", children: "+10" }), _jsx(Button, { onPress: () => setValue(100), size: "$3", theme: "green", children: "\u5B8C\u6210" })] })] }) }));
}
function ToastExample() {
    const { toast } = useToast();
    const [isNative, setIsNative] = useState(true);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u6DB5\u76D6\u666E\u901A\u7ED3\u679C\u3001\u6301\u7EED\u52A0\u8F7D\u4E0E\u5F02\u6B65\u4EFB\u52A1\u72B6\u6001\u3002", title: "\u5168\u5C40\u53CD\u9988", children: [_jsx(ExampleRow, { children: _jsx(Switch, { checked: isNative, onCheckedChange: setIsNative, label: "\u4F7F\u7528 Native Toast" }) }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => toast.success("保存成功", { description: "工作区配置已写入本地。", native: isNative }), theme: "green", children: "\u6210\u529F" }), _jsx(Button, { onPress: () => toast.warning("空间不足", { description: "建议先清理附件缓存。", native: isNative }), variant: "outlined", children: "\u8B66\u544A" }), _jsx(Button, { onPress: () => toast.error("同步失败", { description: "请检查网络连接。", native: isNative }), theme: "red", children: "\u5931\u8D25" })] }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => {
                                const id = toast.loading("正在刷新索引", {
                                    duration: Number.POSITIVE_INFINITY,
                                    native: isNative,
                                });
                                setTimeout(() => {
                                    toast.close(id);
                                    toast.success("索引已刷新", {
                                        native: isNative,
                                    });
                                }, 900);
                            }, variant: "outlined", children: "\u52A0\u8F7D\u540E\u5B8C\u6210" }), _jsx(Button, { onPress: () => toast.closeAll(), variant: "outlined", children: "\u5173\u95ED\u5168\u90E8" })] })] }) }));
}
function NativeDialogExample() {
    const [result, setResult] = useState("尚未打开");
    const openDialog = async () => {
        const next = await confirmNative({
            buttons: [
                { key: "cancel", style: "cancel", text: "取消" },
                { key: "archive", text: "归档" },
                { key: "delete", style: "destructive", text: "删除" },
            ],
            message: "这是平台原生确认弹窗，适合少量且明确的选择。",
            title: "处理当前草稿",
        });
        setResult(String(next));
    };
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `最近结果：${result}`, title: "\u591A\u6309\u94AE\u786E\u8BA4", children: _jsx(Button, { onPress: () => void openDialog(), children: "\u6253\u5F00\u539F\u751F\u5F39\u7A97" }) }) }));
}
export const actionFeedbackExamples = [
    {
        Component: ButtonExample,
        group: "动作与反馈",
        key: "button",
        label: "Button",
    },
    {
        Component: CheckboxExample,
        group: "动作与反馈",
        key: "checkbox",
        label: "Checkbox",
    },
    {
        Component: SwitchExample,
        group: "动作与反馈",
        key: "switch",
        label: "Switch",
    },
    {
        Component: ToggleGroupExample,
        group: "动作与反馈",
        key: "toggle-group",
        label: "ToggleGroup",
    },
    {
        Component: SliderExample,
        group: "动作与反馈",
        key: "slider",
        label: "Slider",
    },
    {
        Component: SpinnerExample,
        group: "动作与反馈",
        key: "spinner",
        label: "Spinner",
    },
    {
        Component: ProgressExample,
        group: "动作与反馈",
        key: "progress",
        label: "Progress",
    },
    {
        Component: ToastExample,
        group: "动作与反馈",
        key: "toast",
        label: "Toast",
    },
    {
        Component: NativeDialogExample,
        group: "动作与反馈",
        key: "native-dialog",
        label: "Native Dialog",
    },
];
