import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { InputOTP, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function InputOTPExample() {
    const [value, setValue] = useState("");
    const [complete, setComplete] = useState("");
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleSection, { title: "\u9A8C\u8BC1\u7801", description: "\u516D\u4F4D\u6570\u5B57\u5206\u4E3A\u4E24\u7EC4\uFF1B\u652F\u6301\u8F93\u5165\u4E0E\u7C98\u8D34\u3002", children: [_jsx(InputOTP, { accessibilityLabel: "\u516D\u4F4D\u9A8C\u8BC1\u7801", value: value, onChangeText: (next) => {
                            setValue(next);
                            setComplete("");
                        }, onComplete: setComplete, groupSize: 3 }), _jsx(Text, { color: "muted", children: complete
                            ? "已填满：" + complete
                            : "已输入 " + value.length + " / 6 位" })] }), _jsx(ExampleSection, { title: "\u56DB\u4F4D PIN", children: _jsx(InputOTP, { accessibilityLabel: "\u56DB\u4F4D PIN", maxLength: 4 }) }), _jsx(ExampleSection, { title: "\u5360\u4F4D\u4E0E\u5B57\u6BCD\u6570\u5B57", description: "\u9080\u8BF7\u7801\u5141\u8BB8\u5B57\u6BCD\u548C\u6570\u5B57\uFF0C\u7C98\u8D34\u65F6\u4F1A\u53BB\u6389\u8FDE\u63A5\u7B26\u3002", children: _jsx(InputOTP, { accessibilityLabel: "\u9080\u8BF7\u7801", pattern: "^[a-zA-Z0-9]+$", inputMode: "text", placeholder: "------", variant: "secondary", pasteTransformer: (text) => text.replace(/-/g, "") }) }), _jsxs(ExampleSection, { title: "\u72B6\u6001", children: [_jsx(InputOTP, { accessibilityLabel: "\u7981\u7528\u9A8C\u8BC1\u7801", defaultValue: "123456", isDisabled: true }), _jsx(InputOTP, { accessibilityLabel: "\u65E0\u6548\u9A8C\u8BC1\u7801", defaultValue: "1234", maxLength: 4, isInvalid: true }), _jsx(Text, { className: "text-danger", type: "body-sm", children: "\u9A8C\u8BC1\u7801\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u83B7\u53D6\u3002" })] })] }));
}
