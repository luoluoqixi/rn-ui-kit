import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from "react-native";
import { useMemo, useState } from "react";
import { FolderOpen, Pencil, Settings } from "lucide-react-native";
import { Button, ContextMenu, Icon, isWeb, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function ContextMenuExample() {
    const [action, setAction] = useState("尚未选择");
    const [showDetails, setShowDetails] = useState(false);
    const items = useMemo(() => [
        {
            label: "打开",
            icon: _jsx(Icon, { as: FolderOpen, className: "size-4" }),
            onSelect: () => setAction("打开"),
            value: "open",
        },
        {
            label: "重命名",
            icon: _jsx(Icon, { as: Pencil, className: "size-4" }),
            onSelect: () => setAction("重命名"),
            value: "rename",
        },
        { separator: true, value: "separator-actions" },
        {
            label: "更多操作",
            icon: _jsx(Icon, { as: Settings, className: "size-4" }),
            subMenu: [
                {
                    label: "复制链接",
                    onSelect: () => setAction("复制链接"),
                    value: "copy-link",
                },
                {
                    label: "移动到归档",
                    onSelect: () => setAction("移动到归档"),
                    value: "archive",
                },
                {
                    label: "设置",
                    onSelect: () => setAction("设置"),
                    subtitle: "嵌套 ContextMenu",
                    value: "nested-settings",
                },
            ],
            subMenuTitle: false,
            value: "more",
        },
        {
            checked: showDetails,
            reserveIconSpace: false,
            label: "显示详细信息",
            onCheckedChange: setShowDetails,
            value: "details",
        },
        { disabled: true, label: "暂不可用", value: "disabled" },
        { separator: true, value: "separator-danger" },
        {
            destructive: true,
            label: "删除项目",
            onSelect: () => setAction("删除项目"),
            value: "delete",
        },
        {
            label: "测试项目1",
            onSelect: () => setAction("测试项目1"),
            value: "test1",
        },
        {
            label: "测试项目2",
            onSelect: () => setAction("测试项目2"),
            value: "test2",
        },
        {
            label: "测试项目3",
            onSelect: () => setAction("测试项目3"),
            value: "test3",
        },
        {
            label: "测试项目4",
            onSelect: () => setAction("测试项目4"),
            value: "test4",
        },
        {
            label: "测试项目5",
            onSelect: () => setAction("测试项目5"),
            value: "test5",
        },
    ], [showDetails]);
    return (_jsxs(ExampleStack, { children: [!isWeb() && (_jsxs(ExampleBlock, { title: "ContextMenu \u539F\u751F\u83DC\u5355", children: [_jsx(ContextMenu, { items: items, native: true, nativeHaptics: true, trigger: _jsx(Button, { variant: "secondary", children: "\u957F\u6309\u6253\u5F00\u539F\u751F\u83DC\u5355" }) }), _jsxs(Text, { color: "muted", children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] }), _jsxs(Text, { color: "muted", children: ["\u8BE6\u7EC6\u4FE1\u606F\uFF1A", showDetails ? "显示" : "隐藏"] })] })), _jsxs(ExampleBlock, { title: "\u4EE5\u89E6\u53D1\u5668\u4E3A\u951A\u70B9", children: [_jsx(ContextMenu, { items: items, itemNativeHaptics: true, native: false, nativeHaptics: true, trigger: _jsx(Button, { variant: "secondary", children: isWeb() ? "右键打开项目菜单" : "长按打开项目菜单" }) }), _jsx(Text, { color: "muted", children: "\u79FB\u52A8\u7AEF\u957F\u6309\u540E\u9ED8\u8BA4\u4EE5\u6309\u94AE\u4E2D\u5FC3\u5BF9\u9F50\uFF1BWeb \u4FDD\u7559\u53F3\u952E\u83DC\u5355\u7684\u89E6\u70B9\u5B9A\u4F4D\u3002" })] }), _jsxs(ExampleBlock, { title: "\u533A\u57DF\u5185\u7684\u89E6\u70B9\u5B9A\u4F4D", children: [_jsx(ContextMenu, { native: false, anchor: "touch", items: items, nativeHaptics: true, itemNativeHaptics: true, trigger: _jsx(View, { className: "min-h-40 w-full items-center justify-center rounded-lg bg-surface-secondary p-6", children: _jsxs(Text, { children: ["\u5728\u533A\u57DF\u5185\u4EFB\u610F\u4F4D\u7F6E", isWeb() ? "右键" : "长按"] }) }) }), _jsx(Text, { color: "muted", children: "\u663E\u5F0F\u8BBE\u7F6E anchor=\"touch\"\uFF0C\u83DC\u5355\u8DDF\u968F\u6309\u4E0B\u7684\u4F4D\u7F6E\u3002" })] })] }));
}
