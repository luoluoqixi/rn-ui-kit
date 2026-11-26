import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Mail } from "lucide-react-native";
import { Icon, TextField } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function TextFieldExample() {
    const [email, setEmail] = useState("");
    const invalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleSection, { title: "\u5B8C\u6574\u5B57\u6BB5", description: "\u6807\u7B7E\u3001\u8F93\u5165\u4E0E\u8BF4\u660E\u901A\u8FC7 props \u4E00\u6B21\u914D\u7F6E\u3002", children: _jsx(TextField, { label: "\u5DE5\u4F5C\u533A\u540D\u79F0", description: "\u53EF\u5728\u8BBE\u7F6E\u4E2D\u968F\u65F6\u4FEE\u6539\u3002", placeholder: "\u4E3A\u5DE5\u4F5C\u533A\u547D\u540D", isRequired: true }) }), _jsx(ExampleSection, { title: "\u56FE\u6807\u5B57\u6BB5", children: _jsx(TextField, { label: "\u8054\u7CFB\u90AE\u7BB1", placeholder: "name@example.com", type: "email", inputGroupProps: {
                        prefix: _jsx(Icon, { as: Mail, size: "sm", color: "muted" }),
                        prefixProps: { isDecorative: true },
                    } }) }), _jsx(ExampleSection, { title: "\u5185\u8054\u6821\u9A8C", description: "\u8F93\u5165\u4E0D\u5B8C\u6574\u90AE\u7BB1\u65F6\u663E\u793A\u9519\u8BEF\uFF0C\u8865\u5168\u540E\u81EA\u52A8\u6062\u590D\u3002", children: _jsx(TextField, { label: "\u901A\u77E5\u90AE\u7BB1", value: email, onChangeText: setEmail, type: "email", isRequired: true, isInvalid: invalid, errorMessage: "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u7535\u5B50\u90AE\u7BB1\u5730\u5740\u3002", description: "\u6B64\u5730\u5740\u4EC5\u7528\u4E8E\u91CD\u8981\u901A\u77E5\u3002", placeholder: "name@example.com" }) }), _jsxs(ExampleSection, { title: "\u7981\u7528\u4E0E\u591A\u884C", children: [_jsx(TextField, { label: "\u8D26\u6237", defaultValue: "\u5DF2\u5F52\u6863\u8D26\u6237", isDisabled: true }), _jsx(TextField, { multiline: true, rows: 4, label: "\u8865\u5145\u8BF4\u660E", description: "\u591A\u884C\u5B57\u6BB5\u6CBF\u7528\u540C\u4E00\u5957\u8BF4\u660E\u4E0E\u6821\u9A8C\u53C2\u6570\u3002", placeholder: "\u63D0\u4F9B\u66F4\u591A\u80CC\u666F\u2026" })] })] }));
}
