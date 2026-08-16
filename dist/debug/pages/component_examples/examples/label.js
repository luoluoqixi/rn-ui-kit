import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Input, Label } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function LabelExample() {
    const [value, setValue] = useState("");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "htmlFor / id \u4F7F\u6807\u7B7E\u4E0E\u5B57\u6BB5\u4FDD\u6301\u53EF\u8BBF\u95EE\u6027\u5173\u8054\u3002", title: "\u5B57\u6BB5\u6807\u7B7E", children: [_jsx(Label, { htmlFor: "component-example-label-input", children: "\u5DE5\u4F5C\u533A\u540D\u79F0" }), _jsx(Input, { id: "component-example-label-input", onChangeText: setValue, placeholder: "Label \u4E0E Input \u5173\u8054", value: value })] }) }));
}
