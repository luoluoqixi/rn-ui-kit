import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { isWeb, Label, os, Select, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
import { View } from "react-native";
export function SelectExample() {
    const [selectValue, setSelectValue] = useState("blue");
    const [selectValue2, setSelectValue2] = useState("light");
    const [selectGroupedValue, setSelectGroupedValue] = useState("edit-desc");
    const [selectNativePickerValue, setSelectNativePickerValue] = useState("blue");
    const selectItems = useMemo(() => [
        { label: "蓝色", swatchColor: "#007aff", value: "blue" },
        { label: "绿色", swatchColor: "#34c759", value: "green" },
        { label: "橙色", swatchColor: "#ff9500", value: "orange" },
        { label: "粉色", swatchColor: "#ff2d55", value: "pink" },
        { label: "红色", swatchColor: "#ff3b30", value: "red" },
        { label: "白色", swatchColor: "#f2f2f7", value: "white" },
        { label: "黑色", swatchColor: "#000000", value: "black" },
        { label: "紫色", swatchColor: "#af52de", value: "purple" },
        { label: "黄色", swatchColor: "#ffcc00", value: "yellow" },
        { label: "灰色", swatchColor: "#8e8e93", value: "gray" },
        { label: "棕色", swatchColor: "#a2845e", value: "brown" },
        { label: "青色", swatchColor: "#32ade6", value: "cyan" },
        { label: "靛色", swatchColor: "#5856d6", value: "indigo" },
        { label: "金色", swatchColor: "#d4af37", value: "gold" },
        { label: "银色", swatchColor: "#c0c0c0", value: "silver" },
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
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { description: "", title: "Sheet\u793A\u4F8B", children: [!isWeb() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Select (native-sheet)" }), _jsx(Select, { items: selectItems, native: "native-sheet", onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsx(Label, { children: "Select (custom-sheet)" }), _jsx(Select, { items: selectItems, native: "custom-sheet", onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined })] })), isWeb() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Select (sheet)" }), _jsx(Select, { items: selectItems, native: "native-sheet", onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined })] })), _jsx(Select, { items: selectItems, native: "native-sheet", nativeTrigger: true, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272\uFF1A", selectValue ?? "未选择"] })] }), _jsxs(ExampleBlock, { title: "\u539F\u751F\u793A\u4F8B", children: [!isWeb() && (_jsxs(View, { children: [_jsx(Label, { children: "Select Native (Dropdown)" }), _jsx(Select, { items: selectItems, native: true, nativePickerMode: "dropdown", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsx(Select, { items: selectItems, native: true, nativeTrigger: true, nativePickerMode: "dropdown", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272(\u539F\u751F)\uFF1A", selectNativePickerValue ?? "未选择"] })] })), isWeb() && (_jsxs(ExampleBlock, { title: "Web\u793A\u4F8B", children: [_jsx(Label, { children: "Select (\u957F\u5217\u8868)" }), _jsx(Select, { items: selectItems, native: false, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsx(Select, { items: selectItems, native: false, nativeTrigger: true, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272\uFF1A", selectValue ?? "未选择"] })] })), os() === "ios" && (_jsxs(View, { children: [_jsx(Label, { children: "Select Native (Wheel Sheet)" }), _jsx(Select, { items: selectItems, native: true, nativePickerMode: "wheel", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsx(Select, { items: selectItems, native: true, nativeTrigger: true, nativePickerMode: "wheel", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272(\u539F\u751F Sheet)\uFF1A", selectNativePickerValue ?? "未选择"] })] })), os() === "android" && (_jsxs(View, { children: [_jsx(Label, { children: "Select Native (Dialog)" }), _jsx(Select, { items: selectItems, native: true, nativePickerMode: "dialog", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsx(Select, { items: selectItems, native: true, nativeTrigger: true, nativePickerMode: "dialog", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272(\u539F\u751F)\uFF1A", selectNativePickerValue ?? "未选择"] })] }))] }), _jsxs(ExampleBlock, { title: "\u7B80\u5355\u793A\u4F8B", children: [_jsx(Label, { children: "Select" }), _jsx(Select, { items: selectItems2, native: false, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined }), _jsx(Select, { items: selectItems2, native: false, nativeTrigger: true, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\uFF1A", selectValue2 ?? "未选择"] }), _jsxs(View, { children: [_jsx(Label, { children: "Select Native" }), _jsx(Select, { items: selectItems2, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined, native: true }), _jsx(Select, { items: selectItems2, nativeTrigger: true, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined, native: true }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898(\u539F\u751F)\uFF1A", selectValue2 ?? "未选择"] })] })] }), _jsxs(ExampleBlock, { title: "Grouped\u793A\u4F8B", children: [_jsx(Label, { children: "Select Grouped" }), _jsx(Select, { native: false, itemGroups: selectSortGroups, onValueChange: setSelectGroupedValue, placeholder: "\u9009\u62E9\u6392\u5E8F\u65B9\u5F0F", value: selectGroupedValue ?? undefined }), _jsx(Select, { native: false, nativeTrigger: true, itemGroups: selectSortGroups, onValueChange: setSelectGroupedValue, placeholder: "\u9009\u62E9\u6392\u5E8F\u65B9\u5F0F", value: selectGroupedValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u6392\u5E8F\uFF1A", selectGroupedValue ?? "未选择"] })] })] }));
}
