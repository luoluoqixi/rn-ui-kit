import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell, Check, ChevronDown, Mail, Search, Settings } from "lucide-react-native";
import { Chip, Icon, Text } from "rn-ui-kit/core";
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
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { title: "\u56FE\u6807", children: _jsx(ExampleRow, { children: icons.map(([icon, label]) => (_jsxs(View, { className: "items-center gap-1", children: [_jsx(Icon, { as: icon }), _jsx(Text, { className: "text-center", children: label })] }, label))) }) }), _jsx(ExampleBlock, { title: "\u4E09\u79CD\u5C3A\u5BF8", children: _jsx(ExampleRow, { children: ["sm", "md", "lg"].map((size) => (_jsxs(View, { className: "items-center gap-2", children: [_jsx(Icon, { as: Search, size: size }), _jsx(Text, { className: "text-xs text-muted", children: size })] }, size))) }) }), _jsx(ExampleBlock, { title: "\u81EA\u5B9A\u4E49\u5C3A\u5BF8", children: _jsxs(ExampleRow, { children: [_jsx(Icon, { as: Search, size: 18 }), _jsx(Icon, { as: Search, size: 26, color: "#8b5cf6" }), _jsx(Icon, { as: Search, className: "size-10" })] }) }), _jsx(ExampleBlock, { title: "\u8BED\u4E49\u989C\u8272", children: _jsxs(ExampleRow, { children: [_jsx(Icon, { as: Search, color: "foreground" }), _jsx(Icon, { as: Search, color: "muted" }), _jsx(Icon, { as: Bell, color: "accent" }), _jsx(Icon, { as: Check, color: "success" }), _jsx(Icon, { as: Mail, color: "warning" }), _jsx(Icon, { as: Settings, color: "danger" })] }) }), _jsxs(ExampleBlock, { title: "\u7EE7\u627F\u5BB9\u5668\u6587\u5B57\u989C\u8272", children: [_jsx(Text, { className: "text-sm text-muted", children: "\u9ED8\u8BA4 color \u4E3A inherit\uFF0C\u8DDF\u968F\u672C\u5E93\u7EC4\u4EF6\u63D0\u4F9B\u7684\u6587\u5B57\u524D\u666F\u8272\uFF1B\u663E\u5F0F\u6307\u5B9A color \u53EF\u4EE5\u8986\u76D6\u3002" }), _jsxs(ExampleRow, { children: [_jsx(Chip, { icon: Bell, label: "\u901A\u77E5" }), _jsx(Chip, { icon: Check, color: "success", label: "\u5DF2\u5B8C\u6210" }), _jsx(Chip, { icon: Mail, color: "warning", variant: "soft", label: "\u5F85\u5904\u7406" }), _jsx(Chip, { variant: "soft", label: "\u72EC\u7ACB\u6307\u5B9A\u56FE\u6807\u8272", startContent: _jsx(Icon, { as: Bell, size: 14, color: "danger" }) })] })] })] }));
}
