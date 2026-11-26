import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Eye, EyeOff, Search, Mail } from "lucide-react-native";
import { Button, Icon, InputGroup, TextField } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function InputGroupExample() {
    const [visible, setVisible] = useState(false);
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleSection, { title: "\u524D\u540E\u7F00", description: "\u6587\u672C\u88C5\u9970\u4E0E\u8F93\u5165\u6846\u4F5C\u4E3A\u4E00\u4E2A\u6574\u4F53\u3002", children: _jsx(InputGroup, { accessibilityLabel: "\u7F51\u7AD9\u5730\u5740", prefix: "https://", suffix: ".com", placeholder: "your-site", prefixProps: { isDecorative: true }, suffixProps: { isDecorative: true } }) }), _jsx(ExampleSection, { title: "\u524D\u7F6E\u56FE\u6807", children: _jsx(InputGroup, { accessibilityLabel: "\u641C\u7D22", prefix: _jsx(Icon, { as: Search, size: "sm", color: "muted" }), prefixProps: { isDecorative: true }, placeholder: "\u641C\u7D22\u5DE5\u4F5C\u533A\u2026" }) }), _jsx(ExampleSection, { title: "\u4EA4\u4E92\u5F0F\u540E\u7F00", children: _jsx(InputGroup, { accessibilityLabel: "\u5BC6\u7801", prefix: _jsx(Icon, { as: Mail, size: "sm", color: "muted" }), prefixProps: { isDecorative: true }, type: visible ? "text" : "password", placeholder: "\u8F93\u5165\u5BC6\u7801", suffix: _jsx(Button, { variant: "ghost", size: "sm", accessibilityLabel: visible ? "隐藏密码" : "显示密码", onPress: () => setVisible(!visible), children: _jsx(Icon, { as: visible ? EyeOff : Eye, size: "sm" }) }) }) }), _jsxs(ExampleSection, { title: "\u5B8C\u6574\u5B57\u6BB5", children: [_jsx(TextField, { label: "\u9884\u7B97", description: "\u91D1\u989D\u4EE5\u4EBA\u6C11\u5E01\u8BA1\u7B97\u3002", inputMode: "decimal", placeholder: "0.00", inputGroupProps: {
                            prefix: "¥",
                            suffix: "CNY",
                            prefixProps: { isDecorative: true },
                            suffixProps: { isDecorative: true },
                        } }), _jsx(InputGroup, { accessibilityLabel: "\u7981\u7528\u641C\u7D22", isDisabled: true, prefix: _jsx(Icon, { as: Search, size: "sm" }), placeholder: "\u6682\u4E0D\u53EF\u641C\u7D22" })] })] }));
}
