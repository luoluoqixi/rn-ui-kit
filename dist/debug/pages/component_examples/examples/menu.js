import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Download, FilePlus, Settings } from "@tamagui/lucide-icons-2";
import { useState } from "react";
import { Button, Menu, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function MenuExample() {
    const [action, setAction] = useState("尚未选择");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "Menu \u9002\u5408\u7531\u666E\u901A\u6309\u94AE\u89E6\u53D1\u7684\u4E00\u7EC4\u8F7B\u91CF\u64CD\u4F5C\u3002", title: "\u9879\u76EE\u83DC\u5355", children: [_jsx(Menu, { arrow: true, trigger: _jsx(Button, { variant: "outlined", children: "\u6253\u5F00 Menu" }), items: [
                        {
                            icon: _jsx(FilePlus, { color: "$color10", size: 14 }),
                            iconProps: {
                                androidIconName: "ic_menu_add",
                                ios: { name: "doc.badge.plus" },
                            },
                            label: "新建文件",
                            onSelect: () => setAction("新建文件"),
                            value: "new",
                        },
                        {
                            label: "更多操作",
                            subMenu: [
                                {
                                    icon: _jsx(Settings, { color: "$color10", size: 14 }),
                                    iconProps: {
                                        androidIconName: "ic_menu_preferences",
                                        ios: { name: "gearshape" },
                                    },
                                    label: "打开设置",
                                    onSelect: () => setAction("打开设置"),
                                    value: "settings",
                                },
                                {
                                    icon: _jsx(Download, { color: "$color10", size: 14 }),
                                    iconProps: {
                                        androidIconName: "ic_menu_save",
                                        ios: { name: "square.and.arrow.down" },
                                    },
                                    label: "导出快照",
                                    onSelect: () => setAction("导出快照"),
                                    value: "export",
                                },
                            ],
                            value: "more",
                        },
                        { label: "separator", separator: true, value: "separator" },
                        {
                            destructive: true,
                            label: "清空记录",
                            onSelect: () => setAction("清空记录"),
                            value: "clear",
                        },
                    ] }), _jsx(Menu, { arrow: true, nativeTrigger: true, nativeTriggerLabel: "\u6253\u5F00Menu", items: [
                        {
                            icon: _jsx(FilePlus, { color: "$color10", size: 14 }),
                            iconProps: {
                                androidIconName: "ic_menu_add",
                                ios: { name: "doc.badge.plus" },
                            },
                            label: "新建文件",
                            onSelect: () => setAction("新建文件"),
                            value: "new",
                        },
                        {
                            label: "更多操作",
                            subMenu: [
                                {
                                    icon: _jsx(Settings, { color: "$color10", size: 14 }),
                                    iconProps: {
                                        androidIconName: "ic_menu_preferences",
                                        ios: { name: "gearshape" },
                                    },
                                    label: "打开设置",
                                    onSelect: () => setAction("打开设置"),
                                    value: "settings",
                                },
                                {
                                    icon: _jsx(Download, { color: "$color10", size: 14 }),
                                    iconProps: {
                                        androidIconName: "ic_menu_save",
                                        ios: { name: "square.and.arrow.down" },
                                    },
                                    label: "导出快照",
                                    onSelect: () => setAction("导出快照"),
                                    value: "export",
                                },
                            ],
                            subMenuTitle: false,
                            value: "more",
                        },
                        { label: "separator", separator: true, value: "separator" },
                        {
                            destructive: true,
                            label: "清空记录",
                            onSelect: () => setAction("清空记录"),
                            value: "clear",
                        },
                    ] }), _jsxs(Text, { opacity: 0.6, children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] }) }));
}
