import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Settings } from "@tamagui/lucide-icons-2";
import { useState } from "react";
import { Button, ContextMenu, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function ContextMenuExample() {
    const [action, setAction] = useState("尚未选择");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u5728\u684C\u9762\u7AEF\u53F3\u952E\u3001\u5728\u89E6\u63A7\u8BBE\u5907\u957F\u6309\uFF0C\u5747\u4F1A\u6253\u5F00\u540C\u4E00\u7EC4\u64CD\u4F5C\u3002", title: "\u6587\u4EF6\u64CD\u4F5C", children: [_jsx(ContextMenu, { arrow: true, items: [
                        { label: "重命名", onSelect: () => setAction("重命名"), value: "rename" },
                        { label: "复制链接", onSelect: () => setAction("复制链接"), value: "copy-link" },
                        {
                            label: "更多操作",
                            subMenu: [
                                {
                                    icon: _jsx(Settings, { color: "$color10", size: 14 }),
                                    label: "设置",
                                    onSelect: () => setAction("设置"),
                                    subtitle: "嵌套 ContextMenu",
                                    value: "settings",
                                },
                                {
                                    label: "下载",
                                    onSelect: () => setAction("下载"),
                                    value: "download",
                                },
                            ],
                            value: "more",
                        },
                        { label: "separator", separator: true, value: "separator" },
                        {
                            destructive: true,
                            label: "删除",
                            onSelect: () => setAction("删除"),
                            value: "delete",
                        },
                    ], trigger: _jsx(Button, { variant: "outlined", children: "\u53F3\u952E\u6216\u957F\u6309" }) }), _jsxs(Text, { opacity: 0.6, children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] }) }));
}
