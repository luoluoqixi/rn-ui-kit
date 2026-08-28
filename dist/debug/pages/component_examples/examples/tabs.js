import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Tabs, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function TabsExample() {
    const [value, setValue] = useState("preview");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `当前标签：${value}`, title: "\u7F16\u8F91\u5668\u5DE5\u4F5C\u533A", children: _jsx(Tabs, { className: "w-full", items: [
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
                ], onValueChange: setValue, value: value }) }) }));
}
