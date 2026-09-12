import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Checkbox } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function CheckboxExample() {
    const [values, setValues] = useState({
        terms: true,
        terms2: true,
        termsWithDescription: true,
        notifications: false,
        notifications2: false,
        xs: false,
        sm: false,
        md: false,
        lg: false,
        xl: false,
    });
    const update = (key) => (checked) => {
        setValues((current) => ({ ...current, [key]: checked }));
    };
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { title: "\u901A\u77E5\u504F\u597D", children: [_jsx(Checkbox, { checked: values.terms2, onCheckedChange: update("terms2"), label: "\u63A5\u53D7\u670D\u52A1\u6761\u6B3E Left", labelPosition: "left", id: "checkbox-terms-left" }), _jsx(Checkbox, { checked: values.terms, onCheckedChange: update("terms"), label: "\u63A5\u53D7\u670D\u52A1\u6761\u6B3E", id: "checkbox-terms" }), _jsx(Checkbox, { checked: values.termsWithDescription, onCheckedChange: update("termsWithDescription"), label: "\u63A5\u53D7\u670D\u52A1\u6761\u6B3E", description: "\u52FE\u9009\u6B64\u9879\u5373\u8868\u793A\u4F60\u540C\u610F\u670D\u52A1\u6761\u6B3E\u548C\u9690\u79C1\u653F\u7B56\u3002", id: "checkbox-terms-description" }), _jsx(Checkbox, { label: "\u542F\u7528\u901A\u77E5", id: "checkbox-notifications", disabled: true }), _jsx(Checkbox, { checked: values.notifications, onCheckedChange: update("notifications"), label: "\u542F\u7528\u901A\u77E5 Right", description: "\u4F60\u53EF\u4EE5\u968F\u65F6\u542F\u7528\u6216\u505C\u7528\u901A\u77E5\u3002", labelPosition: "right", card: true, id: "checkbox-notifications-card", checkedClassName: "border-primary bg-primary", indicatorClassName: "bg-primary", iconClassName: "text-primary-foreground" }), _jsx(Checkbox, { checked: values.notifications2, onCheckedChange: update("notifications2"), label: "\u542F\u7528\u901A\u77E5 Left", description: "\u4F60\u53EF\u4EE5\u968F\u65F6\u542F\u7528\u6216\u505C\u7528\u901A\u77E5\u3002", labelPosition: "left", card: true, id: "checkbox-notifications-card2", checkedClassName: "border-primary bg-primary", indicatorClassName: "bg-primary", iconClassName: "text-primary-foreground" })] }), _jsxs(ExampleBlock, { title: "\u5927\u5C0F\u793A\u4F8B", children: [_jsx(Checkbox, { checked: values.xs, onCheckedChange: update("xs"), label: "\u8D85\u5C0F Checkbox", size: "xs", id: "checkbox-xs" }), _jsx(Checkbox, { checked: values.sm, onCheckedChange: update("sm"), label: "\u5C0F Checkbox", size: "sm", id: "checkbox-sm" }), _jsx(Checkbox, { checked: values.md, onCheckedChange: update("md"), label: "\u9ED8\u8BA4 Checkbox", size: "md", id: "checkbox-md" }), _jsx(Checkbox, { checked: values.lg, onCheckedChange: update("lg"), label: "\u5927 Checkbox", size: "lg", id: "checkbox-lg" }), _jsx(Checkbox, { checked: values.xl, onCheckedChange: update("xl"), label: "\u8D85\u5927 Checkbox", size: "xl", id: "checkbox-xl" })] })] }));
}
