import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function LinkExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u94FE\u63A5\u53EF\u7528\u4E8E\u6B63\u6587\u5185\u8DF3\u8F6C\u548C\u5355\u72EC\u7684\u5E2E\u52A9\u5165\u53E3\u3002", title: "\u76F8\u5173\u8D44\u6E90", children: _jsxs(ExampleRow, { children: [_jsx(Link, { href: "https://tamagui.dev", target: "_blank", children: "Tamagui \u6587\u6863" }), _jsx(Link, { href: "https://reactnative.dev", target: "_blank", children: "React Native" })] }) }) }));
}
