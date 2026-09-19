import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Toggle } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
import { View } from "react-native";
export function ToggleExample() {
    const [enabled, setEnabled] = useState(false);
    const [enabled2xs, setEnabled2xs] = useState(false);
    const [enabledXs, setEnabledXs] = useState(false);
    const [enabledSm, setEnabledSm] = useState(false);
    const [enabledMd, setEnabledMd] = useState(false);
    const [enabledLg, setEnabledLg] = useState(false);
    const [enabledXl, setEnabledXl] = useState(false);
    const [enabled2xl, setEnabled2xl] = useState(false);
    const onPressedChange = (pressed) => {
        setEnabled(pressed);
    };
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: enabled ? "已启用" : "已关闭", title: "\u9884\u89C8\u6A21\u5F0F", children: _jsx(Toggle, { pressed: enabled, onPressedChange: onPressedChange, title: "\u7C97\u4F53", accessibilityLabel: "\u5207\u6362\u7C97\u4F53", className: "self-center" }) }), _jsx(ExampleBlock, { title: "\u5927\u5C0F", children: _jsxs(View, { style: {
                        flexDirection: "column",
                        gap: 2,
                    }, children: [_jsx(Toggle, { size: "2xs", pressed: enabled2xs, onPressedChange: setEnabled2xs, title: "\u6700\u5C0F Toggle", accessibilityLabel: "2xs" }), _jsx(Toggle, { size: "xs", pressed: enabledXs, onPressedChange: setEnabledXs, title: "\u8D85\u5C0F Toggle", accessibilityLabel: "xs" }), _jsx(Toggle, { size: "sm", pressed: enabledSm, onPressedChange: setEnabledSm, title: "\u5C0F Toggle", accessibilityLabel: "sm" }), _jsx(Toggle, { size: "md", pressed: enabledMd, onPressedChange: setEnabledMd, title: "\u6B63\u5E38 Toggle", accessibilityLabel: "md" }), _jsx(Toggle, { size: "lg", pressed: enabledLg, onPressedChange: setEnabledLg, title: "\u5927 Toggle", accessibilityLabel: "lg" }), _jsx(Toggle, { size: "xl", pressed: enabledXl, onPressedChange: setEnabledXl, title: "\u8D85\u5927 Toggle", accessibilityLabel: "xl" }), _jsx(Toggle, { size: "2xl", pressed: enabled2xl, onPressedChange: setEnabled2xl, title: "\u6700\u5927 Toggle", accessibilityLabel: "2xl" })] }) })] }));
}
