import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "rn-ui-kit/core";
import { BadgeCheck } from "lucide-react-native";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function BadgeExample() {
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { title: "\u9879\u76EE\u72B6\u6001", children: [_jsxs(ExampleRow, { children: [_jsx(Badge, { label: "xs", size: "xs" }), _jsx(Badge, { label: "sm", size: "sm" }), _jsx(Badge, { label: "md", size: "md" }), _jsx(Badge, { label: "lg", size: "lg" }), _jsx(Badge, { label: "xl", size: "xl" })] }), _jsxs(ExampleRow, { children: [_jsx(Badge, { label: "\u7A33\u5B9A" }), _jsx(Badge, { label: "\u6B21\u8981", variant: "secondary" }), _jsx(Badge, { label: "\u963B\u585E", variant: "destructive" }), _jsx(Badge, { label: "\u8F6E\u5ED3", variant: "outline" })] }), _jsxs(ExampleRow, { children: [_jsx(Badge, { className: "bg-blue-500 dark:bg-blue-600", icon: BadgeCheck, iconClassName: "text-white", label: "\u5DF2\u9A8C\u8BC1", labelClassName: "text-white", variant: "secondary" }), _jsx(Badge, { className: "min-w-5 rounded-full px-1", label: "8" }), _jsx(Badge, { className: "min-w-5 rounded-full px-1", label: "99", variant: "destructive" }), _jsx(Badge, { className: "min-w-5 rounded-full px-1", label: "20+", variant: "outline" })] })] }) }));
}
