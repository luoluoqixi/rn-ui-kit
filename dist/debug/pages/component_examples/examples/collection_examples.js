import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlashList, ListGroup, ListItem, NativeList, NativeListItem, NativeListNavigationItem, NativeListSection, NativeListSelectItem, NativeListSwitchItem, ScrollView, Switch, Text, os, } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
function NativeListExample() {
    const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
    const [native, setNative] = useState(true);
    const [theme, setTheme] = useState("system");
    const [syncInterval, setSyncInterval] = useState("hourly");
    const [backupInterval, setBackupInterval] = useState("four-hours");
    const [lastAction, setLastAction] = useState("尚未点击");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u5B8C\u6574\u8986\u76D6\u5BFC\u822A\u3001\u5F00\u5173\u3001\u5355\u9009\u3001Select \u4E0E\u5E73\u53F0\u539F\u751F picker \u53D8\u4F53\u3002", title: "\u5DE5\u4F5C\u533A\u8BBE\u7F6E", children: [_jsx(Switch, { checked: native, label: "\u4F7F\u7528\u539F\u751F List \u5916\u89C2", labelPosition: "end", onCheckedChange: setNative }), _jsx(View, { style: styles.nativeListFrame, children: _jsxs(NativeList, { native: native, nestedScrollEnabled: true, children: [_jsxs(NativeListSection, { footer: "\u5BFC\u822A\u884C\u9002\u5408\u8DF3\u8F6C\u5230\u66F4\u6DF1\u5C42\u7684\u8BBE\u7F6E\u9875\u3002", title: "\u5DE5\u4F5C\u533A", children: [_jsx(NativeListNavigationItem, { onPress: () => setLastAction("打开详情"), subtitle: "\u5E26\u6709 chevron \u7684\u5BFC\u822A\u884C", title: "\u8BE6\u60C5" }), _jsx(NativeListNavigationItem, { onPress: () => setLastAction("打开成员管理"), subtitle: "\u9080\u8BF7\u3001\u89D2\u8272\u4E0E\u8BBF\u95EE\u6743\u9650", title: "\u6210\u5458" })] }), _jsxs(NativeListSection, { footer: "Switch \u9002\u5408\u5373\u65F6\u751F\u6548\u7684\u72EC\u7ACB\u504F\u597D\u3002", title: "\u540C\u6B65", children: [_jsx(NativeListSwitchItem, { switchProps: { checked: autoSyncEnabled, onCheckedChange: setAutoSyncEnabled }, title: "\u81EA\u52A8\u540C\u6B65" }), _jsx(NativeListSelectItem, { selectProps: {
                                            onValueChange: setTheme,
                                            options: [
                                                { label: "浅色", value: "light" },
                                                { label: "深色", value: "dark" },
                                                { label: "跟随系统", value: "system" },
                                            ],
                                            value: theme ?? undefined,
                                        }, title: "\u4E3B\u9898\u6A21\u5F0F" }), _jsx(NativeListSelectItem, { selectProps: {
                                            onValueChange: setSyncInterval,
                                            options: [
                                                { label: "每 15 分钟", value: "15-minutes" },
                                                { label: "每小时", value: "hourly" },
                                                { label: "每天", value: "daily" },
                                            ],
                                            value: syncInterval ?? undefined,
                                        }, title: "\u540C\u6B65\u9891\u7387" })] }), _jsx(NativeListSection, { footer: "selected \u4E0E chevron={false} \u53EF\u7EC4\u5408\u6210\u4E92\u65A5\u9009\u62E9\u5217\u8868\u3002", title: "\u81EA\u52A8\u5907\u4EFD", children: [
                                    ["thirty-minutes", "30 分钟"],
                                    ["one-hour", "1 小时"],
                                    ["four-hours", "4 小时"],
                                    ["daily", "每天"],
                                    ["never", "从不"],
                                ].map(([value, title]) => (_jsx(NativeListItem, { chevron: false, onPress: () => setBackupInterval(value), selected: backupInterval === value, title: title }, value))) }), _jsxs(NativeListSection, { footer: "\u540C\u4E00\u4E2A Select \u53EF\u6839\u636E\u5E73\u53F0\u9009\u62E9\u4E0D\u540C\u7684\u539F\u751F picker \u5F62\u6001\u3002", title: "\u5E73\u53F0 picker", children: [_jsx(NativeListSelectItem, { selectProps: {
                                            onValueChange: setTheme,
                                            options: [
                                                { label: "浅色", value: "light" },
                                                { label: "深色", value: "dark" },
                                                { label: "跟随系统", value: "system" },
                                            ],
                                            placeholder: "选择主题模式",
                                            value: theme ?? undefined,
                                        }, title: "\u9ED8\u8BA4 Select" }), os() === "ios" ? (_jsx(NativeListSelectItem, { selectProps: {
                                            nativePickerMode: "wheel",
                                            onValueChange: setTheme,
                                            options: [
                                                { label: "浅色", value: "light" },
                                                { label: "深色", value: "dark" },
                                                { label: "跟随系统", value: "system" },
                                            ],
                                            placeholder: "选择主题模式",
                                            value: theme ?? undefined,
                                        }, title: "iOS Wheel" })) : null, os() === "android" ? (_jsx(NativeListSelectItem, { selectProps: {
                                            nativePickerMode: "dialog",
                                            onValueChange: setTheme,
                                            options: [
                                                { label: "浅色", value: "light" },
                                                { label: "深色", value: "dark" },
                                                { label: "跟随系统", value: "system" },
                                            ],
                                            placeholder: "选择主题模式",
                                            value: theme ?? undefined,
                                        }, title: "Android Dialog" })) : null] })] }) }), _jsxs(Text, { opacity: 0.6, children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", lastAction, " \u00B7 \u81EA\u52A8\u540C\u6B65\uFF1A", autoSyncEnabled ? "开启" : "关闭", " \u00B7 \u4E3B\u9898\uFF1A", theme ?? "未选择", " \u00B7 \u9891\u7387\uFF1A", syncInterval ?? "未选择", " \u00B7 \u5907\u4EFD\uFF1A", backupInterval] })] }) }));
}
function ListGroupExample() {
    const [lastAction, setLastAction] = useState("尚未点击");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "ListGroup \u9002\u5408\u627F\u8F7D\u4E00\u7EC4\u5E26\u6807\u9898\u3001\u8BF4\u660E\u548C\u8FDE\u7EED\u5206\u9694\u7EBF\u7684\u5165\u53E3\u3002", title: "\u5185\u5BB9\u5E93", children: [_jsx(ListGroup, { items: [
                        {
                            onPress: () => setLastAction("最近文件"),
                            subTitle: "显示最近访问的文件",
                            title: "最近文件",
                        },
                        {
                            onPress: () => setLastAction("收藏夹"),
                            subTitle: "显示收藏内容",
                            title: "收藏夹",
                        },
                        {
                            onPress: () => setLastAction("共享给团队"),
                            subTitle: "管理外部协作者可以访问的内容",
                            title: "共享与权限",
                        },
                    ], rounded: "$4", separator: true, size: "$4" }), _jsxs(Text, { opacity: 0.6, children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", lastAction] })] }) }));
}
function ListItemExample() {
    const [pressed, setPressed] = useState(0);
    const [archived, setArchived] = useState(false);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u72EC\u7ACB ListItem \u53EF\u4EE5\u8131\u79BB ListGroup \u7528\u4E8E\u5C40\u90E8\u7684\u53EF\u70B9\u51FB\u4FE1\u606F\u5361\u3002", title: "\u5355\u6761\u8BB0\u5F55", children: [_jsx(ListItem, { onPress: () => setPressed((current) => current + 1), style: styles.listItem, subTitle: "ListItem \u53EF\u4EE5\u72EC\u7ACB\u4F7F\u7528", title: "\u5355\u4E2A\u5217\u8868\u9879" }), _jsx(ListItem, { onPress: () => setArchived((current) => !current), style: styles.listItem, subTitle: archived ? "已归档，点击恢复" : "点击后归档该条记录", title: archived ? "归档记录" : "当前记录" }), _jsxs(Text, { opacity: 0.6, children: ["\u5DF2\u70B9\u51FB ", pressed, " \u6B21"] })] }) }));
}
const flashListData = Array.from({ length: 40 }, (_, index) => ({
    id: `flash-row-${index}`,
    label: `FlashList row ${index + 1}`,
}));
function FlashListExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u56FA\u5B9A\u9AD8\u5EA6\u4E2D\u6E32\u67D3 40 \u6761\u6570\u636E\uFF0C\u9002\u5408\u4F5C\u4E3A\u957F\u5217\u8868\u7684\u6027\u80FD\u57FA\u7EBF\u3002", title: "\u865A\u62DF\u5316\u5217\u8868", children: _jsx(View, { style: styles.listFrame, children: _jsx(FlashList, { data: flashListData, keyExtractor: (item) => item.id, renderItem: ({ item }) => (_jsx(View, { style: styles.listRow, children: _jsx(Text, { children: item.label }) })) }) }) }) }));
}
function ScrollViewExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u5D4C\u5957\u5BB9\u5668\u4FDD\u6301\u81EA\u5DF1\u7684\u6EDA\u52A8\u4F4D\u7F6E\uFF0C\u4E0D\u5F71\u54CD\u793A\u4F8B\u8BE6\u60C5\u9875\u3002", title: "\u72EC\u7ACB\u6EDA\u52A8\u533A\u57DF", children: _jsx(View, { style: styles.scrollFrame, children: _jsx(ScrollView, { nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: styles.scrollView, children: Array.from({ length: 20 }, (_, index) => (_jsx(View, { style: styles.listRow, children: _jsxs(Text, { children: ["ScrollView row ", index + 1] }) }, index))) }) }) }) }));
}
export const collectionExamples = [
    {
        Component: NativeListExample,
        group: "列表与滚动",
        key: "native-list",
        label: "NativeList",
    },
    {
        Component: ListGroupExample,
        group: "列表与滚动",
        key: "list-group",
        label: "ListGroup",
    },
    {
        Component: ListItemExample,
        group: "列表与滚动",
        key: "list-item",
        label: "ListItem",
    },
    {
        Component: FlashListExample,
        group: "列表与滚动",
        key: "flash-list",
        label: "FlashList",
    },
    {
        Component: ScrollViewExample,
        group: "列表与滚动",
        key: "scroll-view",
        label: "ScrollView",
    },
];
const styles = StyleSheet.create({
    listFrame: { height: 320, minHeight: 0 },
    listItem: { borderRadius: 12, borderWidth: StyleSheet.hairlineWidth },
    listRow: {
        borderBottomColor: "rgba(128, 128, 128, 0.22)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        minHeight: 48,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    nativeListFrame: { height: 620, minHeight: 0 },
    scrollFrame: { height: 260, minHeight: 0 },
    scrollView: { flex: 1 },
});
