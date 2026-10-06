import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Input, Label } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function LabelExample() {
    const [value, setValue] = useState("");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { children: [_jsx(Label, { nativeID: "component-example-label-input", children: "\u5DE5\u4F5C\u533A\u540D\u79F0" }), _jsx(Input, { onChangeText: setValue, placeholder: "Label \u4E0E Input \u5173\u8054", value: value })] }) }));
}
