import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from "react-native";
import { AspectRatio, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function AspectRatioExample() {
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { title: "\u5A92\u4F53\u9884\u89C8", children: [_jsx(AspectRatio, { ratio: 16 / 9, className: "w-full overflow-hidden rounded-lg border border-primary/30 bg-primary/10", children: _jsx(View, { className: "flex-1 items-center justify-center", children: _jsx(Text, { children: "16:9 Preview" }) }) }), _jsx(AspectRatio, { ratio: 1, className: "w-32 rounded-lg border border-accent bg-accent/30", children: _jsx(View, { className: "flex-1 items-center justify-center", children: _jsx(Text, { children: "1:1" }) }) })] }) }));
}
