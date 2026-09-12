import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Tabs, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const tabsItems = [
    {
        value: "preview",
        title: "预览",
        content: _jsx(Text, { children: "\u8FD9\u662F\u9884\u89C8\u6807\u7B7E\u7684\u5185\u5BB9\u3002" }),
    },
    {
        value: "notes",
        title: "说明",
        content: _jsx(Text, { children: "\u8FD9\u91CC\u53EF\u4EE5\u653E\u63A5\u53E3\u8BF4\u660E\u3001\u5FEB\u6377\u952E\u6216\u8F85\u52A9\u4FE1\u606F\u3002" }),
    },
    {
        value: "history",
        title: "历史",
        content: _jsx(Text, { children: "\u63D0\u4EA4\u8BB0\u5F55\u3001\u6784\u5EFA\u65E5\u5FD7\u7B49\u8F83\u957F\u5185\u5BB9\u4E5F\u53EF\u4EE5\u72EC\u7ACB\u7EC4\u7EC7\u3002" }),
    },
];
const tabsSizeItems = [
    {
        value: "preview",
        title: "预览",
        content: _jsx(_Fragment, {}),
    },
    {
        value: "notes",
        title: "说明",
        content: _jsx(_Fragment, {}),
    },
    {
        value: "history",
        title: "历史",
        content: _jsx(_Fragment, {}),
    },
];
export function TabsExample() {
    const [value, setValue] = useState("preview");
    const [valueSize, setValueSize] = useState("preview");
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: `当前标签：${value}`, title: "\u7F16\u8F91\u5668\u5DE5\u4F5C\u533A", children: _jsx(Tabs, { className: "w-full", items: tabsItems, onValueChange: setValue, value: value }) }), _jsxs(ExampleBlock, { title: "\u5927\u5C0F", children: [_jsx(Tabs, { size: "2xs", className: "w-full", items: tabsSizeItems, onValueChange: setValueSize, value: valueSize }), _jsx(Tabs, { size: "xs", className: "w-full", items: tabsSizeItems, onValueChange: setValueSize, value: valueSize }), _jsx(Tabs, { size: "sm", className: "w-full", items: tabsSizeItems, onValueChange: setValueSize, value: valueSize }), _jsx(Tabs, { size: "md", className: "w-full", items: tabsSizeItems, onValueChange: setValueSize, value: valueSize }), _jsx(Tabs, { size: "lg", className: "w-full", items: tabsSizeItems, onValueChange: setValueSize, value: valueSize }), _jsx(Tabs, { size: "xl", className: "w-full", items: tabsSizeItems, onValueChange: setValueSize, value: valueSize }), _jsx(Tabs, { size: "2xl", className: "w-full", items: tabsSizeItems, onValueChange: setValueSize, value: valueSize })] })] }));
}
