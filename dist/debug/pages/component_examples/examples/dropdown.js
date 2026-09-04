import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Download, FilePlus, Settings } from "lucide-react-native";
import { useState } from "react";
import { Dropdown, isWeb, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
import { View } from "react-native";
function DropdownPair({ children, ...props }) {
    return (_jsxs(View, { className: "gap-2", children: [_jsxs(View, { className: "flex-row gap-2", children: [_jsx(Dropdown, { nativeHaptics: true, itemNativeHaptics: true, ...props, children: children }), _jsx(Dropdown, { nativeHaptics: true, itemNativeHaptics: true, nativeTrigger: true, ...props, children: children })] }), _jsx(Dropdown, { nativeHaptics: true, itemNativeHaptics: true, triggerClassName: "w-full", ...props, children: children }), _jsx(Dropdown, { nativeHaptics: true, itemNativeHaptics: true, nativeTrigger: true, triggerClassName: "w-full", ...props, children: children })] }));
}
export function DropdownExample() {
    const [action, setAction] = useState("尚未选择");
    const items = [
        {
            icon: _jsx(FilePlus, { color: "#64748b", size: 16 }),
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
                    icon: _jsx(Settings, { color: "#64748b", size: 16 }),
                    iconProps: {
                        androidIconName: "ic_menu_preferences",
                        ios: { name: "gearshape" },
                    },
                    label: "显示设置",
                    onSelect: () => setAction("显示设置"),
                    subtitle: "嵌套 Dropdown",
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
            icon: _jsx(Download, { color: "#64748b", size: 16 }),
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
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { title: "\u9879\u76EE\u83DC\u5355", children: [_jsx(DropdownPair, { native: false, items: items, triggerLabel: "\u6253\u5F00 Dropdown" }), _jsxs(Text, { variant: "muted", children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] }), !isWeb() && (_jsxs(ExampleBlock, { title: "\u539F\u751F\u9879\u76EE\u83DC\u5355", children: [_jsx(DropdownPair, { native: true, items: items, triggerLabel: "Native" }), _jsxs(Text, { variant: "muted", children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] })), _jsxs(ExampleBlock, { title: "\u7981\u7528", children: [_jsx(DropdownPair, { disabled: true, native: false, items: items, triggerLabel: "\u6253\u5F00 Dropdown" }), _jsx(DropdownPair, { disabled: true, native: true, items: items, triggerLabel: "\u6253\u5F00 Dropdown" })] })] }));
}
