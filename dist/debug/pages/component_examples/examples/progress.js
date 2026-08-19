import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Progress } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function ProgressExample() {
    const [value, setValue] = useState(35);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: `文件上传：${value}%`, title: "\u53D7\u63A7\u8FDB\u5EA6", children: [_jsx(Progress, { max: 100, value: value, width: "100%" }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setValue((current) => Math.max(0, current - 10)), size: "$3", variant: "outlined", children: "-10" }), _jsx(Button, { onPress: () => setValue((current) => Math.min(100, current + 10)), size: "$3", variant: "outlined", children: "+10" }), _jsx(Button, { onPress: () => setValue(100), size: "$3", theme: "green", children: "\u5B8C\u6210" })] })] }) }));
}
