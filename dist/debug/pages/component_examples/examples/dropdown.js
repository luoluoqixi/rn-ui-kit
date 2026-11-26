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
    const [sourceMode, setSourceMode] = useState(true);
    const [alignment, setAlignment] = useState("left");
    const [styles, setStyles] = useState(["bold", "italic"]);
    const editorItems = [
        { value: "space", label: "新建工作区", shortcut: "⌘ N", onSelect: () => setAction("新建工作区") },
        { value: "section-space", separator: true, separatorVariant: "thick" },
        { value: "focus", label: "专注模式", onSelect: () => setAction("专注模式") },
        { value: "section-format", separator: true, separatorVariant: "thick" },
        { value: "heading", label: "一级标题", shortcut: "⌘ 1", onSelect: () => setAction("一级标题") },
        { value: "list", label: "项目列表", shortcut: "⌘ L", onSelect: () => setAction("项目列表") },
        { value: "tasks", label: "任务列表", onSelect: () => setAction("任务列表") },
        { value: "divider-tools", separator: true },
        { value: "link", label: "插入链接", shortcut: "⌘ K", onSelect: () => setAction("插入链接") },
        { value: "configure", label: "菜单设置", onSelect: () => setAction("菜单设置") },
    ];
    const alignmentItems = [
        { value: "left", label: "左对齐" },
        { value: "center", label: "居中对齐" },
        { value: "right", label: "右对齐" },
    ].map(item => ({ ...item, selected: alignment === item.value, selectionIndicatorVariant: "dot", shouldCloseOnSelect: false, onSelect: () => setAlignment(item.value) }));
    const styleItems = [
        { value: "bold", label: "粗体", shortcut: "⌘ B" },
        { value: "italic", label: "斜体", shortcut: "⌘ I" },
        { value: "underline", label: "下划线", shortcut: "⌘ U" },
    ].map(item => ({ ...item, checkbox: true, selected: styles.includes(item.value), onSelect: () => setStyles(previous => previous.includes(item.value) ? previous.filter(value => value !== item.value) : [...previous, item.value]) }));
    const longItems = Array.from({ length: 40 }, (_, i) => ({
        value: "document-" + (i + 1), label: "项目文档 " + String(i + 1).padStart(2, "0"),
        onSelect: () => setAction("项目文档 " + (i + 1)),
    }));
    const selectionItems = [
        {
            value: "source-mode",
            label: "源码模式",
            icon: _jsx(FilePlus, { color: "#64748b", size: 16 }),
            selected: sourceMode,
            onSelect: () => setSourceMode((value) => !value),
        },
        {
            value: "preview-mode",
            label: "预览模式",
            selected: !sourceMode,
            onSelect: () => setSourceMode((value) => !value),
        },
        {
            value: "nested-selection",
            label: "子菜单",
            subMenu: [
                { value: "inherited", label: "继承位置", selected: true },
                {
                    value: "override",
                    label: "单项固定左侧",
                    selected: true,
                    selectionIndicatorPosition: "left",
                },
            ],
        },
    ];
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
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { title: "\u9879\u76EE\u83DC\u5355", children: [_jsx(DropdownPair, { native: false, items: items, triggerLabel: "\u6253\u5F00 Dropdown" }), _jsxs(Text, { color: "muted", children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] }), _jsxs(ExampleBlock, { title: "\u5206\u533A\u4E0E\u5FEB\u6377\u952E", description: "\u7C97\u5206\u9694\u7EBF\u5212\u5206\u529F\u80FD\u533A\uFF0C\u7EC6\u5206\u9694\u7EBF\u5206\u5F00\u76F8\u5173\u64CD\u4F5C\uFF1B\u53F3\u4FA7\u5FEB\u6377\u952E\u4EC5\u4F5C\u63D0\u793A\u3002", children: [_jsx(Dropdown, { native: false, nativeHaptics: true, itemNativeHaptics: true, items: editorItems, triggerLabel: "\u7F16\u8F91\u83DC\u5355" }), _jsxs(Text, { color: "muted", children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] }), _jsxs(ExampleBlock, { title: "\u5355\u9009\u4E0E\u591A\u9009", description: "\u9009\u62E9\u540E\u83DC\u5355\u4FDD\u6301\u6253\u5F00\uFF1B\u5355\u9009\u4F7F\u7528\u5706\u70B9\uFF0C\u591A\u9009\u4F7F\u7528\u52FE\u53F7\u3002", children: [_jsxs(View, { className: "flex-row flex-wrap gap-3", children: [_jsx(Dropdown, { native: false, nativeHaptics: true, itemNativeHaptics: true, items: alignmentItems, triggerLabel: "\u6BB5\u843D\u5BF9\u9F50" }), _jsx(Dropdown, { native: false, nativeHaptics: true, itemNativeHaptics: true, items: styleItems, triggerLabel: "\u6587\u5B57\u6837\u5F0F" })] }), _jsxs(Text, { color: "muted", children: ["\u5F53\u524D\u5BF9\u9F50\uFF1A", alignmentItems.find(item => item.value === alignment)?.label] }), _jsxs(Text, { color: "muted", children: ["\u6587\u5B57\u6837\u5F0F\uFF1A", styleItems.filter(item => item.selected).map(item => item.label).join("、") || "无"] })] }), _jsxs(ExampleBlock, { title: "\u957F\u83DC\u5355\u6EDA\u52A8", description: "40 \u4E2A\u6587\u6863\u9650\u5236\u5728 280 \u9AD8\u5EA6\u5185\uFF0C\u6EDA\u52A8\u5230\u5E95\u90E8\u540E\u4ECD\u53EF\u9009\u62E9\u3002", children: [_jsx(Dropdown, { native: false, nativeHaptics: true, itemNativeHaptics: true, contentProps: { maxHeight: 280 }, items: longItems, triggerLabel: "\u6D4F\u89C8\u5168\u90E8\u6587\u6863" }), _jsxs(Text, { color: "muted", children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] }), _jsx(ExampleBlock, { title: "\u5F39\u51FA\u65B9\u5411", description: "\u4ECE\u89E6\u53D1\u5668\u4E0A\u3001\u4E0B\u3001\u5DE6\u3001\u53F3\u6253\u5F00\uFF1B\u9760\u8FD1\u5C4F\u5E55\u8FB9\u7F18\u65F6\u4F1A\u907F\u8BA9\u3002", children: _jsxs(View, { className: "gap-3", children: [_jsx(View, { className: "items-center", children: _jsx(Dropdown, { native: false, items: items.slice(0, 2), contentProps: { side: "top", align: "center" }, triggerLabel: "\u5411\u4E0A" }) }), _jsxs(View, { className: "flex-row justify-between", children: [_jsx(Dropdown, { native: false, items: items.slice(0, 2), contentProps: { side: "right", align: "center" }, triggerLabel: "\u5411\u53F3" }), _jsx(Dropdown, { native: false, items: items.slice(0, 2), contentProps: { side: "left", align: "center" }, triggerLabel: "\u5411\u5DE6" })] }), _jsx(View, { className: "items-center", children: _jsx(Dropdown, { native: false, items: items.slice(0, 2), contentProps: { side: "bottom", align: "center" }, triggerLabel: "\u5411\u4E0B" }) })] }) }), _jsxs(ExampleBlock, { title: "\u52FE\u9009\u6807\u8BB0\u4F4D\u7F6E", children: [_jsx(Dropdown, { native: false, nativeTrigger: true, items: selectionItems, triggerLabel: "\u9ED8\u8BA4\u5DE6\u4FA7" }), _jsx(Dropdown, { native: false, nativeTrigger: true, selectionIndicatorPosition: "right", items: selectionItems, triggerLabel: "\u53F3\u4FA7\u52FE\u9009" })] }), !isWeb() && (_jsxs(ExampleBlock, { title: "\u539F\u751F\u9879\u76EE\u83DC\u5355", children: [_jsx(DropdownPair, { native: true, items: items, triggerLabel: "Native" }), _jsxs(Text, { color: "muted", children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", action] })] })), _jsxs(ExampleBlock, { title: "\u7981\u7528", children: [_jsx(DropdownPair, { disabled: true, native: false, items: items, triggerLabel: "\u6253\u5F00 Dropdown" }), _jsx(DropdownPair, { disabled: true, native: true, items: items, triggerLabel: "\u6253\u5F00 Dropdown" })] })] }));
}
