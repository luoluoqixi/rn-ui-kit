import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { RadioGroup, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function RadioGroupExample() {
    const [value, setValue] = useState("standard");
    const shipping = [
        {
            value: "standard",
            label: "标准配送",
            description: "预计 5–7 个工作日送达。",
        },
        {
            value: "express",
            label: "快速配送",
            description: "预计 2–3 个工作日送达。",
        },
    ];
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleSection, { title: "\u914D\u9001\u65B9\u5F0F", children: [_jsx(RadioGroup, { accessibilityLabel: "\u914D\u9001\u65B9\u5F0F", items: shipping, value: value, onValueChange: setValue }), _jsx(Text, { color: "muted", children: value === "standard" ? "已选择标准配送" : "已选择快速配送" })] }), _jsx(ExampleSection, { title: "\u6307\u793A\u5668\u5728\u53F3\u4FA7", children: _jsx(RadioGroup, { accessibilityLabel: "\u914D\u9001\u504F\u597D", items: shipping, defaultValue: "express", labelPosition: "left" }) }), _jsx(ExampleSection, { title: "\u6A2A\u5411\u6392\u5217", children: _jsx(RadioGroup, { label: "\u66F4\u65B0\u9891\u7387", orientation: "horizontal", defaultValue: "weekly", items: [
                        { value: "daily", label: "每天" },
                        { value: "weekly", label: "每周" },
                        { value: "never", label: "关闭" },
                    ] }) }), _jsxs(ExampleSection, { title: "\u72B6\u6001", children: [_jsx(RadioGroup, { label: "\u5B58\u50A8\u4F4D\u7F6E", defaultValue: "local", items: [
                            { value: "local", label: "本地" },
                            { value: "cloud", label: "云端（暂不可用）", isDisabled: true },
                        ] }), _jsx(RadioGroup, { label: "\u5F52\u6863\u8BBE\u7F6E", items: shipping, defaultValue: "standard", isDisabled: true }), _jsx(RadioGroup, { label: "\u670D\u52A1\u65B9\u6848", items: [
                            { value: "free", label: "免费" },
                            { value: "pro", label: "专业" },
                        ], isInvalid: true, isRequired: true, errorMessage: "\u8BF7\u9009\u62E9\u4E00\u4E2A\u670D\u52A1\u65B9\u6848\u3002" })] })] }));
}
