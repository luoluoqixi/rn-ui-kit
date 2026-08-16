import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Link, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function CardExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u9ED8\u8BA4 API \u53EF\u4EE5\u7EDF\u4E00\u6807\u9898\u3001\u8BF4\u660E\u3001\u6B63\u6587\u4E0E footer \u7684\u8282\u594F\u3002", title: "\u9879\u76EE\u6458\u8981", children: _jsx(Card, { description: "\u4E0A\u6B21\u540C\u6B65\u4E8E\u4ECA\u5929 10:42\uFF0C\u5305\u542B 12 \u4E2A\u7EC4\u4EF6\u793A\u4F8B\u3002", footer: _jsxs(ExampleRow, { children: [_jsx(Text, { opacity: 0.6, children: "2 \u4F4D\u534F\u4F5C\u8005" }), _jsx(Link, { href: "https://tamagui.dev", target: "_blank", children: "\u67E5\u770B\u8BE6\u60C5" })] }), title: "rn-ui-kit \u8C03\u8BD5\u5DE5\u4F5C\u533A", children: _jsx(Text, { children: "\u8FD9\u91CC\u662F Card \u7684\u6B63\u6587\u533A\u57DF\uFF0C\u53EF\u653E\u7F6E\u9879\u76EE\u6458\u8981\u3001\u72B6\u6001\u548C\u540E\u7EED\u64CD\u4F5C\u3002" }) }) }) }));
}
