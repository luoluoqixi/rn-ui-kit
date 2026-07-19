import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Backpack, Calendar, Check, ChevronRight, FilePlus, RefreshCw, Trash2, } from "@tamagui/lucide-icons-2";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { YStack } from "tamagui";
import { Accordion, AlertDialog, Avatar, Button, Card, Checkbox, ContextMenu, Dialog, Form, Image, Input, Label, Link, ListGroup, Menu, NativeList, NativeListItem, NativeListNavigationItem, NativeListSection, NativeListSelectItem, NativeListSwitchItem, NativeSheet, Popover, Progress, RadioGroup, ScrollView, Select, Separator, Sheet, Slider, Spinner, Switch, Tabs, TamaguiSlider, Text, TextArea, ToggleGroup, Tooltip, confirmNative, isWeb, os, useAppBackgroundColors, useToast, } from "rn-ui-kit/core";
function SectionCard({ children, description, title }) {
    return (_jsx(Card, { description: description, style: styles.card, title: title, children: _jsx(View, { style: styles.sectionBody, children: children }) }));
}
function DemoRow({ children }) {
    return _jsx(View, { style: styles.row, children: children });
}
function DemoBorderItem({ children, paddingVertical = 14, }) {
    return (_jsx(YStack, { borderColor: "$borderColor", style: [styles.demoBorderItem, { paddingVertical }], children: children }));
}
function DemoModalSheet({ content, native, onOpenChange, onPositionChange, open, position, snapPoints, snapPointsMode, }) {
    if (native) {
        return (_jsx(NativeSheet, { content: content, handle: true, modal: true, onOpenChange: onOpenChange, onPositionChange: onPositionChange, open: open, overlay: true, position: position, snapPoints: snapPoints, snapPointsMode: snapPointsMode }));
    }
    return (_jsx(Sheet, { content: content, dismissOnSnapToBottom: true, frameProps: { style: styles.sheetFrame }, handle: true, modal: true, onOpenChange: onOpenChange, onPositionChange: onPositionChange, open: open, overlay: true, position: position, snapPoints: snapPoints, snapPointsMode: snapPointsMode, transition: "200ms" }));
}
export function RnUiKitUiComponentsDebugPage({ header }) {
    const appBackgroundColors = useAppBackgroundColors();
    const { toast } = useToast();
    const [checkboxChecked, setCheckboxChecked] = useState(true);
    const [forceNativeHaptics, setForceNativeHaptics] = useState(true);
    const [contextMenuAction, setContextMenuAction] = useState("尚未选择");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOpen2, setDialogOpen2] = useState(false);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertDialogOpen2, setAlertDialogOpen2] = useState(false);
    const [formSubmitCount, setFormSubmitCount] = useState(0);
    const [inputValue, setInputValue] = useState("lonanote");
    const [menuAction, setMenuAction] = useState("尚未选择");
    const [menuMarkAsRead, setMenuMarkAsRead] = useState(true);
    const [menuNativeEnabled, setMenuNativeEnabled] = useState(true);
    const [menuSubOpen, setMenuSubOpen] = useState(false);
    const [radioValue, setRadioValue] = useState("recent");
    const [selectValue, setSelectValue] = useState("blue");
    const [selectValue2, setSelectValue2] = useState("light");
    const [nativeListSingleChoice, setNativeListSingleChoice] = useState("four-minutes");
    const [nativeDialogResult, setNativeDialogResult] = useState("尚未触发");
    const [selectGroupedValue, setSelectGroupedValue] = useState("edit-desc");
    const [selectNativePickerValue, setSelectNativePickerValue] = useState("blue");
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetPosition, setSheetPosition] = useState(0);
    const [sheetNativeEnabled, setSheetNativeEnabled] = useState(true);
    const [explicitNativeSheetOpen, setExplicitNativeSheetOpen] = useState(false);
    const [explicitNativeSheetPosition, setExplicitNativeSheetPosition] = useState(0);
    const [explicitSheetOpen, setExplicitSheetOpen] = useState(false);
    const [explicitSheetPosition, setExplicitSheetPosition] = useState(0);
    const [percentSheetOpen, setPercentSheetOpen] = useState(false);
    const [percentSheetPosition, setPercentSheetPosition] = useState(0);
    const [constantSheetOpen, setConstantSheetOpen] = useState(false);
    const [constantSheetPosition, setConstantSheetPosition] = useState(0);
    const [fitSheetOpen, setFitSheetOpen] = useState(false);
    const [fitSheetPosition, setFitSheetPosition] = useState(0);
    const [mixedSheetOpen, setMixedSheetOpen] = useState(false);
    const [mixedSheetPosition, setMixedSheetPosition] = useState(0);
    const [nestedGlobalSheetOpen, setNestedGlobalSheetOpen] = useState(false);
    const [nestedGlobalSheetPosition, setNestedGlobalSheetPosition] = useState(0);
    const [sliderValue, setSliderValue] = useState(56);
    const [tamaguiSliderValue, setTamaguiSliderValue] = useState(56);
    const [nativeSliderValue, setNativeSliderValue] = useState(50);
    const [switchValue, setSwitchValue] = useState(true);
    const [toastNativeEnabled, setToastNativeEnabled] = useState(true);
    const [tabsValue, setTabsValue] = useState("preview");
    const [textAreaValue, setTextAreaValue] = useState("这是一段文本区域示例。");
    const [toggleValue, setToggleValue] = useState("bold");
    const [popoverName, setPopoverName] = useState("LonaNote");
    const debugNativeHaptics = forceNativeHaptics ? true : undefined;
    const withToastNative = (options) => ({
        ...options,
        native: toastNativeEnabled,
    });
    const selectItems = useMemo(() => [
        { label: "蓝色", value: "blue" },
        { label: "绿色", value: "green" },
        { label: "橙色", value: "orange" },
        { label: "粉色", value: "pink" },
        { label: "红色", value: "red" },
        { label: "白色", value: "white" },
        { label: "黑色", value: "black" },
        { label: "紫色", value: "purple" },
        { label: "黄色", value: "yellow" },
        { label: "灰色", value: "gray" },
        { label: "棕色", value: "brown" },
        { label: "青色", value: "cyan" },
        { label: "靛色", value: "indigo" },
        { label: "金色", value: "gold" },
        { label: "银色", value: "silver" },
    ], []);
    const selectItems2 = useMemo(() => [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
    ], []);
    const selectSortGroups = useMemo(() => [
        {
            items: [
                { label: "文件名 (A-Z)", value: "name-asc" },
                { label: "文件名 (Z-A)", value: "name-desc" },
            ],
        },
        {
            items: [
                { label: "编辑时间 (从新到旧)", value: "edit-desc" },
                { label: "编辑时间 (从旧到新)", value: "edit-asc" },
            ],
        },
        {
            items: [
                { label: "创建时间 (从新到旧)", value: "create-desc" },
                { label: "创建时间 (从旧到新)", value: "create-asc" },
            ],
        },
    ], []);
    const sheetItems = useMemo(() => ["最近工作区", "主题与外观", "同步状态", "导出设置", "快捷键说明"], []);
    const handleSheetOpenChange = (nextOpen) => {
        setSheetOpen(nextOpen);
    };
    const handleSheetPositionChange = (nextPosition) => {
        setSheetPosition(nextPosition);
    };
    const resetNestedGlobalSheet = () => {
        setNestedGlobalSheetOpen(false);
        setNestedGlobalSheetPosition(0);
    };
    const handlePercentSheetOpenChange = (nextOpen) => {
        setPercentSheetOpen(nextOpen);
        if (!nextOpen) {
            resetNestedGlobalSheet();
        }
    };
    const handlePercentSheetPositionChange = (nextPosition) => {
        setPercentSheetPosition(nextPosition);
    };
    const handleConstantSheetOpenChange = (nextOpen) => {
        setConstantSheetOpen(nextOpen);
    };
    const handleConstantSheetPositionChange = (nextPosition) => {
        setConstantSheetPosition(nextPosition);
    };
    const handleFitSheetOpenChange = (nextOpen) => {
        setFitSheetOpen(nextOpen);
    };
    const handleFitSheetPositionChange = (nextPosition) => {
        setFitSheetPosition(nextPosition);
    };
    const handleMixedSheetOpenChange = (nextOpen) => {
        setMixedSheetOpen(nextOpen);
    };
    const handleMixedSheetPositionChange = (nextPosition) => {
        setMixedSheetPosition(nextPosition);
    };
    const handleNestedGlobalSheetOpenChange = (nextOpen) => {
        setNestedGlobalSheetOpen(nextOpen);
    };
    const handleNestedGlobalSheetPositionChange = (nextPosition) => {
        setNestedGlobalSheetPosition(nextPosition);
    };
    const showBasicNativeDialog = async () => {
        const result = await confirmNative({
            cancelText: "稍后",
            confirmText: "保存",
            message: "当前草稿还没有写入本地文件。",
            title: "保存更改",
        });
        setNativeDialogResult(`普通确认：${result}`);
    };
    const showDestructiveNativeDialog = async () => {
        const result = await confirmNative({
            confirmText: "删除",
            destructive: true,
            message: "删除后仅用于演示，不会真的移除文件。",
            title: "删除笔记",
        });
        setNativeDialogResult(`危险操作：${result}`);
    };
    const showMultiButtonNativeDialog = async () => {
        const result = await confirmNative({
            buttons: [
                { key: "cancel", style: "cancel", text: "取消" },
                { key: "archive", text: "归档" },
                { key: "delete", style: "destructive", text: "删除" },
            ],
            message: "系统弹窗最多适合放少量明确动作。",
            title: "处理当前笔记",
        });
        setNativeDialogResult(`多按钮：${result}`);
    };
    const showInfoToast = () => {
        toast.info("检测到新版本", withToastNative({
            description: "设置页里可以查看本次更新内容。",
        }));
    };
    const showWarningToast = () => {
        toast.warning("存储空间不足", withToastNative({
            description: "建议清理附件缓存后继续导入大文件。",
        }));
    };
    const showLoadingToast = () => {
        const toastId = toast.loading("正在生成离线索引", withToastNative({
            description: "请稍候，完成后会自动提示。",
            duration: Number.POSITIVE_INFINITY,
        }));
        setTimeout(() => {
            toast.close(toastId);
            toast.success("离线索引已生成", withToastNative({
                description: "最近修改的 128 个文件已经可以离线检索。",
            }));
        }, 1600);
    };
    const showCustomToast = () => {
        toast.custom(() => (_jsxs(View, { style: styles.customToast, children: [_jsx(Text, { fontSize: "$4", fontWeight: "700", children: "\u81EA\u5B9A\u4E49 Toast" }), _jsx(Text, { color: "$color", opacity: 0.6, children: "\u8FD9\u91CC\u53EF\u4EE5\u653E\u4EFB\u610F JSX\uFF0C\u4F8B\u5982\u66F4\u4E30\u5BCC\u7684\u6392\u7248\u3001\u56FE\u6807\u7EC4\u5408\u6216\u72B6\u6001\u6458\u8981\u3002" })] })), {
            duration: 6000,
        });
    };
    const showPromiseToast = () => {
        toast.promise(new Promise((resolve) => {
            setTimeout(() => {
                resolve({ refreshedFiles: 42 });
            }, 1500);
        }), {
            loading: "正在同步工作区",
            success: "同步完成",
            error: "同步失败",
            native: toastNativeEnabled,
            description: (result) => {
                if (result instanceof Error) {
                    return "请检查当前工作区路径是否仍然可访问。";
                }
                return `已刷新 ${result.refreshedFiles} 个文件的索引状态。`;
            },
        });
    };
    return (_jsxs(View, { style: styles.root, children: [header, _jsxs(SectionCard, { description: "\u6309\u94AE\u3001\u72B6\u6001\u5207\u6362\u548C\u52A0\u8F7D\u53CD\u9988\u3002", title: "\u52A8\u4F5C\u4E0E\u53CD\u9988", children: [_jsxs(View, { style: styles.demoGroup, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "Native Haptics" }), _jsx(View, { style: styles.checkboxGroup, children: _jsx(Checkbox, { checked: forceNativeHaptics, label: "\u9707\u52A8", onCheckedChange: (checked) => setForceNativeHaptics(checked === true), size: "$4" }) })] }), _jsxs(View, { style: styles.demoGroup, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "Button" }), _jsxs(DemoRow, { children: [_jsx(Button, { chromeless: true, nativeHaptics: debugNativeHaptics, children: "Plain" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, theme: "accent", children: "Active" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, variant: "outlined", children: "Outlined" }), _jsx(Button, { disabled: true, nativeHaptics: debugNativeHaptics, children: "Disabled" })] }), _jsxs(DemoRow, { children: [_jsx(Button, { icon: Calendar, nativeHaptics: debugNativeHaptics, children: "icon" }), _jsx(Button, { iconAfter: ChevronRight, nativeHaptics: debugNativeHaptics, children: "iconAfter" }), _jsx(Button, { icon: RefreshCw, nativeHaptics: debugNativeHaptics, theme: "green", children: "Themed" }), _jsx(Button, { circular: true, icon: Check, "aria-label": "\u786E\u8BA4", nativeHaptics: debugNativeHaptics }), _jsx(Button, { icon: Backpack, iconSize: "$2", nativeHaptics: debugNativeHaptics, theme: "blue", children: "Blue" }), _jsx(Button, { iconAfter: Trash2, nativeHaptics: debugNativeHaptics, theme: "red", children: "Red" }), _jsx(Button, { native: true, nativeHaptics: debugNativeHaptics, children: "Native Button" })] })] }), _jsxs(View, { style: styles.demoGroup, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "Checkbox" }), _jsx(View, { style: styles.checkboxGroup, children: _jsx(Checkbox, { checked: checkboxChecked, label: "Accept terms and conditions", nativeHaptics: debugNativeHaptics, onCheckedChange: (checked) => setCheckboxChecked(checked === true), size: "$4" }) })] }), _jsxs(DemoRow, { children: [_jsx(Spinner, {}), _jsx(Spinner, { size: "large", color: "$yellow10" }), _jsx(Switch, { checked: switchValue, label: "Switch", labelPosition: "end", native: false, nativeHaptics: debugNativeHaptics, onCheckedChange: setSwitchValue }), !isWeb() && (_jsx(Switch, { checked: switchValue, label: "Switch native", labelPosition: "end", native: true, nativeHaptics: debugNativeHaptics, onCheckedChange: setSwitchValue }))] }), _jsxs(View, { style: styles.demoGroup, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "Toast" }), !isWeb() && (_jsx(DemoRow, { children: _jsx(Switch, { checked: toastNativeEnabled, label: "\u539F\u751F Toast", labelPosition: "end", native: true, nativeHaptics: debugNativeHaptics, onCheckedChange: setToastNativeEnabled }) })), _jsxs(DemoRow, { children: [_jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => toast.message("已保存草稿", withToastNative({
                                            description: "状态栏与编辑区内容已同步。",
                                        })), variant: "outlined", children: "Message" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => toast.success("同步完成", withToastNative({
                                            description: "全部文件已经更新到本地索引。",
                                        })), theme: "green", children: "Success" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => toast.success("同步完成", withToastNative({
                                            description: "已同步。",
                                        })), theme: "green", children: "Success Short" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => toast.error("导出失败", withToastNative({
                                            description: "目标目录没有写入权限。",
                                        })), theme: "red", children: "Error" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: showInfoToast, variant: "outlined", children: "Info" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: showWarningToast, variant: "outlined", children: "Warning" })] }), _jsxs(DemoRow, { children: [_jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: showLoadingToast, variant: "outlined", children: "Loading" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: showCustomToast, variant: "outlined", children: "Custom" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: showPromiseToast, variant: "outlined", children: "Promise" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => toast.closeAll(), chromeless: true, children: "Close all" })] })] }), _jsxs(View, { style: styles.demoGroup, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "ToggleGroup" }), _jsx(DemoRow, { children: _jsx(ToggleGroup, { items: [
                                        { label: "B", value: "bold" },
                                        { label: "I", value: "italic" },
                                        { label: "~", value: "test" },
                                    ], nativeHaptics: debugNativeHaptics, onValueChange: setToggleValue, type: "single", value: toggleValue }) })] }), _jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Progress" }), _jsx(Progress, { max: 100, size: "$4", value: 60, width: "100%", children: _jsx(Progress.Indicator, {}) }), _jsx(Text, { color: "$color", children: "\u5F53\u524D\u8FDB\u5EA6\uFF1A60%" })] }), _jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Slider Replica" }), _jsx(Slider, { max: 100, min: 0, native: false, nativeHaptics: debugNativeHaptics, onValueChange: (nextValue) => setSliderValue(nextValue[0] ?? 0), value: [sliderValue] }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u503C\uFF1A", sliderValue] })] }), _jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Slider Tamagui" }), _jsx(TamaguiSlider, { max: 100, min: 0, nativeHaptics: debugNativeHaptics, onValueChange: (nextValue) => setTamaguiSliderValue(nextValue[0] ?? 0), value: [tamaguiSliderValue] }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u503C\uFF1A", tamaguiSliderValue] })] }), !isWeb() && (_jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Slider Native\uFF08@expo/ui SwiftUI / Material3\uFF09" }), _jsx(Slider, { max: 100, min: 0, native: true, nativeHaptics: debugNativeHaptics, onValueChange: (nextValue) => setNativeSliderValue(nextValue[0] ?? 0), value: [nativeSliderValue] }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u503C\uFF1A", nativeSliderValue] })] }))] }), _jsxs(SectionCard, { description: "\u6587\u672C\u8F93\u5165\u3001\u591A\u884C\u8F93\u5165\u3001\u9009\u62E9\u5668\u548C\u6ED1\u6746\u3002", title: "\u8F93\u5165\u4E0E\u9009\u62E9", children: [_jsxs(View, { style: styles.fieldGroup, children: [_jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Input" }), _jsx(Input, { onChangeText: setInputValue, placeholder: "account", value: inputValue })] }), _jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "TextArea" }), _jsx(TextArea, { onChangeText: setTextAreaValue, placeholder: "\u8F93\u5165\u5907\u6CE8", rows: 4, value: textAreaValue })] })] }), _jsxs(View, { style: styles.fieldGroup, children: [_jsxs(View, { style: styles.field, children: [!isWeb() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Select (native-sheet)" }), _jsx(Select, { items: selectItems, native: "native-sheet", nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsx(Label, { children: "Select (custom-sheet)" }), _jsx(Select, { items: selectItems, native: "custom-sheet", nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined })] })), isWeb() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Select (sheet)" }), _jsx(Select, { items: selectItems, native: "native-sheet", nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined })] })), _jsx(Select, { items: selectItems, native: "native-sheet", nativeTrigger: true, nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272\uFF1A", selectValue ?? "未选择"] })] }), !isWeb() && (_jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Select Native (Dropdown)" }), _jsx(Select, { items: selectItems, native: true, nativePickerMode: "dropdown", nativeHaptics: debugNativeHaptics, onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsx(Select, { items: selectItems, native: true, nativeTrigger: true, nativePickerMode: "dropdown", nativeHaptics: debugNativeHaptics, onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272(\u539F\u751F)\uFF1A", selectNativePickerValue ?? "未选择"] })] })), isWeb() && (_jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Select (\u957F\u5217\u8868)" }), _jsx(Select, { items: selectItems, native: false, nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsx(Select, { items: selectItems, native: false, nativeTrigger: true, nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272\uFF1A", selectValue ?? "未选择"] })] })), os() === "ios" && (_jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Select Native (Wheel Sheet)" }), _jsx(Select, { items: selectItems, native: true, nativePickerMode: "wheel", nativeHaptics: debugNativeHaptics, onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsx(Select, { items: selectItems, native: true, nativeTrigger: true, nativePickerMode: "wheel", nativeHaptics: debugNativeHaptics, onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272(\u539F\u751F Sheet)\uFF1A", selectNativePickerValue ?? "未选择"] })] })), os() === "android" && (_jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Select Native (Dialog)" }), _jsx(Select, { items: selectItems, native: true, nativePickerMode: "dialog", nativeHaptics: debugNativeHaptics, onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsx(Select, { items: selectItems, native: true, nativeTrigger: true, nativePickerMode: "dialog", nativeHaptics: debugNativeHaptics, onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272(\u539F\u751F)\uFF1A", selectNativePickerValue ?? "未选择"] })] })), _jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Select" }), _jsx(Select, { items: selectItems2, native: false, nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined }), _jsx(Select, { items: selectItems2, native: false, nativeTrigger: true, nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\uFF1A", selectValue2 ?? "未选择"] })] }), _jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Select Native" }), _jsx(Select, { items: selectItems2, nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined, native: true }), _jsx(Select, { items: selectItems2, nativeTrigger: true, nativeHaptics: debugNativeHaptics, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined, native: true }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898(\u539F\u751F)\uFF1A", selectValue2 ?? "未选择"] })] }), _jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Select Grouped" }), _jsx(Select, { native: false, itemGroups: selectSortGroups, nativeHaptics: debugNativeHaptics, onValueChange: setSelectGroupedValue, placeholder: "\u9009\u62E9\u6392\u5E8F\u65B9\u5F0F", value: selectGroupedValue ?? undefined }), _jsx(Select, { native: false, nativeTrigger: true, itemGroups: selectSortGroups, nativeHaptics: debugNativeHaptics, onValueChange: setSelectGroupedValue, placeholder: "\u9009\u62E9\u6392\u5E8F\u65B9\u5F0F", value: selectGroupedValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u6392\u5E8F\uFF1A", selectGroupedValue ?? "未选择"] })] })] }), _jsxs(View, { style: styles.field, children: [_jsx(Label, { children: "Form" }), _jsx(Form, { onSubmit: () => setFormSubmitCount((count) => count + 1), trigger: _jsx(Button, { nativeHaptics: debugNativeHaptics, children: "\u63D0\u4EA4\u8868\u5355" }), children: _jsxs(View, { style: styles.formContent, children: [_jsx(Input, { onChangeText: setInputValue, placeholder: "workspace name", value: inputValue }), _jsxs(Text, { color: "$color", children: ["\u5DF2\u901A\u8FC7 Form \u63D0\u4EA4\uFF1A", formSubmitCount, " \u6B21"] })] }) })] })] }), _jsxs(SectionCard, { description: "\u4F7F\u7528 wrapper \u9ED8\u8BA4\u7EC4\u5408 API\uFF0C\u4E0D\u5728\u4E1A\u52A1\u5C42\u624B\u52A8\u62FC\u5185\u90E8\u7ED3\u6784\u3002", title: "\u7EC4\u5408\u63A7\u4EF6", children: [_jsx(RadioGroup, { items: [
                            { label: "最近更新", value: "recent" },
                            { label: "按名称", value: "name" },
                            { label: "按大小", value: "size" },
                        ], nativeHaptics: debugNativeHaptics, onValueChange: setRadioValue, value: radioValue }), _jsx(Tabs, { items: [
                            {
                                content: _jsxs(Text, { children: ["\u5F53\u524D\u9009\u4E2D\u7684 tab \u662F ", tabsValue] }),
                                label: "预览",
                                value: "preview",
                            },
                            {
                                content: _jsx(Text, { children: "Tabs \u9ED8\u8BA4 API \u8D1F\u8D23\u751F\u6210 List\u3001Trigger \u548C Content\u3002" }),
                                label: "说明",
                                value: "notes",
                            },
                        ], nativeHaptics: debugNativeHaptics, onValueChange: setTabsValue, value: tabsValue }), _jsx(Accordion, { items: [
                            {
                                content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4 API \u8D1F\u8D23\u751F\u6210 Item\u3001Header\u3001Trigger \u548C Content\u3002" }),
                                title: "展开面板 single1",
                                value: "panel1",
                            },
                            {
                                content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4 API \u8D1F\u8D23\u751F\u6210 Item\u3001Header\u3001Trigger \u548C Content\u3002" }),
                                title: "展开面板 single2",
                                value: "panel2",
                            },
                            {
                                content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4 API \u8D1F\u8D23\u751F\u6210 Item\u3001Header\u3001Trigger \u548C Content\u3002" }),
                                title: "展开面板 single3",
                                value: "panel3",
                            },
                            {
                                content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4 API \u8D1F\u8D23\u751F\u6210 Item\u3001Header\u3001Trigger \u548C Content\u3002" }),
                                title: "展开面板 single4",
                                value: "panel4",
                            },
                        ], nativeHaptics: debugNativeHaptics, type: "single" }), _jsx(Accordion, { items: [
                            {
                                content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4 API \u8D1F\u8D23\u751F\u6210 Item\u3001Header\u3001Trigger \u548C Content\u3002" }),
                                title: "展开面板 multiple1",
                                value: "panel1",
                            },
                            {
                                content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4 API \u8D1F\u8D23\u751F\u6210 Item\u3001Header\u3001Trigger \u548C Content\u3002" }),
                                title: "展开面板 multiple2",
                                value: "panel2",
                            },
                            {
                                content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4 API \u8D1F\u8D23\u751F\u6210 Item\u3001Header\u3001Trigger \u548C Content\u3002" }),
                                title: "展开面板 multiple3",
                                value: "panel3",
                            },
                            {
                                content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4 API \u8D1F\u8D23\u751F\u6210 Item\u3001Header\u3001Trigger \u548C Content\u3002" }),
                                title: "展开面板 multiple4",
                                value: "panel4",
                            },
                        ], nativeHaptics: debugNativeHaptics, type: "multiple" })] }), _jsxs(SectionCard, { description: "\u5F39\u5C42\u7C7B\u7EC4\u4EF6\u652F\u6301\u7B80\u5355\u5165\u53E3\uFF1BMenu \u989D\u5916\u5C55\u793A\u5B98\u65B9\u98CE\u683C\u7684\u590D\u5408 API \u548C\u591A\u5C42\u5B50\u83DC\u5355\u3002", title: "\u6D6E\u5C42\u4E0E\u83DC\u5355", children: [_jsxs(DemoRow, { children: [_jsx(Dialog, { onOpenChange: setDialogOpen, open: dialogOpen, title: "Dialog \u6807\u9898", trigger: _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setDialogOpen(true), children: "\u6253\u5F00 Dialog" }), children: _jsx(Text, { children: "\u8FD9\u662F Dialog \u5185\u5BB9\u533A\u57DF\u3002" }) }), _jsx(Dialog, { onOpenChange: setDialogOpen2, open: dialogOpen2, title: "Dialog \u6807\u9898", trigger: _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setDialogOpen2(true), children: "\u6253\u5F00 Dialog No OverlayPress" }), dismissOnOverlayPress: false, children: _jsx(Text, { children: "\u8FD9\u662F Dialog \u5185\u5BB9\u533A\u57DF\u3002" }) }), _jsx(AlertDialog, { cancelLabel: "\u53D6\u6D88", destructiveLabel: "\u5220\u9664", description: "\u8FD9\u4E2A\u64CD\u4F5C\u65E0\u6CD5\u64A4\u9500\uFF0C\u4EC5\u7528\u4E8E\u5C55\u793A\u7EC4\u4EF6\u7ED3\u6784\u3002", onOpenChange: setAlertDialogOpen, open: alertDialogOpen, title: "\u5220\u9664\u786E\u8BA4", trigger: _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setAlertDialogOpen(true), children: "\u6253\u5F00 AlertDialog" }) }), _jsx(AlertDialog, { cancelLabel: "\u53D6\u6D88", destructiveLabel: "\u5220\u9664", description: "\u8FD9\u4E2A\u64CD\u4F5C\u65E0\u6CD5\u64A4\u9500\uFF0C\u4EC5\u7528\u4E8E\u5C55\u793A\u7EC4\u4EF6\u7ED3\u6784\u3002", onOpenChange: setAlertDialogOpen2, open: alertDialogOpen2, title: "\u5220\u9664\u786E\u8BA4", trigger: _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setAlertDialogOpen2(true), children: "\u6253\u5F00 AlertDialog OverlayPress" }), dismissOnOverlayPress: true })] }), _jsxs(DemoRow, { children: [_jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: showBasicNativeDialog, children: "\u539F\u751F\u786E\u8BA4" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: showDestructiveNativeDialog, theme: "red", children: "\u539F\u751F\u5371\u9669\u786E\u8BA4" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: showMultiButtonNativeDialog, variant: "outlined", children: "\u539F\u751F\u4E09\u6309\u94AE" }), _jsx(Text, { color: "$color", children: nativeDialogResult })] }), _jsxs(DemoRow, { children: [_jsx(Popover, { arrow: true, content: _jsxs(View, { style: styles.popoverContent, children: [_jsxs(View, { style: styles.popoverFieldRow, children: [_jsx(Text, { style: styles.popoverFieldLabel, children: "Name" }), _jsx(Input, { onChangeText: setPopoverName, placeholder: "\u8BF7\u8F93\u5165\u540D\u79F0", style: styles.popoverFieldInput, value: popoverName })] }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setMenuAction(`Popover submit: ${popoverName}`), children: "Submit" })] }), trigger: _jsx(Button, { nativeHaptics: debugNativeHaptics, variant: "outlined", children: "\u6253\u5F00 Popover" }) }), _jsx(Menu, { arrow: true, items: [
                                    {
                                        label: "关于笔记",
                                        onSelect: () => setMenuAction("快捷 Menu: 关于笔记"),
                                        value: "quick-about-notes",
                                    },
                                    {
                                        label: "separator",
                                        separator: true,
                                        value: "quick-separator-main",
                                    },
                                    {
                                        label: "设置",
                                        onSelect: () => setMenuAction("快捷 Menu: 设置"),
                                        value: "quick-settings",
                                    },
                                    {
                                        destructive: true,
                                        label: "删除全部",
                                        onSelect: () => setMenuAction("快捷 Menu: 删除全部"),
                                        value: "quick-delete-all",
                                    },
                                ], trigger: _jsx(Button, { icon: Backpack, nativeHaptics: debugNativeHaptics, size: "$4", variant: "outlined", children: "\u6253\u5F00\u5FEB\u6377 Menu" }) }), _jsxs(Menu, { children: [_jsx(Menu.Trigger, { children: _jsx(Button, { icon: Backpack, nativeHaptics: debugNativeHaptics, size: "$4", variant: "outlined", children: "\u6253\u5F00\u590D\u6742 Menu" }) }), _jsx(Menu.Portal, { zIndex: 100, children: _jsxs(Menu.Content, { children: [_jsx(Menu.Arrow, {}), _jsxs(Menu.ScrollView, { children: [_jsx(Menu.Item, { onSelect: () => setMenuAction("关于笔记"), children: _jsx(Menu.ItemTitle, { children: "\u5173\u4E8E\u7B14\u8BB0" }) }, "about-notes"), _jsx(Menu.Separator, {}), _jsx(Menu.Item, { onSelect: () => setMenuAction("设置"), children: _jsx(Menu.ItemTitle, { children: "\u8BBE\u7F6E" }) }, "settings"), _jsxs(Menu.Item, { justify: "space-between", onSelect: () => setMenuAction("日历"), textValue: "\u65E5\u5386", children: [_jsx(Menu.ItemTitle, { children: "\u65E5\u5386" }), _jsx(Menu.ItemIcon, { children: _jsx(Calendar, { color: "$color10", size: 14 }) })] }, "calendar"), _jsx(Menu.Separator, {}), _jsx(Menu.Item, { disabled: true, children: _jsx(Menu.ItemTitle, { color: "$color", children: "\u9501\u5B9A\u7B14\u8BB0" }) }, "locked-notes"), _jsx(Menu.Item, { destructive: true, onSelect: () => setMenuAction("删除全部"), children: _jsx(Menu.ItemTitle, { color: "$red10", children: "\u5220\u9664\u5168\u90E8" }) }, "delete-all"), _jsx(Menu.Separator, {}), _jsxs(Menu.Sub, { onOpenChange: setMenuSubOpen, open: menuSubOpen, children: [_jsxs(Menu.SubTrigger, { justify: "space-between", textValue: "\u64CD\u4F5C", children: [_jsx(Menu.ItemTitle, { children: "\u64CD\u4F5C" }), _jsx(ChevronRight, { color: "$color10", size: 16 })] }, "actions-trigger"), _jsx(Menu.Portal, { zIndex: 200, children: _jsxs(Menu.SubContent, { children: [_jsx(Menu.Label, { children: "\u7B14\u8BB0\u8BBE\u7F6E" }), _jsxs(Menu.Item, { justify: "space-between", onSelect: () => setMenuAction("新建笔记"), textValue: "\u65B0\u5EFA\u7B14\u8BB0", children: [_jsx(Menu.ItemTitle, { children: "\u65B0\u5EFA\u7B14\u8BB0" }), _jsx(Menu.ItemIcon, { children: _jsx(FilePlus, { color: "$color10", size: 14 }) })] }, "create-note"), _jsxs(Menu.Item, { justify: "space-between", onSelect: () => setMenuAction("删除所有笔记"), textValue: "\u5220\u9664\u6240\u6709\u7B14\u8BB0", children: [_jsx(Menu.ItemTitle, { children: "\u5220\u9664\u6240\u6709\u7B14\u8BB0" }), _jsx(Menu.ItemIcon, { children: _jsx(Trash2, { color: "$color10", size: 14 }) })] }, "delete-all-notes"), _jsxs(Menu.Item, { justify: "space-between", onSelect: () => setMenuAction("同步笔记"), textValue: "\u540C\u6B65\u7B14\u8BB0", children: [_jsx(Menu.ItemTitle, { children: "\u540C\u6B65\u7B14\u8BB0" }), _jsx(Menu.ItemIcon, { children: _jsx(RefreshCw, { color: "$color10", size: 14 }) })] }, "sync-notes")] }) })] }), _jsx(Menu.Separator, {}), _jsxs(Menu.CheckboxItem, { checked: menuMarkAsRead, justify: "space-between", onCheckedChange: setMenuMarkAsRead, onSelect: () => setMenuAction(menuMarkAsRead ? "取消标记已读" : "标记为已读"), textValue: "\u6807\u8BB0\u4E3A\u5DF2\u8BFB", children: [_jsx(Menu.ItemTitle, { children: "\u6807\u8BB0\u4E3A\u5DF2\u8BFB" }), _jsx(Menu.ItemIndicator, { children: _jsx(Check, { color: "$color10", size: 12 }) })] }, "mark-as-read"), _jsxs(Menu.CheckboxItem, { checked: menuNativeEnabled, justify: "space-between", onCheckedChange: setMenuNativeEnabled, onSelect: () => setMenuAction(menuNativeEnabled ? "关闭 Native 菜单" : "启用 Native 菜单"), textValue: "\u542F\u7528 Native \u83DC\u5355", children: [_jsx(Menu.ItemTitle, { children: "\u542F\u7528 Native \u83DC\u5355" }), _jsx(Menu.ItemIndicator, { children: _jsx(Check, { color: "$color10", size: 12 }) })] }, "enable-native")] })] }) })] })] }), _jsxs(DemoRow, { children: [_jsx(Tooltip, { arrow: true, content: "Tooltip \u5728 web \u4E0B\u4F1A\u663E\u793A\uFF0C\u5728 native \u4E0B\u4E3B\u8981\u8F93\u51FA\u53EF\u8BBF\u95EE\u6027\u8BED\u4E49\u3002", children: _jsx(Button, { nativeHaptics: debugNativeHaptics, variant: "outlined", children: "\u60AC\u505C Tooltip" }) }), _jsx(ContextMenu, { arrow: true, items: [
                                    {
                                        label: "重命名工作区",
                                        onSelect: () => setContextMenuAction("重命名工作区"),
                                        value: "rename-workspace",
                                    },
                                    {
                                        label: "separator",
                                        separator: true,
                                        value: "separator-main",
                                    },
                                    {
                                        destructive: true,
                                        label: "移除工作区",
                                        onSelect: () => setContextMenuAction("移除工作区"),
                                        value: "remove-workspace",
                                    },
                                ], nativeHaptics: debugNativeHaptics, trigger: _jsx(Button, { variant: "outlined", children: "\u53F3\u952E / \u957F\u6309 ContextMenu" }) }), _jsx(DemoRow, { children: _jsx(Switch, { checked: sheetNativeEnabled, label: "Sheet native", labelPosition: "end", onCheckedChange: setSheetNativeEnabled }) }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => {
                                    setSheetPosition(0);
                                    setSheetOpen(true);
                                }, variant: "outlined", children: "\u6253\u5F00 inline Sheet" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => {
                                    setPercentSheetPosition(0);
                                    setPercentSheetOpen(true);
                                }, variant: "outlined", children: "\u6253\u5F00\u5168\u5C40 Sheet percent" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => {
                                    setConstantSheetPosition(0);
                                    setConstantSheetOpen(true);
                                }, variant: "outlined", children: "\u6253\u5F00\u5168\u5C40 Sheet constant" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => {
                                    setFitSheetPosition(0);
                                    setFitSheetOpen(true);
                                }, variant: "outlined", children: "\u6253\u5F00\u5168\u5C40 Sheet fit" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => {
                                    setMixedSheetPosition(0);
                                    setMixedSheetOpen(true);
                                }, variant: "outlined", children: "\u6253\u5F00\u5168\u5C40 Sheet mixed" })] }), _jsxs(Text, { color: "$color", children: ["inline Sheet \u72B6\u6001\uFF1A", sheetOpen ? `打开，position=${sheetPosition}` : "关闭"] }), _jsxs(Text, { color: "$color", children: ["\u5168\u5C40 Sheet percent\uFF1A", percentSheetOpen ? `打开，position=${percentSheetPosition}` : "关闭"] }), _jsxs(Text, { color: "$color", children: ["\u5168\u5C40 Sheet constant\uFF1A", constantSheetOpen ? `打开，position=${constantSheetPosition}` : "关闭"] }), _jsxs(Text, { color: "$color", children: ["\u5168\u5C40 Sheet fit\uFF1A", fitSheetOpen ? `打开，position=${fitSheetPosition}` : "关闭"] }), _jsxs(Text, { color: "$color", children: ["\u5168\u5C40 Sheet mixed\uFF1A", mixedSheetOpen ? `打开，position=${mixedSheetPosition}` : "关闭"] }), _jsxs(Text, { color: "$color", children: ["\u663E\u5F0F NativeSheet\uFF1A", explicitNativeSheetOpen ? "打开" : "关闭"] }), _jsxs(Text, { color: "$color", children: ["\u663E\u5F0F Sheet\uFF1A", explicitSheetOpen ? "打开" : "关闭"] }), _jsxs(YStack, { borderColor: "$borderColor", style: styles.sheetDemoHost, children: [_jsx(Text, { color: "$color", children: "\u8FD9\u4E2A\u793A\u4F8B\u5728\u8C03\u8BD5\u9762\u677F Dialog \u5185\u4EE5 inline \u6A21\u5F0F\u6E32\u67D3\uFF0C\u5E76\u901A\u8FC7 wrapper \u7684\u9ED8\u8BA4\u7EC4\u5408 API \u751F\u6210\u7ED3\u6784\u3002" }), _jsx(View, { style: styles.sheetDemoStage, children: _jsx(Sheet.Controller, { hidden: false, onOpenChange: handleSheetOpenChange, open: sheetOpen, children: _jsx(Sheet, { content: sheetItems.map((item) => (_jsx(DemoBorderItem, { children: _jsx(Text, { children: item }) }, item))), dismissOnSnapToBottom: true, frameProps: { style: styles.sheetFrame }, handle: true, modal: false, onOpenChange: handleSheetOpenChange, onPositionChange: handleSheetPositionChange, open: sheetOpen, overlay: true, overlayProps: {
                                            bg: "$shadow6",
                                            enterStyle: { opacity: 0 },
                                            exitStyle: { opacity: 0 },
                                            transition: "lazy",
                                        }, position: sheetPosition, scrollView: true, scrollViewProps: { contentContainerStyle: styles.sheetScrollContent }, snapPoints: ["76%", "56%"], snapPointsMode: "percent", transition: "medium" }) }) })] }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: handlePercentSheetOpenChange, open: percentSheetOpen, children: _jsx(DemoModalSheet, { content: _jsxs(View, { style: styles.globalSheetContent, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "\u5168\u5C40 Sheet percent" }), _jsx(Text, { color: "$color", children: "\u8FD9\u4E2A\u793A\u4F8B\u4F7F\u7528 modal \u6A21\u5F0F\u6E32\u67D3\u5230\u5168\u5C40\u5C42\uFF0C\u5E76\u56FA\u5B9A\u4E3A percent snapPoints\u3002" }), sheetItems.map((item) => (_jsx(DemoBorderItem, { children: _jsx(Text, { children: item }) }, item))), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => {
                                            setNestedGlobalSheetPosition(0);
                                            setNestedGlobalSheetOpen(true);
                                        }, variant: "outlined", children: "\u6253\u5F00\u5185\u5C42 Sheet" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setPercentSheetOpen(false), theme: "accent", children: "\u5173\u95ED\u5168\u5C40 Sheet percent" }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: handleNestedGlobalSheetOpenChange, open: nestedGlobalSheetOpen, children: _jsx(DemoModalSheet, { content: _jsxs(View, { style: styles.nestedSheetContent, children: [_jsx(Text, { fontSize: "$6", fontWeight: "700", children: "\u5185\u5C42 Sheet" }), _jsx(Text, { color: "$color", children: "\u8FD9\u4E2A\u793A\u4F8B\u590D\u7528\u5F53\u524D wrapper\uFF0C\u5728\u5916\u5C42 Sheet \u5185\u518D\u6253\u5F00\u4E00\u4E2A modal Sheet\u3002" }), _jsx(Text, { children: "\u8FD9\u91CC\u53EF\u4EE5\u653E\u66F4\u7EC6\u4E00\u7EA7\u7684\u64CD\u4F5C\uFF0C\u4F8B\u5982\u4E8C\u6B21\u786E\u8BA4\u3001\u8865\u5145\u914D\u7F6E\uFF0C\u6216\u8005\u50CF Tamagui \u5B98\u65B9\u793A\u4F8B\u90A3\u6837\u7EE7\u7EED\u5C55\u793A\u5D4C\u5957\u5F39\u5C42\u884C\u4E3A\u3002" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setNestedGlobalSheetOpen(false), theme: "accent", children: "\u5173\u95ED\u5185\u5C42 Sheet" })] }), native: sheetNativeEnabled, onOpenChange: handleNestedGlobalSheetOpenChange, onPositionChange: handleNestedGlobalSheetPositionChange, open: nestedGlobalSheetOpen, position: nestedGlobalSheetPosition, snapPoints: ["72%", "88%"], snapPointsMode: "percent" }) })] }), native: sheetNativeEnabled, onOpenChange: handlePercentSheetOpenChange, onPositionChange: handlePercentSheetPositionChange, open: percentSheetOpen, position: percentSheetPosition, snapPoints: ["62%", "90%"], snapPointsMode: "percent" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: handleConstantSheetOpenChange, open: constantSheetOpen, children: _jsx(DemoModalSheet, { content: _jsxs(View, { style: styles.globalSheetContent, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "\u5168\u5C40 Sheet constant" }), _jsx(Text, { color: "$color", children: "\u8FD9\u4E2A\u793A\u4F8B\u4F7F\u7528 modal \u6A21\u5F0F\u6E32\u67D3\u5230\u5168\u5C40\u5C42\uFF0C\u5E76\u56FA\u5B9A\u4E3A constant snapPoints\u3002" }), sheetItems.map((item) => (_jsx(DemoBorderItem, { children: _jsx(Text, { children: item }) }, item))), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setConstantSheetOpen(false), theme: "accent", children: "\u5173\u95ED\u5168\u5C40 Sheet constant" })] }), native: sheetNativeEnabled, onOpenChange: handleConstantSheetOpenChange, onPositionChange: handleConstantSheetPositionChange, open: constantSheetOpen, position: constantSheetPosition, snapPoints: [360, 560], snapPointsMode: "constant" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: handleFitSheetOpenChange, open: fitSheetOpen, children: _jsx(DemoModalSheet, { content: _jsxs(View, { style: styles.globalSheetContent, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "\u5168\u5C40 Sheet fit" }), _jsx(Text, { color: "$color", children: "\u8FD9\u4E2A\u793A\u4F8B\u4F7F\u7528 modal \u6A21\u5F0F\u6E32\u67D3\u5230\u5168\u5C40\u5C42\uFF0C\u5E76\u56FA\u5B9A\u4E3A fit \u6A21\u5F0F\u3002" }), sheetItems.map((item) => (_jsx(DemoBorderItem, { children: _jsx(Text, { children: item }) }, item))), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setFitSheetOpen(false), theme: "accent", children: "\u5173\u95ED\u5168\u5C40 Sheet fit" })] }), native: sheetNativeEnabled, onOpenChange: handleFitSheetOpenChange, onPositionChange: handleFitSheetPositionChange, open: fitSheetOpen, position: fitSheetPosition, snapPointsMode: "fit" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: handleMixedSheetOpenChange, open: mixedSheetOpen, children: _jsx(DemoModalSheet, { content: _jsxs(View, { style: styles.globalSheetContent, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "\u5168\u5C40 Sheet mixed" }), _jsx(Text, { color: "$color", children: "\u8FD9\u4E2A\u793A\u4F8B\u4F7F\u7528 modal \u6A21\u5F0F\u6E32\u67D3\u5230\u5168\u5C40\u5C42\uFF0C\u5E76\u56FA\u5B9A\u4E3A mixed snapPoints\u3002" }), sheetItems.map((item) => (_jsx(DemoBorderItem, { children: _jsx(Text, { children: item }) }, item))), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setMixedSheetOpen(false), theme: "accent", children: "\u5173\u95ED\u5168\u5C40 Sheet mixed" })] }), native: sheetNativeEnabled, onOpenChange: handleMixedSheetOpenChange, onPositionChange: handleMixedSheetPositionChange, open: mixedSheetOpen, position: mixedSheetPosition, snapPoints: ["fit", "80%"], snapPointsMode: "mixed" }) }), _jsxs(DemoRow, { children: [_jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => {
                                    setExplicitNativeSheetPosition(0);
                                    setExplicitNativeSheetOpen(true);
                                }, variant: "outlined", children: "Open NativeSheet" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => {
                                    setExplicitSheetPosition(0);
                                    setExplicitSheetOpen(true);
                                }, variant: "outlined", children: "Open Sheet" })] }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setExplicitNativeSheetOpen, open: explicitNativeSheetOpen, children: _jsx(NativeSheet, { content: _jsxs(View, { style: styles.globalSheetContent, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "NativeSheet" }), _jsx(Text, { color: "$color", children: "\u9ED8\u8BA4 `Sheet` \u4E4B\u5916\u7684\u663E\u5F0F\u9AD8\u7EA7\u5165\u53E3\u3002" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setExplicitNativeSheetOpen(false), theme: "accent", children: "\u5173\u95ED NativeSheet" })] }), handle: true, modal: true, onOpenChange: setExplicitNativeSheetOpen, onPositionChange: setExplicitNativeSheetPosition, open: explicitNativeSheetOpen, overlay: true, position: explicitNativeSheetPosition, snapPoints: ["72%", "92%"], snapPointsMode: "percent" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setExplicitSheetOpen, open: explicitSheetOpen, children: _jsx(Sheet, { content: _jsxs(View, { style: styles.globalSheetContent, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "Sheet" }), _jsx(Text, { color: "$color", children: "\u4FDD\u7559 Tamagui/replica \u8DEF\u5F84\u7684\u8F7B\u91CF\u5165\u53E3\u3002" }), _jsx(Button, { nativeHaptics: debugNativeHaptics, onPress: () => setExplicitSheetOpen(false), theme: "accent", children: "\u5173\u95ED Sheet" })] }), dismissOnSnapToBottom: true, handle: true, modal: true, onOpenChange: setExplicitSheetOpen, onPositionChange: setExplicitSheetPosition, open: explicitSheetOpen, overlay: true, position: explicitSheetPosition, snapPoints: ["68%"], snapPointsMode: "percent", transition: "200ms" }) }), _jsxs(Text, { color: "$color", children: ["\u6700\u8FD1\u83DC\u5355\u52A8\u4F5C\uFF1A", menuAction] }), _jsxs(Text, { color: "$color", children: ["\u6700\u8FD1 ContextMenu \u52A8\u4F5C\uFF1A", contextMenuAction] })] }), _jsxs(SectionCard, { description: "\u5934\u50CF\u3001\u6587\u672C\u3001\u5206\u9694\u7EBF\u548C\u5361\u7247\u9ED8\u8BA4\u7ED3\u6784\u3002", title: "\u5C55\u793A\u7EC4\u4EF6", children: [_jsxs(DemoRow, { children: [_jsx(Avatar, { fallback: "LN", size: "$4" }), _jsxs(View, { style: styles.textDemo, children: [_jsx(Text, { fontSize: "$5", fontWeight: "600", children: "Text \u7EC4\u4EF6\u793A\u4F8B" }), _jsx(Text, { color: "$color", opacity: 0.6, children: "\u8FD9\u91CC\u5C55\u793A\u6807\u9898\u3001\u6B63\u6587\u548C\u8BF4\u660E\u6587\u6848\u7684\u57FA\u7840\u6392\u7248\u3002" })] })] }), _jsx(Link, { href: "https://tamagui.dev/llms.txt", nativeHaptics: debugNativeHaptics, target: "_blank", children: "Tamagui llms.txt" }), _jsx(Separator, {}), _jsx(View, { style: [
                            styles.demoSectionList,
                            {
                                backgroundColor: appBackgroundColors.screen,
                            },
                        ], children: _jsxs(NativeList, { automaticallyAdjustsScrollIndicatorInsets: false, children: [_jsxs(NativeListSection, { title: "NativeList \u793A\u4F8B", children: [_jsx(NativeListNavigationItem, { nativeHaptics: debugNativeHaptics, onPress: () => setMenuAction("NativeListItem"), title: "NativeListItem", value: "\u8BE6\u60C5" }), _jsx(NativeListSwitchItem, { nativeHaptics: debugNativeHaptics, switchProps: {
                                                checked: switchValue,
                                                onCheckedChange: setSwitchValue,
                                            }, title: "SwitchItem" })] }), _jsxs(NativeListSection, { title: "\u5355\u9009\u793A\u4F8B", children: [_jsx(NativeListItem, { chevron: false, nativeHaptics: debugNativeHaptics, onPress: () => setNativeListSingleChoice("thirty-seconds"), selected: nativeListSingleChoice === "thirty-seconds", title: "30\u79D2\u949F" }), _jsx(NativeListItem, { chevron: false, nativeHaptics: debugNativeHaptics, onPress: () => setNativeListSingleChoice("one-minute"), selected: nativeListSingleChoice === "one-minute", title: "1\u5206\u949F" }), _jsx(NativeListItem, { chevron: false, nativeHaptics: debugNativeHaptics, onPress: () => setNativeListSingleChoice("two-minutes"), selected: nativeListSingleChoice === "two-minutes", title: "2\u5206\u949F" }), _jsx(NativeListItem, { chevron: false, nativeHaptics: debugNativeHaptics, onPress: () => setNativeListSingleChoice("four-minutes"), selected: nativeListSingleChoice === "four-minutes", title: "4\u5206\u949F" }), _jsx(NativeListItem, { chevron: false, nativeHaptics: debugNativeHaptics, onPress: () => setNativeListSingleChoice("never"), selected: nativeListSingleChoice === "never", title: "\u6C38\u4E0D" })] }), _jsxs(NativeListSection, { title: "Select \u793A\u4F8B", children: [_jsx(NativeListSelectItem, { nativeHaptics: debugNativeHaptics, selectProps: {
                                                onValueChange: setSelectValue2,
                                                options: selectItems2,
                                                placeholder: "选择主题模式",
                                                value: selectValue2 ?? undefined,
                                            }, title: "SelectItem" }), os() === "ios" && (_jsx(NativeListSelectItem, { nativeHaptics: debugNativeHaptics, selectProps: {
                                                onValueChange: setSelectValue2,
                                                options: selectItems2,
                                                placeholder: "选择主题模式",
                                                value: selectValue2 ?? undefined,
                                                nativePickerMode: "wheel",
                                            }, title: "SelectItem Wheel" })), os() === "android" && (_jsx(NativeListSelectItem, { nativeHaptics: debugNativeHaptics, selectProps: {
                                                onValueChange: setSelectValue2,
                                                options: selectItems2,
                                                placeholder: "选择主题模式",
                                                value: selectValue2 ?? undefined,
                                                nativePickerMode: "dialog",
                                            }, title: "SelectItem Dialog" }))] })] }) }), _jsx(Separator, {}), _jsx(ListGroup, { items: [
                            {
                                icon: Backpack,
                                iconAfter: ChevronRight,
                                subTitle: "ListItem wrapper 当前由 ListGroup 统一组织展示。",
                                title: "ListGroup / ListItem 组件示例",
                            },
                            {
                                icon: Calendar,
                                title: "第二项示例",
                            },
                        ], nativeHaptics: debugNativeHaptics, rounded: "$4", self: "stretch", separator: true, size: "$4" }), _jsx(Separator, {}), _jsxs(View, { style: styles.mediaDemo, children: [_jsx(Text, { color: "$color", children: "Image" }), _jsx(Image, { alt: "LonaNote \u7EC4\u4EF6\u6F14\u793A\u56FE\u7247", borderRadius: 16, height: 160, objectFit: "cover", src: "https://picsum.photos/200/300", width: 240 })] }), _jsxs(View, { style: styles.scrollViewShowcase, children: [_jsx(Text, { color: "$color", children: "ScrollView" }), _jsx(Text, { color: "$color", opacity: 0.6, children: "\u8FD9\u4E2A\u533A\u57DF\u5E94\u5F53\u72EC\u7ACB\u4E8E\u9875\u9762\u672C\u8EAB\u4E0A\u4E0B\u6EDA\u52A8\u3002" }), _jsx(YStack, { borderColor: "$borderColor", style: styles.scrollViewFrame, children: _jsx(ScrollView, { bottomSheetScrollable: false, contentContainerStyle: styles.scrollViewContent, directionalLockEnabled: true, nestedScrollEnabled: true, scrollEnabled: true, showsVerticalScrollIndicator: true, style: styles.scrollViewDemo, children: selectItems.map((item) => (_jsx(DemoBorderItem, { paddingVertical: 10, children: _jsx(Text, { children: item.label }) }, item.value))) }) })] }), _jsx(Separator, {}), _jsx(Card, { description: "Card \u9ED8\u8BA4 API \u53EF\u76F4\u63A5\u4F20 title \u548C description\u3002", title: "Card \u7EC4\u4EF6\u793A\u4F8B", children: _jsx(Text, { children: "\u8FD9\u91CC\u662F Card \u627F\u8F7D\u7684\u6B63\u6587\u5185\u5BB9\u3002" }) })] })] }));
}
const styles = StyleSheet.create({
    card: {
        width: "100%",
    },
    checkboxGroup: {
        gap: 0,
    },
    customToast: {
        backgroundColor: "#ffffff",
        borderColor: "#e4e4e7",
        borderRadius: 16,
        borderWidth: 1,
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    demoBorderItem: {
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
    },
    demoGroup: {
        gap: 12,
    },
    field: {
        flex: 1,
        gap: 8,
        minWidth: 200,
    },
    fieldGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
    },
    formContent: {
        gap: 12,
    },
    globalSheetContent: {
        gap: 12,
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 24,
        paddingTop: 12,
    },
    mediaDemo: {
        flex: 1,
        gap: 8,
        minWidth: 240,
    },
    nestedSheetContent: {
        gap: 16,
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 24,
        paddingTop: 12,
    },
    popoverContent: {
        alignItems: "center",
        gap: 12,
        minWidth: 280,
    },
    popoverFieldInput: {
        flex: 1,
    },
    popoverFieldLabel: {
        minWidth: 48,
    },
    popoverFieldRow: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    root: {
        gap: 20,
        paddingBottom: 50,
        paddingHorizontal: 20,
    },
    scrollViewContent: {
        gap: 8,
        padding: 12,
    },
    scrollViewDemo: {
        flex: 1,
    },
    scrollViewFrame: {
        alignSelf: "stretch",
        borderRadius: 16,
        borderWidth: 1,
        height: 240,
        overflow: "hidden",
        width: "100%",
    },
    scrollViewShowcase: {
        alignSelf: "stretch",
        gap: 8,
        width: "100%",
    },
    row: {
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    sectionBody: {
        gap: 16,
        padding: 12,
        paddingTop: 0,
    },
    sheetFrame: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    sheetDemoHost: {
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
        overflow: "hidden",
        padding: 16,
        position: "relative",
    },
    sheetDemoStage: {
        height: 240,
        overflow: "hidden",
        position: "relative",
        width: "100%",
    },
    sheetScrollContent: {
        gap: 10,
        paddingBottom: 24,
        paddingTop: 12,
    },
    textDemo: {
        flex: 1,
        gap: 4,
        minWidth: 220,
    },
    demoSectionList: {
        gap: 12,
        minHeight: 420,
        marginHorizontal: -4,
    },
});
