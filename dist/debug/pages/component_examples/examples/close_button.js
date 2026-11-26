import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowLeft, CircleX, X } from "lucide-react-native";
import { CloseButton, Icon, Text } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";
export function CloseButtonExample() {
    const [count, setCount] = useState(0);
    return _jsxs(ExampleStack, { children: [_jsx(ExampleSection, { title: "\u5173\u95ED\u64CD\u4F5C", description: "\u9ED8\u8BA4\u63D0\u4F9B\u5173\u95ED\u56FE\u6807\u4E0E\u53EF\u8BBF\u95EE\u540D\u79F0\u3002", children: _jsxs(ExampleRow, { children: [_jsx(CloseButton, { nativeHaptics: true, onPress: () => setCount(count + 1) }), _jsxs(Text, { children: ["\u5DF2\u64CD\u4F5C ", count, " \u6B21"] })] }) }), _jsx(ExampleSection, { title: "\u81EA\u5B9A\u4E49\u56FE\u6807", description: "\u4F7F\u7528\u4E3B\u9898\u8BED\u4E49\u8272\u6216\u66FF\u6362\u4E3A\u8FD4\u56DE\u3001\u6E05\u9664\u7B49\u56FE\u6807\u3002", children: _jsxs(ExampleRow, { children: [_jsx(CloseButton, { nativeHaptics: true, accessibilityLabel: "\u53D6\u6D88", children: _jsx(Icon, { as: X, color: "danger", size: 18 }) }), _jsx(CloseButton, { nativeHaptics: true, accessibilityLabel: "\u8FD4\u56DE", children: _jsx(Icon, { as: ArrowLeft, size: 18 }) }), _jsx(CloseButton, { nativeHaptics: true, accessibilityLabel: "\u6E05\u9664", children: _jsx(Icon, { as: CircleX, size: 20 }) })] }) }), _jsx(ExampleSection, { title: "\u7981\u7528\u72B6\u6001", description: "\u7981\u7528\u540E\u4E0D\u54CD\u5E94\u70B9\u51FB\u3002", children: _jsxs(ExampleRow, { children: [_jsx(CloseButton, { nativeHaptics: true }), _jsx(CloseButton, { nativeHaptics: true, isDisabled: true })] }) })] });
}
