import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Input, Label } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function InputExample() {
    const [value, setValue] = useState("rn-ui-kit");
    const [slug, setSlug] = useState("component-lab");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { children: [_jsx(Label, { nativeID: "component-example-name", children: "\u663E\u793A\u540D\u79F0" }), _jsx(Input, { onChangeText: setValue, placeholder: "\u8F93\u5165\u7EC4\u4EF6\u540D\u79F0", value: value }), _jsx(Label, { nativeID: "component-example-slug", children: "URL \u6807\u8BC6" }), _jsx(Input, { onChangeText: setSlug, placeholder: "my-workspace", value: slug }), _jsx(Button, { children: "\u786E\u5B9A" })] }) }));
}
