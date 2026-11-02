import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Input, Label } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function InputExample() {
    const [value, setValue] = useState("rn-ui-kit");
    const [slug, setSlug] = useState("component-lab");
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { children: [_jsx(Label, { nativeID: "component-example-name", children: "\u663E\u793A\u540D\u79F0" }), _jsx(Input, { onChangeText: setValue, placeholder: "\u8F93\u5165\u7EC4\u4EF6\u540D\u79F0", value: value }), _jsx(Label, { nativeID: "component-example-slug", children: "URL \u6807\u8BC6" }), _jsx(Input, { onChangeText: setSlug, placeholder: "my-workspace", value: slug }), _jsx(Button, { children: "\u786E\u5B9A" })] }), _jsxs(ExampleBlock, { children: [_jsx(Label, { nativeID: "component-example-name", children: "\u5927\u5C0F" }), _jsx(Input, { size: "xs", placeholder: "\u8D85\u5C0F Input" }), _jsx(Input, { size: "sm", placeholder: "\u5C0F Input" }), _jsx(Input, { size: "md", placeholder: "\u9ED8\u8BA4 Input" }), _jsx(Input, { size: "lg", placeholder: "\u5927 Input" }), _jsx(Input, { size: "xl", placeholder: "\u8D85\u5927 Input" })] })] }));
}
