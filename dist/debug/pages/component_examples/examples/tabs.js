import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Tabs, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function TabsExample() {
    const [value, setValue] = useState("overview");
    const items = [
        {
            value: "overview",
            title: "概览",
            content: _jsx(Text, { children: "\u67E5\u770B\u9879\u76EE\u72B6\u6001\u4E0E\u6700\u8FD1\u6D3B\u52A8\u3002" }),
        },
        {
            value: "activity",
            title: "动态",
            content: _jsx(Text, { children: "\u56E2\u961F\u7684\u6700\u65B0\u64CD\u4F5C\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002" }),
        },
        {
            value: "settings",
            title: "设置",
            content: _jsx(Text, { children: "\u7BA1\u7406\u9879\u76EE\u504F\u597D\u4E0E\u6210\u5458\u6743\u9650\u3002" }),
        },
    ];
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleSection, { title: "\u80F6\u56CA\u6837\u5F0F", children: _jsx(Tabs, { items: items, value: value, onValueChange: setValue, variant: "primary", accessibilityLabel: "\u9879\u76EE\u5185\u5BB9" }) }), _jsx(ExampleSection, { title: "\u4E0B\u5212\u7EBF\u6837\u5F0F", children: _jsx(Tabs, { items: items, defaultValue: "activity", variant: "secondary", accessibilityLabel: "\u9879\u76EE\u5206\u533A" }) }), _jsx(ExampleSection, { title: "\u7981\u7528\u9009\u9879", children: _jsx(Tabs, { items: items.map((item) => ({
                        ...item,
                        isDisabled: item.value === "settings",
                    })), accessibilityLabel: "\u53EF\u7528\u5206\u533A" }) }), _jsx(ExampleSection, { title: "\u6A2A\u5411\u6EDA\u52A8", children: _jsx(Tabs, { isScrollable: true, accessibilityLabel: "\u5DE5\u4F5C\u53F0", items: [
                        "收件箱",
                        "进行中",
                        "待审核",
                        "已完成",
                        "已归档",
                        "项目设置",
                    ].map((title, index) => ({
                        value: String(index),
                        title,
                        content: _jsxs(Text, { children: [title, "\u4E2D\u7684\u5185\u5BB9\u3002"] }),
                    })) }) })] }));
}
