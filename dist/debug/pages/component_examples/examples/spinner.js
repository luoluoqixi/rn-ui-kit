import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Spinner, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function SpinnerExample() {
    const [visible, setVisible] = useState(true);
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { title: "\u52A0\u8F7D\u4E2D\u72B6\u6001", children: _jsxs(ExampleRow, { children: [visible ? _jsx(Spinner, { size: "large" }) : _jsx(Text, { children: "\u52A0\u8F7D\u5DF2\u6682\u505C" }), _jsx(Button, { onPress: () => setVisible((current) => !current), title: visible ? "停止加载" : "开始加载", variant: "outline" })] }) }) }));
}
