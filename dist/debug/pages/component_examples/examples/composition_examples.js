import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Accordion, Button, SplitLayout, Tabs, Text, useAppBackgroundColors, } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
function AccordionExample() {
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: "\u5355\u9009\u6A21\u5F0F\u9002\u5408 FAQ\u3001\u8BBE\u7F6E\u5206\u7EC4\u7B49\u4E00\u6B21\u53EA\u5173\u6CE8\u4E00\u9879\u7684\u5185\u5BB9\u3002", title: "\u5355\u9879\u5C55\u5F00", children: _jsx(Accordion, { collapsible: true, items: [
                        {
                            content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4\u751F\u6210 Header\u3001Trigger \u548C Content\u3002" }),
                            title: "基础结构",
                            value: "structure",
                        },
                        {
                            content: (_jsx(Text, { children: "\u901A\u8FC7 items \u53EF\u4EE5\u5FEB\u901F\u751F\u6210\u591A\u4E2A\u6761\u76EE\uFF0C\u4E5F\u80FD\u7EDF\u4E00\u914D\u7F6E Header \u548C Trigger\u3002" })),
                            title: "数据驱动",
                            value: "items",
                        },
                        {
                            content: _jsx(Text, { children: "\u5173\u95ED\u5F53\u524D\u9879\u540E\uFF0C\u9875\u9762\u4F1A\u4FDD\u7559\u5B8C\u6574\u7684\u5217\u8868\u7ED3\u6784\u3002" }),
                            title: "可收起",
                            value: "collapsible",
                        },
                    ], type: "single" }) }), _jsx(ExampleBlock, { description: "\u591A\u9009\u6A21\u5F0F\u5141\u8BB8\u540C\u65F6\u5BF9\u7167\u591A\u4E2A\u8BF4\u660E\u3002", title: "\u591A\u9879\u5C55\u5F00", children: _jsx(Accordion, { items: [
                        { content: _jsx(Text, { children: "\u652F\u6301\u540C\u65F6\u5C55\u5F00\u591A\u4E2A\u9762\u677F\u3002" }), title: "缓存策略", value: "cache" },
                        {
                            content: _jsx(Text, { children: "\u5185\u5BB9\u533A\u57DF\u53EF\u4EE5\u653E\u4EFB\u610F React \u8282\u70B9\u3002" }),
                            title: "同步策略",
                            value: "sync",
                        },
                    ], type: "multiple" }) })] }));
}
function TabsExample() {
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
function SplitLayoutExample() {
    const layoutRef = useRef(null);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const colors = useAppBackgroundColors();
    const toggleSidebar = () => {
        const nextVisible = !sidebarVisible;
        layoutRef.current?.setVisible(0, nextVisible);
        setSidebarVisible(nextVisible);
    };
    return (_jsxs(View, { style: [styles.splitRoot, { backgroundColor: colors.screen }], children: [_jsxs(View, { style: styles.splitToolbar, children: [_jsx(Button, { onPress: toggleSidebar, size: "$3", variant: "outlined", children: sidebarVisible ? "隐藏侧栏" : "显示侧栏" }), _jsx(Button, { onPress: () => layoutRef.current?.reset(), size: "$3", variant: "outlined", children: "\u91CD\u7F6E\u5C3A\u5BF8" }), _jsx(Text, { opacity: 0.6, children: "\u62D6\u52A8\u4E2D\u95F4\u5206\u9694\u6761\u8C03\u6574\u5BBD\u5EA6" })] }), _jsx(View, { style: styles.splitHost, children: _jsxs(SplitLayout, { defaultSizes: [220, 520], minSize: 80, onVisibleChange: (index, visible) => {
                        if (index === 0)
                            setSidebarVisible(visible);
                    }, proportionalLayout: false, ref: layoutRef, children: [_jsx(SplitLayout.Pane, { minSize: 120, preferredSize: 220, snap: true, children: _jsxs(View, { style: [styles.splitPane, { backgroundColor: colors.card }], children: [_jsx(Text, { fontWeight: "700", children: "\u4FA7\u680F" }), _jsx(Text, { opacity: 0.6, children: "Pane 1" })] }) }), _jsx(SplitLayout.Pane, { minSize: 180, children: _jsxs(View, { style: [styles.splitPane, { backgroundColor: colors.screen }], children: [_jsx(Text, { fontSize: "$7", fontWeight: "700", children: "\u4E3B\u5185\u5BB9" }), _jsx(Text, { opacity: 0.6, children: "\u6B64\u793A\u4F8B\u6CA1\u6709\u4F20 storageKey \u6216 storageAdapter\uFF0C\u4E0D\u4F1A\u6301\u4E45\u5316\u3002" })] }) })] }) })] }));
}
export const compositionExamples = [
    {
        Component: AccordionExample,
        group: "组合与布局",
        key: "accordion",
        label: "Accordion",
    },
    {
        Component: TabsExample,
        group: "组合与布局",
        key: "tabs",
        label: "Tabs",
    },
    {
        Component: SplitLayoutExample,
        group: "组合与布局",
        key: "split-view",
        label: "SplitView / SplitLayout",
        layout: "fill",
    },
];
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
