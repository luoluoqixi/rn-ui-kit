import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Form, Input, Label, Text, TextArea } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function FormExample() {
    const [name, setName] = useState("demo-workspace");
    const [description, setDescription] = useState("这是一个可分享的组件实验工作区。");
    const [submitCount, setSubmitCount] = useState(0);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u4E00\u4E2A\u63D0\u4EA4\u89E6\u53D1\u5668\u7BA1\u7406\u591A\u4E2A\u53D7\u63A7\u5B57\u6BB5\u3002", title: "\u521B\u5EFA\u5DE5\u4F5C\u533A", children: [_jsxs(Form, { triggerProps: {
                        style: {
                            marginTop: 10,
                        },
                    }, onSubmit: () => setSubmitCount((current) => current + 1), trigger: _jsx(Button, { theme: "accent", children: "\u63D0\u4EA4" }), children: [_jsx(Label, { htmlFor: "component-example-form-name", children: "\u540D\u79F0" }), _jsx(Input, { id: "component-example-form-name", onChangeText: setName, placeholder: "\u5DE5\u4F5C\u533A\u540D\u79F0", value: name }), _jsx(Label, { htmlFor: "component-example-form-description", children: "\u8BF4\u660E" }), _jsx(TextArea, { id: "component-example-form-description", onChangeText: setDescription, rows: 3, value: description })] }), _jsxs(Text, { opacity: 0.6, children: ["\u5DF2\u63D0\u4EA4 ", submitCount, " \u6B21\uFF1A", name || "未命名", " \u00B7 ", description.length, " \u4E2A\u5B57\u7B26"] })] }) }));
}
