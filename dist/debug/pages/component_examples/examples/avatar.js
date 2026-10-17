import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from "react-native";
import { Avatar } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function AvatarExample() {
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { title: "\u534F\u4F5C\u8005", children: [_jsxs(ExampleRow, { children: [_jsx(Avatar, { alt: "xs", fallback: "X", size: "xs" }), _jsx(Avatar, { alt: "sm", fallback: "S", size: "sm" }), _jsx(Avatar, { alt: "md", fallback: "M", size: "md" }), _jsx(Avatar, { alt: "lg", fallback: "L", size: "lg" }), _jsx(Avatar, { alt: "xl", fallback: "X", size: "xl" })] }), _jsxs(ExampleRow, { children: [_jsx(View, { children: _jsx(Avatar, { alt: "Ada Lovelace", className: "size-16", fallback: "AL", src: "https://i.pravatar.cc/160?img=47" }) }), _jsx(View, { children: _jsx(Avatar, { alt: "React Native", className: "size-12", fallback: "RN" }) }), _jsx(View, { children: _jsx(Avatar, { alt: "UI Kit", className: "size-10", fallback: "UI" }) })] })] }) }));
}
