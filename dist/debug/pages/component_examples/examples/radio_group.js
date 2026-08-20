import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { RadioGroup, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function RadioGroupExample() {
    const [value, setValue] = useState("recent");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u7528\u4E8E\u4E92\u65A5\u7684\u5217\u8868\u6392\u5E8F\u6761\u4EF6\u3002", title: "\u6392\u5E8F\u89C4\u5219", children: [_jsx(RadioGroup, { items: [
                        { label: "最近更新", value: "recent" },
                        { label: "名称", value: "name" },
                        { label: "大小", value: "size" },
                    ], onValueChange: setValue, value: value }), _jsxs(Text, { opacity: 0.6, children: ["\u5F53\u524D\u6392\u5E8F\uFF1A", value] })] }) }));
}
