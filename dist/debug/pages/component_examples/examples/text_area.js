import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Textarea } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function TextAreaExample() {
    const [value, setValue] = useState("这里可以输入多行内容。");
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { description: `${value.length} 个字符`, title: "\u81EA\u52A8\u4FDD\u5B58\u7684\u5907\u6CE8", children: [_jsx(Textarea, { onChangeText: setValue, placeholder: "\u5199\u4E0B\u8BF4\u660E...", style: { minHeight: 140, maxHeight: 160 }, value: value }), _jsx(Button, { onPress: () => setValue(""), variant: "outline", children: "\u6E05\u7A7A\u5185\u5BB9" })] }), _jsxs(ExampleBlock, { title: "\u5927\u5C0F", children: [_jsx(Textarea, { size: "2xs", placeholder: "2xs", style: { minHeight: 50, maxHeight: 50 } }), _jsx(Textarea, { size: "xs", placeholder: "2xs", style: { minHeight: 50, maxHeight: 50 } }), _jsx(Textarea, { size: "sm", placeholder: "sm", style: { minHeight: 50, maxHeight: 50 } }), _jsx(Textarea, { size: "md", placeholder: "md", style: { minHeight: 50, maxHeight: 50 } }), _jsx(Textarea, { size: "lg", placeholder: "lg", style: { minHeight: 55, maxHeight: 55 } }), _jsx(Textarea, { size: "xl", placeholder: "xl", style: { minHeight: 60, maxHeight: 60 } }), _jsx(Textarea, { size: "2xl", placeholder: "2xl", style: { minHeight: 80, maxHeight: 80 } })] })] }));
}
