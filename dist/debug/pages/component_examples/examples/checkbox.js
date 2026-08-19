import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Checkbox } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function CheckboxExample() {
    const [permissions, setPermissions] = useState({ analytics: true, updates: false, weekly: true });
    const selectedCount = Object.values(permissions).filter(Boolean).length;
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: `已启用 ${selectedCount}/3 项通知`, title: "\u901A\u77E5\u504F\u597D", children: [_jsx(Checkbox, { checked: permissions.updates, label: "\u4EA7\u54C1\u66F4\u65B0", onCheckedChange: (updates) => setPermissions((current) => ({ ...current, updates: updates === true })) }), _jsx(Checkbox, { checked: permissions.weekly, label: "\u6BCF\u5468\u6458\u8981", onCheckedChange: (weekly) => setPermissions((current) => ({ ...current, weekly: weekly === true })) }), _jsx(Checkbox, { checked: permissions.analytics, label: "\u533F\u540D\u4F7F\u7528\u5206\u6790", onCheckedChange: (analytics) => setPermissions((current) => ({ ...current, analytics: analytics === true })) })] }) }));
}
