import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Download, FilePlus, Settings } from "@tamagui/lucide-icons-2";
import { useState } from "react";
import { Button, Menu, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function MenuExample() {
    const [action, setAction] = useState("尚未选择");
    const items = [
        {
            icon: _jsx(FilePlus, { color: "$color10", size: 14 }),
            iconProps: {
                androidIconName: "ic_menu_add",
                ios: { name: "doc.badge.plus" },
            },
            label: "新建文件",
            onSelect: () => setAction("新建文件"),
            value: "new-file",
        },
        {
            label: "打开最近文件",
            onSelect: () => setAction("打开最近文件"),
            value: "open-recent",
        },
        { separator: true, value: "separator-file" },
        {
            label: "显示方式",
            subMenu: [
                {
                    label: "列表",
                    onSelect: () => setAction("显示方式：列表"),
                    selected: true,
                    value: "view-list",
                },
                {
                    label: "紧凑列表",
                    onSelect: () => setAction("显示方式：紧凑列表"),
                    value: "view-compact",
                },
                { separator: true, value: "separator-view" },
                {
                    icon: _jsx(Settings, { color: "$color10", size: 14 }),
                    iconProps: {
                        androidIconName: "ic_menu_preferences",
                        ios: { name: "gearshape" },
                    },
                    label: "显示设置",
                    onSelect: () => setAction("显示设置"),
                    value: "view-settings",
                },
            ],
            subMenuTitle: false,
            value: "view-options",
        },
        {
            disabled: true,
            label: "云端同步（不可用）",
            onSelect: () => setAction("云端同步"),
            value: "cloud-sync",
        },
        { separator: true, value: "separator-export" },
        {
            icon: _jsx(Download, { color: "$color10", size: 14 }),
            iconProps: {
                androidIconName: "ic_menu_save",
                ios: { name: "square.and.arrow.down" },
            },
            label: "导出快照",
            onSelect: () => setAction("导出快照"),
            value: "export-snapshot",
        },
        {
            label: "复制分享链接",
            onSelect: () => setAction("复制分享链接"),
            value: "copy-share-link",
        },
        { separator: true, value: "separator-danger" },
        {
            destructive: true,
            label: "清空记录",
            onSelect: () => setAction("清空记录"),
            value: "clear-history",
        },
    ];
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u5305\u542B\u4E09\u6761\u6839\u83DC\u5355\u5206\u5272\u7EBF\u53CA\u4E00\u6761\u5B50\u83DC\u5355\u5206\u5272\u7EBF\uFF0C\u7528\u4E8E\u68C0\u67E5\u666E\u901A\u3001\u7981\u7528\u3001\u9009\u4E2D\u548C destructive \u9879\u4E4B\u95F4\u7684\u5206\u7EC4\u663E\u793A\u3002", title: "\u590D\u6742\u9879\u76EE\u83DC\u5355", children: [_jsx(Menu, { arrow: true, items: items, trigger: _jsx(Button, { variant: "outlined", children: "\u6253\u5F00 Menu" }) }), _jsx(Menu, { arrow: true, items: items, nativeTrigger: true, nativeTriggerLabel: "\u6253\u5F00 Native Menu" }), _jsxs(Text, { opacity: 0.6, children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] }) }));
}
