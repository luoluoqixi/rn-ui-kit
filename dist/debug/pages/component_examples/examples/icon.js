import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell, Check, ChevronDown, Mail, Search, Settings } from "lucide-react-native";
import { Icon, Text } from "rn-ui-kit/core";
import { View } from "react-native";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
const icons = [
    [Bell, "通知"],
    [Check, "完成"],
    [ChevronDown, "展开"],
    [Mail, "邮件"],
    [Search, "搜索"],
    [Settings, "设置"],
];
export function IconExample() {
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { title: "\u56FE\u6807", children: _jsx(ExampleRow, { children: icons.map(([icon, label]) => (_jsxs(View, { className: "items-center gap-1", children: [_jsx(Icon, { as: icon }), _jsx(Text, { className: "text-center", children: label })] }, label))) }) }), _jsx(ExampleBlock, { title: "\u5C3A\u5BF8\u4E0E\u989C\u8272", children: _jsxs(ExampleRow, { children: [_jsx(Icon, { as: Search, size: "2xs" }), _jsx(Icon, { as: Search, size: "xs" }), _jsx(Icon, { as: Search, size: "sm" }), _jsx(Icon, { as: Search, size: "md" }), _jsx(Icon, { as: Search, size: "lg" }), _jsx(Icon, { as: Search, size: "xl" }), _jsx(Icon, { as: Search, size: "2xl", className: "text-primary" })] }) })] }));
}
