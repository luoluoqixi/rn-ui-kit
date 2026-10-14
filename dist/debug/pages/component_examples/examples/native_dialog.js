import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, confirmNative, triggerNativeHaptics } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function NativeDialogExample() {
    const [result, setResult] = useState("尚未打开");
    const openDialog = async () => {
        triggerNativeHaptics(true);
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
    const showBasicNativeDialog = async () => {
        triggerNativeHaptics(true);
        const result = await confirmNative({
            cancelText: "稍后",
            confirmText: "保存",
            message: "当前草稿还没有写入本地文件。",
            title: "保存更改",
        });
        setResult(`普通确认：${result}`);
    };
    const showDestructiveNativeDialog = async () => {
        triggerNativeHaptics(true);
        const result = await confirmNative({
            confirmText: "删除",
            destructive: true,
            message: "删除后仅用于演示，不会真的移除文件。",
            title: "删除笔记",
        });
        setResult(`危险操作：${result}`);
    };
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: `最近结果：${result}`, title: "\u591A\u6309\u94AE\u786E\u8BA4", children: [_jsx(Button, { onPress: () => void openDialog(), children: "\u6253\u5F00\u539F\u751F\u5F39\u7A97" }), _jsx(Button, { onPress: showBasicNativeDialog, children: "\u539F\u751F\u786E\u8BA4" }), _jsx(Button, { onPress: showDestructiveNativeDialog, variant: "destructive", children: "\u539F\u751F\u5371\u9669\u786E\u8BA4" })] }) }));
}
