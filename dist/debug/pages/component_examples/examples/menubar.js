import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FilePlus, Share2 } from "lucide-react-native";
import { Icon, Menubar, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function MenubarExample() {
    const [action, setAction] = useState("尚未选择");
    const [bookmarks, setBookmarks] = useState(true);
    const [profile, setProfile] = useState("personal");
    const [open, setOpen] = useState();
    const items = [
        { value: "file", title: "文件", items: [
                { value: "new", label: "新建文件", icon: _jsx(Icon, { as: FilePlus, size: "sm" }), shortcut: "⌘N", onSelect: () => setAction("新建文件") },
                { value: "open", label: "打开文件", shortcut: "⌘O", onSelect: () => setAction("打开文件") },
                { value: "divider", separator: true },
                { value: "share", label: "分享", icon: _jsx(Icon, { as: Share2, size: "sm" }), subMenu: [
                        { value: "copy", label: "复制链接", onSelect: () => setAction("复制链接") },
                        { value: "mail", label: "发送邮件", onSelect: () => setAction("发送邮件") },
                    ] },
                { value: "export", label: "导出", disabled: true },
            ] },
        { value: "edit", title: "编辑", items: [
                { value: "undo", label: "撤销", shortcut: "⌘Z", onSelect: () => setAction("撤销") },
                { value: "redo", label: "重做", shortcut: "⇧⌘Z", onSelect: () => setAction("重做") },
                { value: "divider", separator: true, separatorVariant: "thick" },
                { value: "delete", label: "删除", destructive: true, onSelect: () => setAction("删除") },
            ] },
        { value: "view", title: "视图", items: [
                { value: "bookmarks", label: "显示书签栏", checkbox: true, selected: bookmarks, onSelect: () => setBookmarks(!bookmarks) },
                { value: "divider", separator: true },
                ...["personal", "work"].map(value => ({ value, label: value === "personal" ? "个人空间" : "工作空间",
                    selected: profile === value, selectionIndicatorVariant: "dot", shouldCloseOnSelect: false, onSelect: () => setProfile(value) })),
            ] },
        { value: "help", title: "帮助", disabled: true, items: [] },
    ];
    return _jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { title: "\u6587\u4EF6\u4E0E\u7F16\u8F91", children: [_jsx(Menubar, { items: items, nativeHaptics: true, itemNativeHaptics: true, value: open, onValueChange: setOpen }), _jsxs(Text, { color: "muted", children: ["\u6700\u8FD1\u64CD\u4F5C\uFF1A", action, "\uFF1B\u4E66\u7B7E\u680F\uFF1A", bookmarks ? "显示" : "隐藏"] }), _jsx(Text, { color: "muted", children: "Web \u652F\u6301\u5DE6\u53F3\u952E\u5207\u6362\u3001\u4E0A\u4E0B\u952E\u8FDB\u5165\u3001Escape \u5173\u95ED\u4E0E Tab \u79BB\u5F00\uFF1B\u83DC\u5355\u6253\u5F00\u540E\u79FB\u5230\u53E6\u4E00\u6807\u9898\u53EF\u5207\u6362\u3002" })] }), _jsxs(ExampleBlock, { title: "\u6309\u94AE\u5C3A\u5BF8\u4E0E\u83DC\u5355\u65B9\u5411", children: [_jsx(Menubar, { size: "md", items: items.slice(0, 2), contentProps: { side: "top" }, nativeHaptics: true, itemNativeHaptics: true }), _jsx(Text, { color: "muted", children: "\u6807\u9898\u4F7F\u7528 Button \u7684 md \u5C3A\u5BF8\uFF1B\u83DC\u5355\u5BC6\u5EA6\u6CBF\u7528\u4E3B\u9898\u9ED8\u8BA4\u503C\u3002" })] })] });
}
