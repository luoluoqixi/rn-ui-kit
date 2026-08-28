import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Tooltip } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function TooltipExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { title: "\u8865\u5145\u8BF4\u660E", children: _jsxs(ExampleRow, { children: [_jsx(Tooltip, { content: "\u8FD9\u4F1A\u628A\u5F53\u524D\u7248\u672C\u53D1\u5E03", delayDuration: 200, children: _jsx(Button, { variant: "outline", children: "\u53D1\u5E03\u8BF4\u660E" }) }), _jsx(Tooltip, { content: "\u5220\u9664\u540E\u5C06\u65E0\u6CD5\u6062\u590D", delayDuration: 200, children: _jsx(Button, { variant: "destructive", children: "\u5371\u9669\u64CD\u4F5C" }) })] }) }) }));
}
