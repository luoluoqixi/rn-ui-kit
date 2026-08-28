import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { RadioGroup, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function RadioGroupExample() {
    const [value, setValue] = useState("recent");
    const onValueChange = (nextValue) => {
        setValue(nextValue);
    };
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { title: "\u6392\u5E8F\u89C4\u5219", children: [_jsx(RadioGroup, { items: [
                        { value: "recent", label: "最近更新" },
                        { value: "name", label: "名称" },
                        { value: "size", label: "大小" },
                    ], onValueChange: onValueChange, value: value }), _jsxs(Text, { className: "text-muted-foreground", children: ["\u5F53\u524D\u6392\u5E8F\uFF1A", value] })] }) }));
}
