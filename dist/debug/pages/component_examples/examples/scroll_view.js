import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollView, Slider, Switch, Text } from "rn-ui-kit/core";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ExampleBlock, ExampleStack } from "../shared";
export function ScrollViewExample() {
    const [customScrollbar, setCustomScrollbar] = useState(false);
    const [horizontalInset, setHorizontalInset] = useState(0);
    const [verticalInset, setVerticalInset] = useState(0);
    const scrollbarInsets = {
        bottom: verticalInset,
        left: horizontalInset,
        right: horizontalInset,
        top: verticalInset,
    };
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { title: "\u72EC\u7ACB\u6EDA\u52A8\u533A\u57DF", children: [_jsx(Switch, { checked: customScrollbar, label: "\u53EF\u62D6\u62FD\u6EDA\u52A8\u6761", onCheckedChange: setCustomScrollbar }), _jsx(View, { style: styles.scrollFrame, children: _jsx(ScrollView, { contentContainerStyle: styles.scrollContent, customScrollbar: customScrollbar, nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: styles.scrollView, children: Array.from({ length: 30 }, (_, index) => (_jsx(View, { style: styles.listRow, children: _jsxs(Text, { children: ["\u7B2C ", index + 1, " \u884C\u793A\u4F8B\u5185\u5BB9"] }) }, index))) }) })] }), _jsxs(ExampleBlock, { title: "\u6EDA\u52A8\u6761\u504F\u79FB", children: [_jsxs(View, { style: styles.insetControl, children: [_jsxs(Text, { children: ["\u4E0A\u4E0B\u504F\u79FB: ", verticalInset, "px"] }), _jsx(Slider, { max: 64, min: 0, native: false, onChange: setVerticalInset, step: 1, value: verticalInset })] }), _jsxs(View, { style: styles.insetControl, children: [_jsxs(Text, { children: ["\u5DE6\u53F3\u504F\u79FB: ", horizontalInset, "px"] }), _jsx(Slider, { max: 64, min: 0, native: false, onChange: setHorizontalInset, step: 1, value: horizontalInset })] }), _jsx(View, { style: styles.scrollFrame, children: _jsx(ScrollView, { contentContainerStyle: styles.scrollContent, customScrollbar: { insets: scrollbarInsets }, style: styles.scrollView, children: Array.from({ length: 30 }, (_, index) => (_jsx(View, { style: styles.listRow, children: _jsxs(Text, { children: ["\u7B2C ", index + 1, " \u884C\u504F\u79FB\u6D4B\u8BD5\u5185\u5BB9"] }) }, index))) }) }), _jsx(View, { style: styles.horizontalScrollFrame, children: _jsx(ScrollView, { contentContainerStyle: styles.horizontalScrollContent, customScrollbar: {
                                insets: scrollbarInsets,
                            }, horizontal: true, showsHorizontalScrollIndicator: true, style: styles.scrollView, children: Array.from({ length: 12 }, (_, index) => (_jsx(View, { style: styles.horizontalItem, children: _jsxs(Text, { children: ["\u9879\u76EE ", index + 1] }) }, index))) }) })] })] }));
}
const styles = StyleSheet.create({
    listRow: {
        borderBottomColor: "rgba(128, 128, 128, 0.22)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        minHeight: 48,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    horizontalItem: {
        alignItems: "center",
        backgroundColor: "rgba(128, 128, 128, 0.12)",
        borderRadius: 8,
        height: 96,
        justifyContent: "center",
        width: 96,
    },
    insetControl: { gap: 6 },
    horizontalScrollContent: { columnGap: 12, paddingHorizontal: 12, paddingTop: 12 },
    horizontalScrollFrame: { height: 140, minHeight: 0 },
    scrollContent: { paddingBottom: 16 },
    scrollFrame: { height: 260, minHeight: 0 },
    scrollView: { flex: 1 },
});
