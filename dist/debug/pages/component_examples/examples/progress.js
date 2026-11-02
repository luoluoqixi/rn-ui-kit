import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Progress, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function ProgressExample() {
    const [value, setValue] = useState(35);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { title: "\u53D7\u63A7\u8FDB\u5EA6", children: [_jsx(Progress, { max: 100, value: value }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setValue((v) => Math.max(0, v - 10)), variant: "outline", children: "-10" }), _jsx(Button, { onPress: () => setValue((v) => Math.min(100, v + 10)), variant: "outline", children: "+10" }), _jsx(Button, { onPress: () => setValue(100), children: "\u5B8C\u6210" })] }), _jsx(Text, { children: value === 100 ? "上传完成" : "正在上传..." })] }) }));
}
