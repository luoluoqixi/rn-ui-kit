import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Input, Label, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function InputExample() {
    const [value, setValue] = useState("rn-ui-kit");
    const [slug, setSlug] = useState("component-lab");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u5C06\u53D7\u63A7\u5B57\u6BB5\u7528\u4E8E\u540D\u79F0\u4E0E\u53EF\u53D1\u5E03\u7684 URL \u6807\u8BC6\u3002", title: "\u5DE5\u4F5C\u533A\u4FE1\u606F", children: [_jsx(Label, { htmlFor: "component-example-name", children: "\u663E\u793A\u540D\u79F0" }), _jsx(Input, { id: "component-example-name", onChangeText: setValue, placeholder: "\u8F93\u5165\u7EC4\u4EF6\u540D\u79F0", value: value }), _jsx(Label, { htmlFor: "component-example-slug", children: "URL \u6807\u8BC6" }), _jsx(Input, { id: "component-example-slug", onChangeText: setSlug, placeholder: "my-workspace", value: slug }), _jsxs(Text, { opacity: 0.6, children: ["\u5C06\u53D1\u5E03\u5230 /workspaces/", slug || "…", "\uFF08\u540D\u79F0\uFF1A", value || "未填写", "\uFF09"] })] }) }));
}
