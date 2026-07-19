import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Button, Form, Input, isWeb, Label, os, RadioGroup, Select, Text, TextArea, } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
import { View } from "react-native";
function InputExample() {
    const [value, setValue] = useState("rn-ui-kit");
    const [slug, setSlug] = useState("component-lab");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u5C06\u53D7\u63A7\u5B57\u6BB5\u7528\u4E8E\u540D\u79F0\u4E0E\u53EF\u53D1\u5E03\u7684 URL \u6807\u8BC6\u3002", title: "\u5DE5\u4F5C\u533A\u4FE1\u606F", children: [_jsx(Label, { htmlFor: "component-example-name", children: "\u663E\u793A\u540D\u79F0" }), _jsx(Input, { id: "component-example-name", onChangeText: setValue, placeholder: "\u8F93\u5165\u7EC4\u4EF6\u540D\u79F0", value: value }), _jsx(Label, { htmlFor: "component-example-slug", children: "URL \u6807\u8BC6" }), _jsx(Input, { id: "component-example-slug", onChangeText: setSlug, placeholder: "my-workspace", value: slug }), _jsxs(Text, { opacity: 0.6, children: ["\u5C06\u53D1\u5E03\u5230 /workspaces/", slug || "…", "\uFF08\u540D\u79F0\uFF1A", value || "未填写", "\uFF09"] })] }) }));
}
function TextAreaExample() {
    const [value, setValue] = useState("这里可以输入多行内容。");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: `${value.length} 个字符，可用作草稿或备注。`, title: "\u81EA\u52A8\u4FDD\u5B58\u7684\u5907\u6CE8", children: [_jsx(TextArea, { onChangeText: setValue, placeholder: "\u5199\u4E0B\u8BF4\u660E\u2026", rows: 6, style: { minHeight: 140 }, value: value }), _jsx(Button, { onPress: () => setValue(""), size: "$3", variant: "outlined", children: "\u6E05\u7A7A\u5185\u5BB9" })] }) }));
}
function SelectExample() {
    const [selectValue, setSelectValue] = useState("blue");
    const [selectValue2, setSelectValue2] = useState("light");
    const [selectGroupedValue, setSelectGroupedValue] = useState("edit-desc");
    const [selectNativePickerValue, setSelectNativePickerValue] = useState("blue");
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
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { description: "", title: "Sheet\u793A\u4F8B", children: [!isWeb() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Select (native-sheet)" }), _jsx(Select, { items: selectItems, native: "native-sheet", onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsx(Label, { children: "Select (custom-sheet)" }), _jsx(Select, { items: selectItems, native: "custom-sheet", onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined })] })), isWeb() && (_jsxs(_Fragment, { children: [_jsx(Label, { children: "Select (sheet)" }), _jsx(Select, { items: selectItems, native: "native-sheet", onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined })] })), _jsx(Select, { items: selectItems, native: "native-sheet", nativeTrigger: true, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272\uFF1A", selectValue ?? "未选择"] })] }), _jsxs(ExampleBlock, { title: "\u539F\u751F\u793A\u4F8B", children: [!isWeb() && (_jsxs(View, { children: [_jsx(Label, { children: "Select Native (Dropdown)" }), _jsx(Select, { items: selectItems, native: true, nativePickerMode: "dropdown", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsx(Select, { items: selectItems, native: true, nativeTrigger: true, nativePickerMode: "dropdown", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272(\u539F\u751F)\uFF1A", selectNativePickerValue ?? "未选择"] })] })), isWeb() && (_jsxs(ExampleBlock, { title: "Web\u793A\u4F8B", children: [_jsx(Label, { children: "Select (\u957F\u5217\u8868)" }), _jsx(Select, { items: selectItems, native: false, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsx(Select, { items: selectItems, native: false, nativeTrigger: true, onValueChange: setSelectValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272\uFF1A", selectValue ?? "未选择"] })] })), os() === "ios" && (_jsxs(View, { children: [_jsx(Label, { children: "Select Native (Wheel Sheet)" }), _jsx(Select, { items: selectItems, native: true, nativePickerMode: "wheel", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsx(Select, { items: selectItems, native: true, nativeTrigger: true, nativePickerMode: "wheel", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272(\u539F\u751F Sheet)\uFF1A", selectNativePickerValue ?? "未选择"] })] })), os() === "android" && (_jsxs(View, { children: [_jsx(Label, { children: "Select Native (Dialog)" }), _jsx(Select, { items: selectItems, native: true, nativePickerMode: "dialog", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsx(Select, { items: selectItems, native: true, nativeTrigger: true, nativePickerMode: "dialog", onValueChange: setSelectNativePickerValue, placeholder: "\u9009\u62E9\u4E3B\u9898\u8272", value: selectNativePickerValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\u8272(\u539F\u751F)\uFF1A", selectNativePickerValue ?? "未选择"] })] }))] }), _jsxs(ExampleBlock, { title: "\u7B80\u5355\u793A\u4F8B", children: [_jsx(Label, { children: "Select" }), _jsx(Select, { items: selectItems2, native: false, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined }), _jsx(Select, { items: selectItems2, native: false, nativeTrigger: true, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898\uFF1A", selectValue2 ?? "未选择"] }), _jsxs(View, { children: [_jsx(Label, { children: "Select Native" }), _jsx(Select, { items: selectItems2, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined, native: true }), _jsx(Select, { items: selectItems2, nativeTrigger: true, onValueChange: setSelectValue2, placeholder: "\u9009\u62E9\u4E3B\u9898", value: selectValue2 ?? undefined, native: true }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u4E3B\u9898(\u539F\u751F)\uFF1A", selectValue2 ?? "未选择"] })] })] }), _jsxs(ExampleBlock, { title: "Grouped\u793A\u4F8B", children: [_jsx(Label, { children: "Select Grouped" }), _jsx(Select, { native: false, itemGroups: selectSortGroups, onValueChange: setSelectGroupedValue, placeholder: "\u9009\u62E9\u6392\u5E8F\u65B9\u5F0F", value: selectGroupedValue ?? undefined }), _jsx(Select, { native: false, nativeTrigger: true, itemGroups: selectSortGroups, onValueChange: setSelectGroupedValue, placeholder: "\u9009\u62E9\u6392\u5E8F\u65B9\u5F0F", value: selectGroupedValue ?? undefined }), _jsxs(Text, { color: "$color", children: ["\u5F53\u524D\u6392\u5E8F\uFF1A", selectGroupedValue ?? "未选择"] })] })] }));
}
function RadioGroupExample() {
    const [value, setValue] = useState("recent");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u7528\u4E8E\u4E92\u65A5\u7684\u5217\u8868\u6392\u5E8F\u6761\u4EF6\u3002", title: "\u6392\u5E8F\u89C4\u5219", children: [_jsx(RadioGroup, { items: [
                        { label: "最近更新", value: "recent" },
                        { label: "名称", value: "name" },
                        { label: "大小", value: "size" },
                    ], onValueChange: setValue, value: value }), _jsxs(Text, { opacity: 0.6, children: ["\u5F53\u524D\u6392\u5E8F\uFF1A", value] })] }) }));
}
function FormExample() {
    const [name, setName] = useState("demo-workspace");
    const [description, setDescription] = useState("这是一个可分享的组件实验工作区。");
    const [submitCount, setSubmitCount] = useState(0);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u4E00\u4E2A\u63D0\u4EA4\u89E6\u53D1\u5668\u7BA1\u7406\u591A\u4E2A\u53D7\u63A7\u5B57\u6BB5\u3002", title: "\u521B\u5EFA\u5DE5\u4F5C\u533A", children: [_jsxs(Form, { triggerProps: {
                        style: {
                            marginTop: 10,
                        },
                    }, onSubmit: () => setSubmitCount((current) => current + 1), trigger: _jsx(Button, { theme: "accent", children: "\u63D0\u4EA4" }), children: [_jsx(Label, { htmlFor: "component-example-form-name", children: "\u540D\u79F0" }), _jsx(Input, { id: "component-example-form-name", onChangeText: setName, placeholder: "\u5DE5\u4F5C\u533A\u540D\u79F0", value: name }), _jsx(Label, { htmlFor: "component-example-form-description", children: "\u8BF4\u660E" }), _jsx(TextArea, { id: "component-example-form-description", onChangeText: setDescription, rows: 3, value: description })] }), _jsxs(Text, { opacity: 0.6, children: ["\u5DF2\u63D0\u4EA4 ", submitCount, " \u6B21\uFF1A", name || "未命名", " \u00B7 ", description.length, " \u4E2A\u5B57\u7B26"] })] }) }));
}
function LabelExample() {
    const [value, setValue] = useState("");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "htmlFor / id \u4F7F\u6807\u7B7E\u4E0E\u5B57\u6BB5\u4FDD\u6301\u53EF\u8BBF\u95EE\u6027\u5173\u8054\u3002", title: "\u5B57\u6BB5\u6807\u7B7E", children: [_jsx(Label, { htmlFor: "component-example-label-input", children: "\u5DE5\u4F5C\u533A\u540D\u79F0" }), _jsx(Input, { id: "component-example-label-input", onChangeText: setValue, placeholder: "Label \u4E0E Input \u5173\u8054", value: value })] }) }));
}
export const formExamples = [
    {
        Component: InputExample,
        group: "输入与表单",
        key: "input",
        label: "Input",
    },
    {
        Component: TextAreaExample,
        group: "输入与表单",
        key: "text-area",
        label: "TextArea",
    },
    {
        Component: SelectExample,
        group: "输入与表单",
        key: "select",
        label: "Select",
    },
    {
        Component: RadioGroupExample,
        group: "输入与表单",
        key: "radio-group",
        label: "RadioGroup",
    },
    {
        Component: FormExample,
        group: "输入与表单",
        key: "form",
        label: "Form",
    },
    {
        Component: LabelExample,
        group: "输入与表单",
        key: "label",
        label: "Label",
    },
];
