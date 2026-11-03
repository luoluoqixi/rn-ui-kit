import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { isAndroid, isIos, isWeb, Label, os, Select, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const colors = [
    ["蓝色", "#007aff", "blue"],
    ["绿色", "#34c759", "green"],
    ["橙色", "#ff9500", "orange"],
    ["粉色", "#ff2d55", "pink"],
    ["红色", "#ff3b30", "red"],
    ["白色", "#f2f2f7", "white"],
    ["黑色", "#000000", "black"],
    ["紫色", "#af52de", "purple"],
    ["黄色", "#ffcc00", "yellow"],
    ["灰色", "#8e8e93", "gray"],
    ["棕色", "#a2845e", "brown"],
    ["青色", "#32ade6", "cyan"],
    ["靛色", "#5856d6", "indigo"],
    ["金色", "#d4af37", "gold"],
    ["银色", "#c0c0c0", "silver"],
].map(([label, swatchColor, value]) => ({ label, swatchColor, value }));
const themes = [
    { label: "浅色", value: "light" },
    { label: "深色", value: "dark" },
    { label: "跟随系统", value: "system" },
];
const groups = [
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
];
function SelectPair({ children, ...props }) {
    return (_jsxs(View, { className: "gap-2", children: [_jsxs(View, { className: "flex-row gap-2", children: [_jsx(Select, { ...props, children: children }), _jsx(Select, { ...props, nativeTrigger: true })] }), _jsx(Select, { ...props, className: "w-full", children: children }), _jsx(Select, { ...props, className: "w-full", nativeTrigger: true })] }));
}
export function SelectExample() {
    const [color, setColor] = useState("blue");
    const [theme, setTheme] = useState("light");
    const [grouped, setGrouped] = useState("name-asc");
    const [nativeValue, setNativeValue] = useState("blue");
    const colorItems = useMemo(() => colors, []);
    const themeItems = useMemo(() => themes, []);
    const groupedItems = useMemo(() => groups, []);
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { title: "Sheet \u793A\u4F8B", children: [_jsx(Label, { children: "Native Sheet" }), _jsx(SelectPair, { items: colorItems, native: "sheet", onValueChange: setColor, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: color }), _jsxs(Text, { variant: "muted", children: ["\u5F53\u524D\u4E3B\u9898\u8272\uFF1A", color ?? "未选择"] })] }), _jsxs(ExampleBlock, { title: "\u539F\u751F\u793A\u4F8B", children: [!isWeb() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Native Dropdown" }), _jsx(SelectPair, { items: colorItems, native: "dropdown", onValueChange: setNativeValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: nativeValue })] })), os() === "android" && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Native Dialog" }), _jsx(SelectPair, { items: colorItems, native: "dialog", onValueChange: setNativeValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: nativeValue })] })), os() === "ios" && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Native Wheel" }), _jsx(SelectPair, { items: colorItems, native: "wheel", onValueChange: setNativeValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: nativeValue })] })), isWeb() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Browser Native Select" }), _jsx(SelectPair, { items: colorItems, native: true, onValueChange: setNativeValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: nativeValue })] }))] }), _jsxs(ExampleBlock, { title: "\u7B80\u5355\u793A\u4F8B", children: [_jsx(Label, { children: "Select Sheet" }), _jsx(SelectPair, { items: themeItems, native: "sheet", onValueChange: setTheme, placeholder: "\u9009\u62E9\u4E3B\u9898", value: theme }), _jsx(Label, { children: "Select Native=true" }), _jsx(SelectPair, { items: themeItems, native: true, onValueChange: setTheme, placeholder: "\u9009\u62E9\u4E3B\u9898", value: theme }), _jsxs(Text, { variant: "muted", children: ["\u5F53\u524D\u4E3B\u9898\uFF1A", theme ?? "未选择"] })] }), _jsxs(ExampleBlock, { title: "Grouped \u793A\u4F8B", children: [_jsx(Label, { children: "Grouped Native Sheet" }), _jsx(SelectPair, { itemGroups: groupedItems, native: "sheet", onValueChange: setGrouped, placeholder: "\u9009\u62E9\u6392\u5E8F\u65B9\u5F0F", value: grouped }), _jsxs(Text, { variant: "muted", children: ["\u5F53\u524D\u6392\u5E8F\uFF1A", grouped ?? "未选择"] })] }), _jsxs(ExampleBlock, { title: "\u5176\u4ED6\u6A21\u5F0F", children: [_jsx(Label, { children: "Native false" }), _jsx(SelectPair, { items: colorItems, native: false, onValueChange: setColor, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: color }), isWeb() && (_jsx(SelectPair, { items: colorItems, native: false, showScrollButtons: false, onValueChange: setColor, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: color }))] }), _jsxs(ExampleBlock, { title: "\u7981\u7528\u6A21\u5F0F", children: [_jsx(Label, { children: "\u6B63\u5E38 disable" }), _jsx(SelectPair, { items: colorItems, disabled: true, native: false, onValueChange: setColor, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: color }), _jsx(Label, { children: "Sheet disable" }), _jsx(SelectPair, { items: colorItems, disabled: true, native: "sheet", onValueChange: setColor, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: color }), !isWeb() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Dropdown disable" }), _jsx(SelectPair, { items: colorItems, disabled: true, native: "dropdown", onValueChange: setColor, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: color })] })), isAndroid() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Dialog disable" }), _jsx(SelectPair, { items: colorItems, disabled: true, native: "dialog", onValueChange: setColor, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: color })] })), isIos() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Wheel disable" }), _jsx(SelectPair, { items: colorItems, disabled: true, native: "wheel", onValueChange: setColor, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: color })] }))] })] }));
}
