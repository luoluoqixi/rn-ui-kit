import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Tabs, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const styles = StyleSheet.create({
    splitHost: { flex: 1, minHeight: 0 },
    splitPane: {
        flex: 1,
        gap: 8,
        justifyContent: "center",
        minHeight: 0,
        minWidth: 0,
        padding: 16,
    },
    splitRoot: { flex: 1, minHeight: 0, paddingBottom: 48 },
    splitToolbar: {
        alignItems: "center",
        borderBottomColor: "rgba(128, 128, 128, 0.24)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        padding: 12,
    },
    tabContent: { padding: 16 },
});
export function TabsExample() {
    const [value, setValue] = useState("preview");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `当前标签：${value}；每个 Tab 的内容会保留在自己的区域。`, title: "\u7F16\u8F91\u5668\u5DE5\u4F5C\u533A", children: _jsx(Tabs, { items: [
                    {
                        content: _jsx(Text, { style: styles.tabContent, children: "\u8FD9\u662F\u9884\u89C8\u6807\u7B7E\u7684\u5185\u5BB9\u3002" }),
                        label: "预览",
                        value: "preview",
                    },
                    {
                        content: (_jsx(Text, { style: styles.tabContent, children: "\u8FD9\u91CC\u53EF\u4EE5\u653E\u63A5\u53E3\u8BF4\u660E\u3001\u5FEB\u6377\u952E\u6216\u8F85\u52A9\u4FE1\u606F\u3002" })),
                        label: "说明",
                        value: "notes",
                    },
                    {
                        content: (_jsx(Text, { style: styles.tabContent, children: "\u63D0\u4EA4\u8BB0\u5F55\u3001\u6784\u5EFA\u65E5\u5FD7\u7B49\u8F83\u957F\u5185\u5BB9\u4E5F\u53EF\u4EE5\u72EC\u7ACB\u7EC4\u7EC7\u3002" })),
                        label: "历史",
                        value: "history",
                    },
                ], onValueChange: setValue, value: value }) }) }));
}
