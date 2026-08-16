import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Switch } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function SwitchExample() {
    const [syncEnabled, setSyncEnabled] = useState(true);
    const [wifiOnly, setWifiOnly] = useState(false);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u5F00\u5173\u9002\u5408\u5373\u65F6\u751F\u6548\u7684\u72EC\u7ACB\u504F\u597D\u3002", title: "\u540C\u6B65\u8BBE\u7F6E", children: [_jsx(Switch, { checked: syncEnabled, label: "\u81EA\u52A8\u540C\u6B65", labelPosition: "end", onCheckedChange: setSyncEnabled }), _jsx(Switch, { checked: wifiOnly, disabled: !syncEnabled, label: "\u4EC5 Wi-Fi \u540C\u6B65", labelPosition: "end", onCheckedChange: setWifiOnly }), _jsx(Switch, { checked: wifiOnly, disabled: !syncEnabled, label: "\u4EC5 Wi-Fi \u540C\u6B65\uFF08native=false\uFF09", labelPosition: "end", onCheckedChange: setWifiOnly, native: false })] }) }));
}
