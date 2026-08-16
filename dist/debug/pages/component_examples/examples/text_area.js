import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, TextArea } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function TextAreaExample() {
    const [value, setValue] = useState("这里可以输入多行内容。");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: `${value.length} 个字符，可用作草稿或备注。`, title: "\u81EA\u52A8\u4FDD\u5B58\u7684\u5907\u6CE8", children: [_jsx(TextArea, { onChangeText: setValue, placeholder: "\u5199\u4E0B\u8BF4\u660E\u2026", rows: 6, style: { minHeight: 140 }, value: value }), _jsx(Button, { onPress: () => setValue(""), size: "$3", variant: "outlined", children: "\u6E05\u7A7A\u5185\u5BB9" })] }) }));
}
