import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { isWeb, Separator, Switch } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function SwitchExample() {
    const [checked, setChecked] = useState(false);
    const [checkedLeft, setCheckedLeft] = useState(false);
    const [checkedNative, setCheckedNative] = useState(false);
    const [checkedNativeLeft, setCheckedNativeLeft] = useState(false);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: checked ? "已开启" : "已关闭", title: "\u98DE\u884C\u6A21\u5F0F", children: [_jsx(Switch, { checked: checked, label: "\u98DE\u884C\u6A21\u5F0F", onCheckedChange: setChecked }), _jsx(Switch, { labelPosition: "left", checked: checkedLeft, label: "\u98DE\u884C\u6A21\u5F0F", onCheckedChange: setCheckedLeft }), _jsx(Switch, { disabled: true, labelPosition: "left", checked: checkedLeft, label: "\u98DE\u884C\u6A21\u5F0F", onCheckedChange: setCheckedLeft }), !isWeb() && (_jsxs(_Fragment, { children: [_jsx(Separator, {}), _jsx(Switch, { native: true, checked: checkedNative, label: "\u98DE\u884C\u6A21\u5F0F", onCheckedChange: setCheckedNative }), _jsx(Switch, { labelPosition: "left", native: true, checked: checkedNativeLeft, label: "\u98DE\u884C\u6A21\u5F0F", onCheckedChange: setCheckedNativeLeft }), _jsx(Switch, { disabled: true, labelPosition: "left", native: true, checked: checkedNativeLeft, label: "\u98DE\u884C\u6A21\u5F0F", onCheckedChange: setCheckedNativeLeft })] }))] }) }));
}
