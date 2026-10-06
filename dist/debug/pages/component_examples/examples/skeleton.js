import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from "react-native";
import { Skeleton, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function SkeletonExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { title: "\u52A0\u8F7D\u72B6\u6001", children: _jsxs(View, { className: "gap-3", children: [_jsx(Skeleton, { className: "bg-muted-foreground/30 h-5 w-3/4" }), _jsx(Skeleton, { className: "bg-muted-foreground/30 h-4 w-full" }), _jsx(Skeleton, { className: "bg-muted-foreground/30 h-4 w-2/3" }), _jsx(Text, { className: "text-muted-foreground", children: "\u6B63\u5728\u52A0\u8F7D\u5DE5\u4F5C\u533A..." })] }) }) }));
}
