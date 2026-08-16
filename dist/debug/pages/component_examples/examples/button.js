import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function ButtonExample() {
    const [count, setCount] = useState(0);
    const [saving, setSaving] = useState(false);
    const save = () => {
        setSaving(true);
        setTimeout(() => {
            setCount((current) => current + 1);
            setSaving(false);
        }, 700);
    };
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { description: "\u628A\u6309\u94AE\u53D8\u4F53\u653E\u8FDB\u4E00\u4E2A\u6709\u660E\u786E\u72B6\u6001\u7684\u4FDD\u5B58\u64CD\u4F5C\u4E2D\u3002", title: "\u4FDD\u5B58\u5DE5\u4F5C\u533A", children: [_jsxs(ExampleRow, { children: [_jsx(Button, { disabled: saving, onPress: save, theme: "accent", children: saving ? "正在保存…" : "保存更改" }), _jsx(Button, { disabled: saving, onPress: () => setCount(0), variant: "outlined", children: "\u91CD\u7F6E\u8BA1\u6570" }), _jsx(Button, { chromeless: true, onPress: () => setCount((current) => current + 1), children: "\u4EC5\u66F4\u65B0" })] }), _jsxs(Text, { opacity: 0.6, children: ["\u5DF2\u5B8C\u6210 ", count, " \u6B21\u4FDD\u5B58\uFF1B\u63D0\u4EA4\u671F\u95F4\u5176\u4ED6\u64CD\u4F5C\u4F1A\u88AB\u7981\u7528\u3002"] })] }), _jsx(ExampleBlock, { description: "\u540C\u4E00 API \u7684\u8BED\u4E49\u8272\u3001\u8F6E\u5ED3\u4E0E\u7981\u7528\u72B6\u6001\u3002", title: "\u64CD\u4F5C\u5C42\u7EA7", children: _jsxs(ExampleRow, { children: [_jsx(Button, { theme: "green", children: "\u786E\u8BA4" }), _jsx(Button, { theme: "red", children: "\u5220\u9664" }), _jsx(Button, { variant: "outlined", children: "\u6B21\u8981\u64CD\u4F5C" }), _jsx(Button, { disabled: true, children: "\u4E0D\u53EF\u7528" }), _jsx(Button, { native: true, children: "Native" })] }) })] }));
}
