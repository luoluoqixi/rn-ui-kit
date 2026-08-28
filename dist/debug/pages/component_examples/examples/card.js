import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Link, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function CardExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { title: "\u9879\u76EE\u6458\u8981", children: _jsx(Card, { content: _jsx(Text, { children: "\u8FD9\u91CC\u662F Card \u7684\u6B63\u6587\u533A\u57DF" }), description: "\u4E0A\u6B21\u540C\u6B65\u4E8E\u4ECA\u5929", footer: _jsxs(ExampleRow, { children: [_jsx(Text, { className: "text-muted-foreground", children: "2 \u4F4D\u534F\u4F5C\u8005" }), _jsx(Link, { children: "\u67E5\u770B\u8BE6\u60C5" })] }), title: "rn-ui-kit \u8C03\u8BD5\u5DE5\u4F5C\u533A" }) }) }));
}
