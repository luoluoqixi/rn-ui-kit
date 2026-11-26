import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, Text } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";
export function LinkExample() {
    const [count, setCount] = useState(0);
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleSection, { title: "\u6761\u6B3E\u4E0E\u9690\u79C1", description: "\u6253\u5F00\u6587\u6863\u94FE\u63A5\uFF1B\u6D4F\u89C8\u5668\u4FDD\u7559\u6807\u51C6\u94FE\u63A5\u884C\u4E3A\u3002", children: _jsxs(ExampleRow, { children: [_jsx(Link, { href: "https://reactnative.dev", target: "_blank", children: "React Native \u6587\u6863" }), _jsx(Link, { href: "https://uniwind.dev", target: "_blank", children: "Uniwind \u6587\u6863" })] }) }), _jsxs(ExampleSection, { title: "\u5C3A\u5BF8", children: [_jsxs(ExampleRow, { children: [_jsx(Link, { size: "sm", onPress: () => setCount(count + 1), children: "\u5C0F\u53F7" }), _jsx(Link, { size: "md", onPress: () => setCount(count + 1), children: "\u9ED8\u8BA4" }), _jsx(Link, { size: "lg", onPress: () => setCount(count + 1), children: "\u5927\u53F7" })] }), _jsxs(Text, { color: "muted", children: ["\u5DF2\u89E6\u53D1 ", count, " \u6B21"] })] }), _jsxs(ExampleSection, { title: "\u7981\u7528\u72B6\u6001", children: [_jsx(Link, { href: "https://reactnative.dev", isDisabled: true, children: "\u6682\u4E0D\u53EF\u8BBF\u95EE" }), _jsx(Link, { nativeHaptics: true, onPress: () => setCount(count + 1), children: "\u70B9\u51FB\u5E76\u89E6\u53D1\u89E6\u611F\u53CD\u9988" })] })] }));
}
