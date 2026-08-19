import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CalendarDays, CircleOff, Clock, Clock4, Info, ListFilter, MoreHorizontal, Palette, RefreshCw, SlidersHorizontal, Smartphone, Square, SquareCheckBig, Timer, Users, } from "@tamagui/lucide-icons-2";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NativeList, NativeListInputItem, NativeListItem, NativeListMenuItem, NativeListNavigationItem, NativeListSection, NativeListSelectItem, NativeListSwitchItem, NativeListTextAreaItem, Select, Switch, Text, isIos15, os, useNativeListEditMode, } from "rn-ui-kit/core";
const NATIVE_LIST_ICON_COLOR = "#7c3aed";
const NATIVE_LIST_ICON_SIZE = 20;
const NATIVE_LIST_BACKUP_OPTIONS = [
    { Icon: Timer, sfSymbol: "timer", title: "30 分钟", value: "thirty-minutes" },
    { Icon: Clock, sfSymbol: "clock", title: "1 小时", value: "one-hour" },
    {
        Icon: Clock4,
        sfSymbol: isIos15() ? "clock" : "clock.badge",
        title: "4 小时",
        value: "four-hours",
    },
    { Icon: CalendarDays, sfSymbol: "calendar", title: "每天", value: "daily" },
    { Icon: CircleOff, sfSymbol: "nosign", title: "从不", value: "never" },
];
const NATIVE_LIST_SORT_LIST = [
    { value: "defaultSort", label: "默认排序" },
    { value: "timeSort", label: "时间排序" },
];
const NATIVE_LIST_IOS_STYLE_OPTIONS = [
    { value: "automatic", label: "系统自动" },
    { value: "plain", label: "通栏无圆角" },
    { value: "inset", label: "内缩" },
    { value: "insetGrouped", label: "圆角分组" },
    { value: "grouped", label: "分组" },
    { value: "sidebar", label: "侧边栏" },
];
function NativeListSortTrailing() {
    const editMode = useNativeListEditMode();
    return (_jsx(Select, { disabled: editMode, value: "defaultSort", renderValue: () => "排序方式", options: NATIVE_LIST_SORT_LIST, nativeTrigger: true, nativeTriggerLabelProps: {
            fontSize: 14,
            color: "$accent11",
            opacity: 1,
        }, nativeTriggerContainerStyle: {
            alignItems: "center",
            flexDirection: "row",
            flexShrink: 1,
            gap: 4,
            maxWidth: 180,
            minHeight: 32,
            minWidth: 0,
        } }));
}
const styles = StyleSheet.create({
    exampleControlCopy: { flex: 1, gap: 2, minWidth: 0 },
    exampleControlRow: {
        alignItems: "center",
        flexDirection: "row",
        gap: 16,
        justifyContent: "space-between",
        minHeight: 48,
    },
    exampleIosStyleTrigger: {
        alignItems: "center",
        flexDirection: "row",
        flexShrink: 0,
        gap: 4,
        justifyContent: "flex-end",
        maxWidth: 150,
        minHeight: 36,
        minWidth: 112,
        paddingHorizontal: 10,
    },
    exampleHeader: { gap: 10 },
    exampleRoot: { flex: 1, gap: 12, minHeight: 0, padding: 16 },
    nativeListFrame: { flex: 1, minHeight: 0 },
});
export function NativeListExample() {
    const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
    const [customEditModeIcon, setCustomEditModeIcon] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [native, setNative] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [fallbackMounted, setFallbackMounted] = useState(true);
    const [iosListStyle, setIosListStyle] = useState("insetGrouped");
    const [theme, setTheme] = useState("system");
    const [syncInterval, setSyncInterval] = useState("hourly");
    const [backupInterval, setBackupInterval] = useState("four-hours");
    const [lastAction, setLastAction] = useState("尚未点击");
    const [workspaceName, setWorkspaceName] = useState("rn-ui-kit");
    const [workspaceNote, setWorkspaceNote] = useState("");
    useEffect(() => {
        if (native) {
            return;
        }
        const frame = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setFallbackMounted(true);
            });
        });
        return () => cancelAnimationFrame(frame);
    }, [native]);
    return (_jsxs(View, { style: styles.exampleRoot, children: [_jsxs(View, { style: styles.exampleHeader, children: [_jsx(Switch, { checked: native, label: "\u4F7F\u7528\u539F\u751F List \u5916\u89C2", labelPosition: "end", onCheckedChange: (nextNative) => {
                            setFallbackMounted(false);
                            setNative(nextNative);
                        } }), _jsx(Switch, { checked: editMode, label: `编辑模式（已选 ${selectedIds.length} 项）`, labelPosition: "end", onCheckedChange: (nextEditMode) => {
                            setEditMode(nextEditMode);
                            if (!nextEditMode) {
                                setSelectedIds([]);
                            }
                        } }), _jsx(Switch, { checked: customEditModeIcon, disabled: os() === "ios" && native, label: "\u81EA\u5B9A\u4E49\u7F16\u8F91\u6A21\u5F0F\u56FE\u6807", labelPosition: "end", onCheckedChange: setCustomEditModeIcon }), os() === "ios" ? (_jsxs(View, { style: styles.exampleControlRow, children: [_jsx(View, { style: styles.exampleControlCopy, children: _jsx(Text, { fontSize: 15, opacity: native ? 1 : 0.5, children: "iOS List \u6837\u5F0F" }) }), _jsx(Select, { disabled: !native, native: true, nativeDropdownAnchorWidth: 180, nativeTrigger: true, nativeTriggerContainerStyle: styles.exampleIosStyleTrigger, nativeTriggerLabelProps: {
                                    fontSize: 14,
                                    numberOfLines: 1,
                                    opacity: native ? 1 : 0.5,
                                }, onValueChange: (nextStyle) => {
                                    if (nextStyle != null) {
                                        setIosListStyle(nextStyle);
                                    }
                                }, options: NATIVE_LIST_IOS_STYLE_OPTIONS, value: iosListStyle })] })) : null] }), _jsx(View, { style: styles.nativeListFrame, children: native || fallbackMounted ? (_jsxs(NativeList, { contextMenuProps: {
                        items: [
                            {
                                label: "复制标题",
                                onSelect: () => setLastAction("根菜单：复制标题"),
                                value: "copy-title",
                            },
                            {
                                label: "更多操作",
                                subMenu: [
                                    {
                                        label: "共享",
                                        onSelect: () => setLastAction("根菜单：共享"),
                                        value: "share",
                                    },
                                    {
                                        destructive: true,
                                        label: "删除",
                                        onSelect: () => setLastAction("根菜单：删除"),
                                        value: "delete",
                                    },
                                ],
                                subMenuTitle: "更多操作",
                                value: "more",
                            },
                        ],
                    }, editMode: editMode, editModeIcon: customEditModeIcon ? _jsx(Square, { color: "$color10", size: 24 }) : undefined, editModeSelectedIcon: customEditModeIcon ? _jsx(SquareCheckBig, { color: "$color10", size: 24 }) : undefined, refreshEnabledInEditMode: false, fixesIOS26NestedScrollIndicatorSafeArea: true, iosListStyle: iosListStyle, native: native, nestedScrollEnabled: true, onSelectedIdsChange: setSelectedIds, onRefresh: async () => {
                        await new Promise((resolve) => {
                            setTimeout(resolve, 1200);
                        });
                        setLastAction("下拉刷新完成");
                    }, selectedIds: selectedIds, children: [_jsxs(NativeListSection, { footer: "\u8F93\u5165\u6846\u5360\u6EE1\u4E00\u884C\uFF1BiOS \u805A\u7126\u7F16\u8F91\u65F6\u4F1A\u663E\u793A\u7CFB\u7EDF\u6E05\u9664\u6309\u94AE\u3002", title: "\u540D\u79F0", children: [_jsx(NativeListInputItem, { inputProps: {
                                        autoCapitalize: "none",
                                        onChangeText: setWorkspaceName,
                                        placeholder: "输入工作区名称",
                                        value: workspaceName,
                                    } }), _jsx(NativeListInputItem, { subtitle: "subtitle", title: "\u540D\u79F0", inputProps: {
                                        autoCapitalize: "none",
                                        onChangeText: setWorkspaceName,
                                        placeholder: "输入工作区名称",
                                        value: workspaceName,
                                    } })] }), _jsxs(NativeListSection, { contextMenuProps: {
                                items: [
                                    {
                                        label: "工作区菜单",
                                        onSelect: () => setLastAction("Section 菜单：工作区"),
                                        subtitle: "覆盖 NativeList 默认菜单",
                                        value: "workspace-menu",
                                    },
                                ],
                            }, footer: "\u5BFC\u822A\u884C\u9002\u5408\u8DF3\u8F6C\u5230\u66F4\u6DF1\u5C42\u7684\u8BBE\u7F6E\u9875\u3002", title: "\u5DE5\u4F5C\u533A", titleColor: "#7c3aed", trailing: NativeListSortTrailing, children: [_jsx(NativeListNavigationItem, { chevronColor: NATIVE_LIST_ICON_COLOR, contextMenuProps: {
                                        items: [
                                            {
                                                label: "详情专属菜单",
                                                onSelect: () => setLastAction("Item 菜单：详情"),
                                                value: "details-menu",
                                            },
                                        ],
                                    }, icon: _jsx(Info, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "info.circle", onPress: () => setLastAction("打开详情"), selectionId: "workspace-details", subtitle: "\u5E26\u6709 chevron \u7684\u5BFC\u822A\u884C", subtitleColor: "#64748b", subtitleFontSize: 12, title: "\u8BE6\u60C5", titleColor: "#7c3aed", titleFontSize: 18 }), _jsx(NativeListNavigationItem, { icon: _jsx(Users, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "person.2", onPress: () => setLastAction("打开成员管理"), subtitle: "\u9080\u8BF7\u3001\u89D2\u8272\u4E0E\u8BBF\u95EE\u6743\u9650", title: "\u6210\u5458" }), _jsx(NativeListItem, { icon: _jsx(CircleOff, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "nosign", onPress: () => setLastAction("点击编辑时不可选择的行"), selectionDisabled: true, selectionId: "workspace-non-selectable", subtitle: "\u7F16\u8F91\u6A21\u5F0F\u4E0B\u4E0D\u663E\u793A\u9009\u62E9\u6807\u8BB0\uFF0C\u4E5F\u4E0D\u4F1A\u52A0\u5165\u5DF2\u9009\u9879", title: "\u7F16\u8F91\u65F6\u4E0D\u53EF\u9009\u62E9" }), _jsx(NativeListItem, { disabled: true, selectionDisabled: true, icon: _jsx(CircleOff, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "nosign", subtitle: "disabled \u4F1A\u5728\u975E\u7F16\u8F91\u4E0E\u7F16\u8F91\u6A21\u5F0F\u4E2D\u5747\u7981\u7528\u6574\u884C", title: "\u59CB\u7EC8\u7981\u7528" })] }), _jsx(NativeListSection, { footer: "numberOfLines \u63A7\u5236\u53EF\u89C1\u9AD8\u5EA6\uFF1B\u8D85\u51FA\u5185\u5BB9\u53EF\u5728\u6574\u4E2A\u8F93\u5165\u533A\u57DF\u5185\u6EDA\u52A8\u3002", title: "\u5907\u6CE8", children: _jsx(NativeListTextAreaItem, { textAreaProps: {
                                    numberOfLines: 4,
                                    onChangeText: setWorkspaceNote,
                                    placeholder: "添加工作区备注",
                                    value: workspaceNote,
                                } }) }), _jsxs(NativeListSection, { footer: "Switch \u9002\u5408\u5373\u65F6\u751F\u6548\u7684\u72EC\u7ACB\u504F\u597D\u3002", title: "\u540C\u6B65", children: [_jsx(NativeListSwitchItem, { icon: _jsx(RefreshCw, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "arrow.clockwise", selectionId: "auto-sync", switchProps: { checked: autoSyncEnabled, onCheckedChange: setAutoSyncEnabled }, title: "\u81EA\u52A8\u540C\u6B65" }), _jsx(NativeListSelectItem, { icon: _jsx(Palette, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "paintpalette", selectProps: {
                                        onValueChange: setTheme,
                                        options: [
                                            { label: "浅色", value: "light" },
                                            { label: "深色", value: "dark" },
                                            { label: "跟随系统", value: "system" },
                                        ],
                                        value: theme ?? undefined,
                                    }, title: "\u4E3B\u9898\u6A21\u5F0F", valueColor: "#7c3aed", valueFontSize: 15 }), _jsx(NativeListSelectItem, { icon: _jsx(Timer, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "timer", selectProps: {
                                        onValueChange: setSyncInterval,
                                        options: [
                                            { label: "每 15 分钟", value: "15-minutes" },
                                            { label: "每小时", value: "hourly" },
                                            { label: "每天", value: "daily" },
                                        ],
                                        value: syncInterval ?? undefined,
                                    }, title: "\u540C\u6B65\u9891\u7387" }), _jsx(NativeListMenuItem, { icon: _jsx(MoreHorizontal, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), menuProps: {
                                        items: [
                                            {
                                                label: "立即同步",
                                                onSelect: () => setLastAction("立即同步"),
                                                value: "sync-now",
                                            },
                                            {
                                                label: "查看同步记录",
                                                onSelect: () => setLastAction("查看同步记录"),
                                                value: "view-sync-history",
                                            },
                                        ],
                                    }, sfSymbol: "ellipsis.circle", subtitle: "Menu \u4E0D\u7EF4\u62A4\u9009\u4E2D\u503C\uFF0C\u4EC5\u89E6\u53D1\u64CD\u4F5C", title: "\u540C\u6B65\u64CD\u4F5C", value: "\u66F4\u591A" }), _jsx(NativeListMenuItem, { icon: _jsx(MoreHorizontal, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), menuProps: {
                                        items: [
                                            {
                                                label: "立即同步",
                                                onSelect: () => setLastAction("立即同步"),
                                                value: "sync-now",
                                            },
                                            {
                                                label: "查看同步记录",
                                                onSelect: () => setLastAction("查看同步记录"),
                                                value: "view-sync-history",
                                            },
                                        ],
                                    }, sfSymbol: "ellipsis.circle", subtitle: "\u81EA\u5B9A\u4E49\u989C\u8272\u548C\u5927\u5C0F", title: "\u540C\u6B65\u64CD\u4F5C", value: "\u66F4\u591A", valueColor: "#7c3aed", valueFontSize: 15 })] }), _jsx(NativeListSection, { footer: "selected \u4E0E chevron={false} \u53EF\u7EC4\u5408\u6210\u4E92\u65A5\u9009\u62E9\u5217\u8868\u3002", title: "\u81EA\u52A8\u5907\u4EFD", children: NATIVE_LIST_BACKUP_OPTIONS.map(({ Icon, sfSymbol, title, value }) => (_jsx(NativeListItem, { chevron: false, icon: _jsx(Icon, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), onPress: () => setBackupInterval(value), selectionId: `backup-${value}`, selected: backupInterval === value, sfSymbol: sfSymbol, title: title }, value))) }), _jsxs(NativeListSection, { footer: "\u540C\u4E00\u4E2A Select \u53EF\u6839\u636E\u5E73\u53F0\u9009\u62E9\u4E0D\u540C\u7684\u539F\u751F picker \u5F62\u6001\u3002", title: "\u5E73\u53F0 picker", children: [_jsx(NativeListSelectItem, { icon: _jsx(ListFilter, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "line.3.horizontal.decrease.circle", selectProps: {
                                        onValueChange: setTheme,
                                        options: [
                                            { label: "浅色", value: "light" },
                                            { label: "深色", value: "dark" },
                                            { label: "跟随系统", value: "system" },
                                        ],
                                        placeholder: "选择主题模式",
                                        value: theme ?? undefined,
                                    }, title: "\u9ED8\u8BA4 Select" }), os() === "ios" ? (_jsx(NativeListSelectItem, { icon: _jsx(SlidersHorizontal, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "slider.horizontal.3", selectProps: {
                                        nativePickerMode: "wheel",
                                        onValueChange: setTheme,
                                        options: [
                                            { label: "浅色", value: "light" },
                                            { label: "深色", value: "dark" },
                                            { label: "跟随系统", value: "system" },
                                        ],
                                        placeholder: "选择主题模式",
                                        value: theme ?? undefined,
                                    }, title: "iOS Wheel" })) : null, os() === "android" ? (_jsx(NativeListSelectItem, { icon: _jsx(Smartphone, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), selectProps: {
                                        nativePickerMode: "dialog",
                                        onValueChange: setTheme,
                                        options: [
                                            { label: "浅色", value: "light" },
                                            { label: "深色", value: "dark" },
                                            { label: "跟随系统", value: "system" },
                                        ],
                                        placeholder: "选择主题模式",
                                        value: theme ?? undefined,
                                    }, title: "Android Dialog" })) : null, _jsx(NativeListSelectItem, { icon: _jsx(SlidersHorizontal, { color: NATIVE_LIST_ICON_COLOR, size: NATIVE_LIST_ICON_SIZE }), sfSymbol: "slider.horizontal.3", selectProps: {
                                        options: [{ label: "Item", value: "item" }],
                                        placeholder: "Item",
                                        value: "item",
                                    }, title: "\u4EC5\u4E00\u4E2AItem" })] })] }, native ? `native-list-${iosListStyle}` : "fallback-list")) : null }), _jsxs(Text, { numberOfLines: 2, opacity: 0.6, children: ["\u7F16\u8F91\u6A21\u5F0F\uFF1A", editMode ? `已选 ${selectedIds.length} 项` : "关闭", " \u00B7 iOS \u5B9E\u73B0\uFF1A \u7F16\u8F91\u56FE\u6807\uFF1A", customEditModeIcon ? "自定义" : "默认", " \u00B7 \u6700\u8FD1\u52A8\u4F5C\uFF1A", lastAction, " \u00B7 \u81EA\u52A8\u540C\u6B65\uFF1A", autoSyncEnabled ? "开启" : "关闭", " \u00B7 \u4E3B\u9898\uFF1A", theme ?? "未选择", " \u00B7 \u9891\u7387\uFF1A", syncInterval ?? "未选择", " \u00B7 \u5907\u4EFD\uFF1A", backupInterval, " \u00B7 \u540D\u79F0\uFF1A", workspaceName || "未填写", " \u00B7 \u5907\u6CE8\uFF1A", workspaceNote || "未填写"] })] }));
}
