import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Toggle } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function ToggleExample() {
    const [enabled, setEnabled] = useState(false);
    const onPressedChange = (pressed) => {
        setEnabled(pressed);
    };
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: enabled ? "已启用" : "已关闭", title: "\u9884\u89C8\u6A21\u5F0F", children: _jsx(Toggle, { pressed: enabled, onPressedChange: onPressedChange, title: "\u7C97\u4F53", accessibilityLabel: "\u5207\u6362\u7C97\u4F53", className: "self-center" }) }) }));
}
