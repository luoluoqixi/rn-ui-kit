import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Spinner, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function SpinnerExample() {
    const [loading, setLoading] = useState(true);
    return _jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { title: "\u5C3A\u5BF8", children: _jsxs(ExampleRow, { children: [_jsx(Spinner, { size: "sm" }), _jsx(Spinner, { size: "md" }), _jsx(Spinner, { size: "lg" })] }) }), _jsx(ExampleBlock, { title: "\u8BED\u4E49\u989C\u8272", children: _jsxs(ExampleRow, { children: [_jsx(Spinner, {}), _jsx(Spinner, { color: "success" }), _jsx(Spinner, { color: "warning" }), _jsx(Spinner, { color: "danger" })] }) }), _jsx(ExampleBlock, { title: "\u81EA\u5B9A\u4E49\u989C\u8272\u4E0E\u5C3A\u5BF8", children: _jsxs(ExampleRow, { children: [_jsx(Spinner, { color: "#8b5cf6", size: 18 }), _jsx(Spinner, { color: "#ec4899", size: 26 }), _jsx(Spinner, { color: "#10b981", size: 40 })] }) }), _jsx(ExampleBlock, { title: "\u52A0\u8F7D\u72B6\u6001", description: "\u505C\u6B62\u52A0\u8F7D\u540E\u5378\u8F7D\u6307\u793A\u5668\uFF0C\u4E0D\u7EE7\u7EED\u64AD\u653E\u52A8\u753B\u3002", children: _jsxs(ExampleRow, { children: [_jsx(Spinner, { isLoading: loading, accessibilityLabel: "\u6B63\u5728\u4FDD\u5B58" }), _jsx(Text, { children: loading ? "正在保存…" : "保存已暂停" }), _jsx(Button, { title: loading ? "停止加载" : "开始加载", variant: "outline", onPress: () => setLoading(v => !v) })] }) })] });
}
