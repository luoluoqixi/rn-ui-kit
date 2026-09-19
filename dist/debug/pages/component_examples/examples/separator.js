import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from "react-native";
import { Separator, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function SeparatorExample() {
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { title: "\u5185\u5BB9\u5C42\u7EA7", children: [_jsx(Text, { children: "\u4E0A\u65B9\u5185\u5BB9" }), _jsx(Separator, {}), _jsx(Text, { children: "\u4E0B\u65B9\u5185\u5BB9" }), _jsxs(View, { className: "h-10 flex-row items-center gap-3", children: [_jsx(Text, { children: "\u5DE6\u4FA7" }), _jsx(Separator, { orientation: "vertical" }), _jsx(Text, { children: "\u53F3\u4FA7" })] })] }) }));
}
