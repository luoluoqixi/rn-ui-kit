import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Spinner, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function SpinnerExample() {
    const [visible, setVisible] = useState(true);
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u53EF\u5728\u52A0\u8F7D\u5360\u4F4D\u548C\u64CD\u4F5C\u6309\u94AE\u4E4B\u95F4\u5207\u6362\u3002", title: "\u52A0\u8F7D\u4E2D\u72B6\u6001", children: _jsxs(ExampleRow, { children: [visible ? _jsx(Spinner, { size: "large" }) : _jsx(Text, { children: "\u52A0\u8F7D\u5DF2\u6682\u505C" }), _jsx(Button, { onPress: () => setVisible((current) => !current), variant: "outlined", children: visible ? "停止加载" : "开始加载" })] }) }) }));
}
