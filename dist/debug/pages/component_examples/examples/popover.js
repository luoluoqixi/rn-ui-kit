import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Input, Popover, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function PopoverExample() {
    const [name, setName] = useState("rn-ui-kit");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { title: `当前名称：${name}`, children: _jsx(Popover, { content: _jsxs(_Fragment, { children: [_jsx(Text, { className: "font-semibold", children: "\u7F16\u8F91\u540D\u79F0" }), _jsx(Input, { onChangeText: setName, value: name })] }), children: _jsx(Button, { variant: "outline", children: "\u6253\u5F00 Popover" }) }) }) }));
}
