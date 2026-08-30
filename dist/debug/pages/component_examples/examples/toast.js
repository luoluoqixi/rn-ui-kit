import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, isIos, isWeb, Switch, Text, useToast } from "rn-ui-kit/core";
import { View } from "react-native";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function ToastExample() {
    const { toast } = useToast();
    const [isNative, setIsNative] = useState(isIos());
    const showLoadingThenSuccess = () => {
        const id = toast.loading("正在刷新索引", {
            duration: 10_000,
            native: isNative,
            description: "请稍候...",
        });
        setTimeout(() => {
            toast.close(id);
            toast.success("索引已刷新", {
                native: isNative,
                description: "搜索结果已经更新。",
            });
        }, 900);
    };
    const showPromise = () => {
        const operation = new Promise((resolve) => {
            setTimeout(() => resolve("工作区配置"), 1_200);
        });
        toast.promise(operation, {
            loading: "正在保存",
            success: (name) => `${name}保存成功`,
            error: "保存失败",
            description: "异步任务已完成。",
            native: isNative,
            finally: () => undefined,
        });
    };
    const showCustom = () => {
        toast.custom((id) => (_jsxs(View, { className: "min-w-64 gap-2 rounded-lg border border-border bg-background p-3 shadow-lg", children: [_jsx(Text, { className: "font-semibold", children: "\u81EA\u5B9A\u4E49 Toast" }), _jsx(Text, { variant: "muted", children: "\u4EFB\u610F JSX \u5185\u5BB9\uFF0C\u652F\u6301\u81EA\u5DF1\u7684\u5E03\u5C40\u548C\u64CD\u4F5C\u3002" }), _jsx(Button, { size: "sm", onPress: () => toast.close(id), children: "\u5173\u95ED" })] })), { native: isNative, duration: 8_000 });
    };
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { description: "native=true \u5728 Android/iOS \u4F7F\u7528 Burnt\uFF1Bnative=false \u4F7F\u7528 Sonner \u57FA\u7840 Toast\u3002Web \u59CB\u7EC8\u4F7F\u7528\u57FA\u7840 Toast\u3002", title: "\u57FA\u7840 Toast", children: [!isWeb() && (_jsx(ExampleRow, { children: _jsx(Switch, { checked: isNative, onCheckedChange: setIsNative, label: "\u4F7F\u7528 Native Toast" }) })), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => toast("普通消息", { native: isNative, description: "这是一条基础提示。" }), children: "\u666E\u901A" }), _jsx(Button, { onPress: () => toast.info("同步中", { native: isNative, description: "正在连接服务器。" }), variant: "outline", children: "\u4FE1\u606F" }), _jsx(Button, { onPress: () => toast.success("保存成功", { native: isNative, description: "工作区配置已写入本地。" }), children: "\u6210\u529F" }), _jsx(Button, { onPress: () => toast.warning("空间不足", { native: isNative, description: "建议先清理附件缓存。" }), variant: "outline", children: "\u8B66\u544A" }), _jsx(Button, { onPress: () => toast.error("同步失败", { native: isNative, description: "请检查网络连接。" }), variant: "destructive", children: "\u5931\u8D25" }), _jsx(Button, { onPress: () => toast.success("仅 Title", { native: isNative }), children: "\u4EC5 Title" })] })] }), _jsx(ExampleBlock, { description: "\u6301\u7EED Toast \u53EF\u4EE5\u624B\u52A8\u5173\u95ED\uFF0C\u4E5F\u53EF\u4EE5\u5728\u5F02\u6B65\u4EFB\u52A1\u7ED3\u675F\u540E\u66FF\u6362\u4E3A\u6210\u529F\u72B6\u6001\u3002", title: "\u52A0\u8F7D\u4E0E\u5F02\u6B65\u72B6\u6001", children: _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: showLoadingThenSuccess, children: "\u52A0\u8F7D\u540E\u5B8C\u6210" }), _jsx(Button, { onPress: showPromise, variant: "outline", children: "Promise" }), _jsx(Button, { onPress: () => toast.loading("持续加载", { native: isNative, duration: 30_000 }), variant: "outline", children: "\u6301\u7EED\u52A0\u8F7D" })] }) }), _jsx(ExampleBlock, { description: "custom \u4E0D\u8D70 Burnt\uFF0CWeb \u548C\u539F\u751F\u57FA\u7840 Toast \u90FD\u652F\u6301\u4EFB\u610F JSX\u3002", title: "\u81EA\u5B9A\u4E49\u5185\u5BB9", children: _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: showCustom, children: "\u663E\u793A Custom JSX" }), _jsx(Button, { onPress: () => toast.closeAll(), variant: "outline", children: "\u5173\u95ED\u5168\u90E8" })] }) })] }));
}
