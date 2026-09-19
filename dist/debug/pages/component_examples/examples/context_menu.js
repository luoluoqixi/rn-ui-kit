import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Button, ContextMenu, isWeb, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function ContextMenuExample() {
    const [action, setAction] = useState("尚未选择");
    const [showDetails, setShowDetails] = useState(false);
    const items = useMemo(() => [
        {
            label: "打开",
            onSelect: () => setAction("打开"),
            value: "open",
        },
        {
            label: "重命名",
            onSelect: () => setAction("重命名"),
            value: "rename",
        },
        { separator: true, value: "separator-actions" },
        {
            label: "更多操作",
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
    return (_jsxs(ExampleStack, { children: [!isWeb() && (_jsxs(ExampleBlock, { title: "ContextMenu \u539F\u751F\u83DC\u5355", children: [_jsx(ContextMenu, { items: items, native: true, nativeHaptics: true, trigger: _jsx(Button, { variant: "secondary", children: "\u957F\u6309\u6253\u5F00\u539F\u751F\u83DC\u5355" }) }), _jsxs(Text, { variant: "muted", children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] }), _jsxs(Text, { variant: "muted", children: ["\u8BE6\u7EC6\u4FE1\u606F\uFF1A", showDetails ? "显示" : "隐藏"] })] })), _jsx(ExampleBlock, { title: "ContextMenu \u83DC\u5355", children: _jsx(ContextMenu, { items: items, itemNativeHaptics: true, native: false, nativeHaptics: true, trigger: _jsx(Button, { variant: "secondary", children: isWeb() ? "右键打开项目菜单" : "长按打开项目菜单" }) }) })] }));
}
