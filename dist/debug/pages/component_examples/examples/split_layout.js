import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, SplitLayout, Text, useAppBackgroundColors, } from "rn-ui-kit/core";
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
});
export function SplitLayoutExample() {
    const layoutRef = useRef(null);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const colors = useAppBackgroundColors();
    const toggleSidebar = () => {
        const nextVisible = !sidebarVisible;
        layoutRef.current?.setVisible(0, nextVisible);
        setSidebarVisible(nextVisible);
    };
    return (_jsxs(View, { style: [styles.splitRoot, { backgroundColor: colors.screen }], children: [_jsxs(View, { style: styles.splitToolbar, children: [_jsx(Button, { className: "border-primary", onPress: toggleSidebar, size: "sm", variant: "outline", children: _jsx(Text, { className: "text-primary", children: sidebarVisible ? "隐藏侧栏" : "显示侧栏" }) }), _jsx(Button, { className: "border-primary", onPress: () => layoutRef.current?.reset(), size: "sm", variant: "outline", children: _jsx(Text, { className: "text-primary", children: "\u91CD\u7F6E\u5C3A\u5BF8" }) }), _jsx(Text, { className: "text-muted-foreground", children: "\u62D6\u52A8\u4E2D\u95F4\u5206\u9694\u6761\u8C03\u6574\u5BBD\u5EA6" })] }), _jsx(View, { style: styles.splitHost, children: _jsxs(SplitLayout, { defaultSizes: [220, 520], minSize: 80, onVisibleChange: (index, visible) => {
                        if (index === 0)
                            setSidebarVisible(visible);
                    }, proportionalLayout: false, ref: layoutRef, children: [_jsx(SplitLayout.Pane, { minSize: 120, preferredSize: 220, snap: true, children: _jsxs(View, { style: [styles.splitPane, { backgroundColor: colors.card }], children: [_jsx(Text, { className: "font-bold", children: "\u4FA7\u680F" }), _jsx(Text, { className: "text-muted-foreground", children: "Pane 1" })] }) }), _jsx(SplitLayout.Pane, { minSize: 180, children: _jsxs(View, { style: [styles.splitPane, { backgroundColor: colors.screen }], children: [_jsx(Text, { variant: "h3", children: "\u4E3B\u5185\u5BB9" }), _jsx(Text, { className: "text-muted-foreground", children: "\u6B64\u793A\u4F8B\u6CA1\u6709\u4F20 storageKey \u6216 storageAdapter\uFF0C\u4E0D\u4F1A\u6301\u4E45\u5316\u3002" })] }) })] }) })] }));
}
