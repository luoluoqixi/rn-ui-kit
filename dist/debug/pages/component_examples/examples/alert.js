import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert } from "rn-ui-kit/core";
import { CheckCircle, TriangleAlert } from "lucide-react-native";
import { ExampleBlock, ExampleStack } from "../shared";
export function AlertExample() {
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { children: [_jsx(Alert, { description: "\u6240\u6709\u7EC4\u4EF6\u793A\u4F8B\u90FD\u5DF2\u540C\u6B65\u5230\u6700\u65B0\u7248\u672C\u3002", icon: CheckCircle, title: "\u540C\u6B65\u5B8C\u6210" }), _jsx(Alert, { description: "\u6B64\u63D0\u793A\u4E0D\u4F1A\u89E6\u53D1\u539F\u751F\u5F39\u7A97\u3002", icon: TriangleAlert, title: "\u9700\u8981\u6CE8\u610F", variant: "destructive" })] }) }));
}
