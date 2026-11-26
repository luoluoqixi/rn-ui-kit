import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Text, Tooltip } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function TooltipExample() {
    return _jsx(ExampleStack, { children: _jsxs(ExampleBlock, { title: "\u8865\u5145\u8BF4\u660E", children: [_jsxs(ExampleRow, { children: [_jsx(Tooltip, { content: "\u4FDD\u5B58\u5F53\u524D\u4FEE\u6539", delay: 200, children: _jsx(Button, { children: "\u60AC\u505C\u6216\u805A\u7126" }) }), _jsx(Tooltip, { content: "\u63D0\u793A\u663E\u793A\u5728\u4E0B\u65B9", contentProps: { side: "bottom" }, showArrow: true, children: _jsx(Button, { variant: "secondary", children: "\u5E26\u7BAD\u5934" }) }), _jsx(Tooltip, { content: "\u6682\u65F6\u4E0D\u53EF\u7528", isDisabled: true, children: _jsx(Button, { variant: "tertiary", children: "\u7981\u7528\u63D0\u793A" }) })] }), _jsx(Text, { color: "muted", children: "Web \u652F\u6301\u60AC\u505C\u4E0E\u952E\u76D8\u7126\u70B9\uFF1B\u79FB\u52A8\u7AEF\u76F4\u63A5\u5448\u73B0\u6309\u94AE\uFF0C\u4E0D\u62E6\u622A\u89E6\u6478\u3002" })] }) });
}
