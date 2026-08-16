import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Tooltip } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function TooltipExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "Web \u60AC\u505C\u663E\u793A\uFF1BNative \u4E3B\u8981\u63D0\u4F9B\u53EF\u8BBF\u95EE\u6027\u8BED\u4E49\u3002", title: "\u8865\u5145\u8BF4\u660E", children: _jsxs(ExampleRow, { children: [_jsx(Tooltip, { arrow: true, content: "\u8FD9\u4F1A\u628A\u5F53\u524D\u7248\u672C\u53D1\u5E03\u5230\u9884\u89C8\u73AF\u5883\u3002", children: _jsx(Button, { variant: "outlined", children: "\u53D1\u5E03\u8BF4\u660E" }) }), _jsx(Tooltip, { arrow: true, content: "\u5220\u9664\u540E\u5C06\u65E0\u6CD5\u6062\u590D\u3002", children: _jsx(Button, { theme: "red", children: "\u5371\u9669\u64CD\u4F5C" }) })] }) }) }));
}
