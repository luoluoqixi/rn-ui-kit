import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { H1, H3, Paragraph, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function TextExample() {
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u6807\u9898\u3001\u6BB5\u843D\u3001\u5F3A\u8C03\u4E0E\u8F85\u52A9\u6587\u6848\u7EC4\u5408\u6210\u4E00\u6BB5\u53EF\u9605\u8BFB\u7684\u5185\u5BB9\u3002", title: "\u53D1\u5E03\u8BF4\u660E", children: [_jsx(H1, { children: "\u4E00\u7EA7\u6807\u9898" }), _jsx(H3, { children: "\u4E09\u7EA7\u6807\u9898" }), _jsx(Paragraph, { children: "Paragraph \u9002\u5408\u8F83\u957F\u7684\u6B63\u6587\u5185\u5BB9\uFF0C\u5E76\u7EE7\u627F\u5F53\u524D\u4E3B\u9898\u989C\u8272\u3002\u8FD9\u91CC\u5C55\u793A\u4E86\u4E00\u4E2A\u5B8C\u6574\u7684\u7248\u672C\u66F4\u65B0\u6458\u8981\u3002" }), _jsx(Text, { fontWeight: "600", children: "\u666E\u901A Text \u53EF\u4EE5\u81EA\u7531\u7EC4\u5408\u5B57\u53F7\u548C\u5B57\u91CD\u3002" }), _jsx(Text, { opacity: 0.6, children: "\u8F85\u52A9\u8BF4\u660E\u6587\u5B57" })] }) }));
}
