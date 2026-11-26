import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Check } from "lucide-react-native";
import { Checkbox, Icon, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function CheckboxExample() {
    const [selected, setSelected] = useState(false);
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleSection, { title: "\u57FA\u672C\u7528\u6CD5", children: [_jsx(Checkbox, { label: "\u63A5\u6536\u4EA7\u54C1\u66F4\u65B0", description: "\u6211\u4EEC\u53EA\u4F1A\u53D1\u9001\u91CD\u8981\u53D1\u5E03\u4FE1\u606F\u3002", isSelected: selected, onSelectedChange: setSelected }), _jsx(Text, { color: "muted", children: selected ? "已订阅" : "未订阅" })] }), _jsxs(ExampleSection, { title: "\u72B6\u6001", children: [_jsx(Checkbox, { label: "\u5DF2\u9009\u4E2D", defaultSelected: true }), _jsx(Checkbox, { label: "\u7981\u7528", isDisabled: true }), _jsx(Checkbox, { label: "\u5DF2\u9009\u4E2D\u5E76\u7981\u7528", defaultSelected: true, isDisabled: true }), _jsx(Checkbox, { label: "\u63A5\u53D7\u670D\u52A1\u6761\u6B3E", isInvalid: true, errorMessage: "\u8BF7\u5148\u540C\u610F\u670D\u52A1\u6761\u6B3E\u3002" })] }), _jsx(ExampleSection, { title: "\u81EA\u5B9A\u4E49\u6307\u793A\u5668", children: _jsx(Checkbox, { label: "\u5706\u5F62\u9009\u6846", controlProps: { className: "rounded-full" }, indicator: ({ isSelected }) => isSelected ? (_jsx(Icon, { as: Check, size: 12, className: "text-accent-foreground" })) : null, defaultSelected: true }) })] }));
}
