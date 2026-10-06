import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Spinner, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function SpinnerExample() {
    const [visible, setVisible] = useState(true);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { title: "\u52A0\u8F7D\u4E2D\u72B6\u6001", children: [_jsxs(ExampleRow, { children: [visible ? _jsx(Spinner, { size: "2xl" }) : _jsx(Text, { children: "\u52A0\u8F7D\u5DF2\u6682\u505C" }), _jsx(Button, { onPress: () => setVisible((current) => !current), title: visible ? "停止加载" : "开始加载", variant: "outline" })] }), _jsxs(ExampleRow, { children: [_jsx(Spinner, { size: "2xs" }), _jsx(Spinner, { size: "xs" }), _jsx(Spinner, { size: "sm" }), _jsx(Spinner, { size: "md" }), _jsx(Spinner, { size: "lg" }), _jsx(Spinner, { size: "xl" }), _jsx(Spinner, { size: "2xl" })] })] }) }));
}
