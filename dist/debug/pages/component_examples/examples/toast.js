import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Switch, useToast } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function ToastExample() {
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
