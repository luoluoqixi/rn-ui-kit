import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Button, NativeList, NativeListButtonItem, NativeListNavigationItem, NativeListSection, NativeSheet, NativeSheetStack, NativeSheetScrollContent, Text, getNativeStackScrollEdgeHeaderOptions, useAppBackgroundColors, } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
import { useDebugNativeListSettings } from "../../../native_list_settings";
function SheetStackIndexScreen() {
    const { basicPressFeedback, iosPressFeedback } = useDebugNativeListSettings();
    const navigation = useNavigation();
    return (_jsx(NativeList, { basicPressFeedback: basicPressFeedback, iosPressFeedback: iosPressFeedback, style: styles.stackList, tracksNavigationBarScrollEdge: true, children: _jsxs(NativeListSection, { footer: "\u70B9\u51FB\u540E\u4F1A\u5728\u5F53\u524D Sheet \u5185\u63A8\u5165\u65B0\u7684 Stack \u9875\u9762\u3002", title: "\u5BFC\u822A", children: [_jsx(NativeListNavigationItem, { onPress: () => navigation.navigate("details"), subtitle: "\u6F14\u793A Stack \u7684\u524D\u8FDB\u4E0E\u8FD4\u56DE", title: "\u6253\u5F00\u8BE6\u60C5\u9875" }), _jsx(NativeListNavigationItem, { onPress: () => navigation.navigate("scroll"), title: "RN \u957F\u5217\u8868\u7ED1\u5B9A", subtitle: "\u5207\u9875\u540E\u9A8C\u8BC1\u53F3\u4FA7\u6EDA\u52A8\u4E0E\u5230\u9876\u4E0B\u62C9" })] }) }));
}
function SheetStackDetailsScreen({ onClose }) {
    const { basicPressFeedback, iosPressFeedback } = useDebugNativeListSettings();
    return (_jsx(NativeList, { basicPressFeedback: basicPressFeedback, iosPressFeedback: iosPressFeedback, style: styles.stackList, tracksNavigationBarScrollEdge: true, children: _jsx(NativeListSection, { footer: "\u53EF\u4F7F\u7528\u5BFC\u822A\u680F\u8FD4\u56DE\u6309\u94AE\u56DE\u5230\u4E0A\u4E00\u9875\u3002", title: "\u8BE6\u60C5", children: _jsx(NativeListButtonItem, { onPress: onClose, title: "\u5173\u95ED Stack Sheet" }) }) }));
}
function SheetStackScrollScreen({ short = false }) {
    const navigation = useNavigation();
    return (_jsxs(NativeSheetScrollContent, { contentContainerStyle: { padding: 20, gap: 12 }, children: [_jsxs(Text, { children: ["\u5F53\u524D\u7ED1\u5B9A\u9875\u9762\uFF1A", short ? "短列表" : "长列表"] }), _jsx(Button, { onPress: () => navigation.navigate(short ? "scroll" : "short"), children: "\u5207\u6362\u957F\u77ED\u5217\u8868\u9875\u9762" }), _jsx(TextInput, { accessibilityLabel: "Stack \u952E\u76D8\u56DE\u5F52\u8F93\u5165\u6846", placeholder: "\u8F93\u5165\u540E\u6536\u8D77\u952E\u76D8\uFF0C\u518D\u8FD4\u56DE\u4E0A\u4E00\u9875", style: { borderWidth: 1, padding: 12 } }), Array.from({ length: short ? 2 : 45 }, (_, i) => (_jsxs(Text, { children: ["\u6EDA\u52A8\u6D4B\u8BD5\u884C ", i + 1, " \u2014 \u4ECE\u5C4F\u5E55\u53F3\u4FA7\u6ED1\u52A8"] }, i)))] }));
}
export function SheetExample() {
    const appBackgroundColors = useAppBackgroundColors();
    const [detentsOpen, setDetentsOpen] = useState(false);
    const [percentOpen, setPercentOpen] = useState(false);
    const [percentPosition, setPercentPosition] = useState(0);
    const [nestedOpen, setNestedOpen] = useState(false);
    const [nestedInnerOpen, setNestedInnerOpen] = useState(false);
    const [nestedPosition, setNestedPosition] = useState(0);
    const [autoOpen, setAutoOpen] = useState(false);
    const [autoRows, setAutoRows] = useState(3);
    const [footerRelative, setFooterRelative] = useState(false);
    const [autoPosition, setAutoPosition] = useState(0);
    const [autoStack, setAutoStack] = useState(false);
    const [stackOpen, setStackOpen] = useState(false);
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: "detents={[0.4, 0.6, 1]}", title: "TrueSheet detents", children: _jsx(Button, { onPress: () => setDetentsOpen(true), children: "\u6253\u5F00\u591A\u6863 detents" }) }), _jsxs(ExampleBlock, { description: 'snapPoints={["40%", "65%", "90%"]}', title: "\u767E\u5206\u6BD4 snapPoints", children: [_jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setPercentPosition(0), variant: "outline", children: "40%" }), _jsx(Button, { onPress: () => setPercentPosition(1), variant: "outline", children: "65%" }), _jsx(Button, { onPress: () => setPercentPosition(2), variant: "outline", children: "90%" })] }), _jsx(ExampleRow, { children: _jsx(Button, { className: "w-full", onPress: () => setPercentOpen(true), children: "\u6253\u5F00\u767E\u5206\u6BD4 Sheet" }) })] }), _jsx(ExampleBlock, { description: "detents={[0.4, 0.85]}", title: "\u5D4C\u5957 TrueSheet", children: _jsx(Button, { onPress: () => setNestedOpen(true), children: "\u6253\u5F00\u5D4C\u5957 Sheet" }) }), _jsxs(ExampleBlock, { description: "iOS \u4F7F\u7528\u539F\u751F Header item\uFF0CAndroid/Web \u4F7F\u7528 React Button", title: "Stack TrueSheet", children: [_jsx(Button, { onPress: () => {
                            setAutoStack(false);
                            setStackOpen(true);
                        }, children: "\u6253\u5F00Stack Sheet" }), _jsx(Button, { onPress: () => {
                            setAutoStack(true);
                            setStackOpen(true);
                        }, children: "\u6253\u5F00 auto Stack Sheet" })] }), _jsx(ExampleBlock, { description: "auto / \u56FA\u5B9A\u6863\u4F4D\u3001\u52A8\u6001\u9AD8\u5EA6\u3001\u952E\u76D8\u548C Footer", title: "v4 \u5E03\u5C40\u56DE\u5F52", children: _jsx(Button, { onPress: () => setAutoOpen(true), children: "\u6253\u5F00 auto \u56DE\u5F52 Sheet" }) }), _jsx(NativeSheet, { name: "true-sheet-v4-auto-regression", open: autoOpen, onOpenChange: setAutoOpen, detents: ["auto", 0.85], position: autoPosition, onSnapPointChange: setAutoPosition, handle: true, footerOptions: { position: footerRelative ? "relative" : "absolute" }, footer: _jsx(View, { style: { padding: 12 }, children: _jsxs(Text, { children: ["Footer\uFF1A", footerRelative ? "relative" : "absolute"] }) }), children: _jsxs(NativeSheetScrollContent, { contentContainerStyle: { padding: 20, gap: 12 }, children: [_jsxs(Text, { children: ["\u52A8\u6001\u884C\u6570\uFF1A", autoRows, "\uFF0C\u6863\u4F4D\uFF1A", autoPosition] }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setAutoRows((v) => (v === 3 ? 30 : 3)), children: "\u957F / \u77ED\u5185\u5BB9" }), _jsx(Button, { onPress: () => setAutoPosition((v) => (v === 0 ? 1 : 0)), children: "\u5207\u6362\u6863\u4F4D" })] }), _jsx(Button, { onPress: () => setFooterRelative((v) => !v), children: "\u5207\u6362 Footer \u5B9A\u4F4D" }), _jsx(TextInput, { accessibilityLabel: "auto \u952E\u76D8\u56DE\u5F52\u8F93\u5165\u6846\u4E00", placeholder: "\u952E\u76D8\u8F93\u5165\u6846\u4E00", style: { borderWidth: 1, padding: 12 } }), _jsx(TextInput, { accessibilityLabel: "auto \u952E\u76D8\u56DE\u5F52\u8F93\u5165\u6846\u4E8C", placeholder: "\u5207\u6362\u5230\u8F93\u5165\u6846\u4E8C", style: { borderWidth: 1, padding: 12 } }), Array.from({ length: autoRows }, (_, i) => (_jsxs(Text, { children: ["\u52A8\u6001\u5185\u5BB9\u7B2C ", i + 1, " \u884C"] }, i))), _jsx(Button, { onPress: () => setAutoOpen(false), children: "\u5173\u95ED\u56DE\u5F52 Sheet" })] }) }), _jsx(NativeSheet, { detents: [0.4, 0.6, 1], handle: true, onOpenChange: setDetentsOpen, open: detentsOpen, children: _jsxs(View, { className: "gap-3 p-5", children: [_jsx(Text, { className: "font-semibold", children: "\u591A\u6863 detents" }), _jsx(Text, { color: "muted", children: "\u591A\u6863 detents [0.4, 0.6, 1]" }), _jsx(Button, { onPress: () => setDetentsOpen(false), variant: "primary", children: "\u5173\u95ED" })] }) }), _jsx(NativeSheet, { handle: true, onOpenChange: setPercentOpen, onSnapPointChange: setPercentPosition, open: percentOpen, position: percentPosition, snapPoints: ["40%", "65%", "90%"], children: _jsxs(View, { className: "gap-3 p-5", children: [_jsx(Text, { className: "font-semibold", children: "\u767E\u5206\u6BD4 snapPoints" }), _jsxs(Text, { color: "muted", children: ["\u5F53\u524D\u6863\u4F4D\uFF1A", ["40%", "65%", "90%"][percentPosition]] }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setPercentPosition(0), variant: "secondary", children: "40%" }), _jsx(Button, { onPress: () => setPercentPosition(1), variant: "secondary", children: "65%" }), _jsx(Button, { onPress: () => setPercentPosition(2), variant: "secondary", children: "90%" })] }), _jsx(Button, { onPress: () => setPercentOpen(false), variant: "primary", children: "\u5173\u95ED" })] }) }), _jsx(NativeSheet, { detents: [0.4, 0.85], handle: true, onOpenChange: setNestedOpen, onSnapPointChange: setNestedPosition, open: nestedOpen, position: nestedPosition, children: _jsxs(View, { className: "gap-3 p-5", children: [_jsx(Text, { className: "font-semibold", children: "\u5916\u5C42 Sheet" }), _jsx(Text, { color: "muted", children: "\u53EF\u4EE5\u7EE7\u7EED\u6253\u5F00\u5185\u5C42 Sheet\u3002detents={[0.4, 0.8]}" }), _jsx(Button, { onPress: () => setNestedOpen(false), variant: "secondary", children: "\u5173\u95ED\u5916\u5C42" }), _jsx(Button, { onPress: () => setNestedInnerOpen(true), children: "\u6253\u5F00\u5185\u5C42 Sheet" })] }) }), _jsx(NativeSheet, { detents: [0.4, 0.8], handle: true, onOpenChange: setNestedInnerOpen, open: nestedInnerOpen, children: _jsxs(View, { className: "gap-3 p-5", children: [_jsx(Text, { className: "font-semibold", children: "\u5185\u5C42 Sheet" }), _jsx(Text, { color: "muted", children: "\u8FD9\u662F\u4ECE\u5916\u5C42 Sheet \u4E2D\u6253\u5F00\u7684\u5D4C\u5957 Sheet\u3002" }), _jsx(Button, { onPress: () => setNestedInnerOpen(false), variant: "secondary", children: "\u5173\u95ED\u5185\u5C42" })] }) }), _jsxs(NativeSheetStack, { initialRouteName: "index", name: "rn-ui-kit-sheet-example-stack", onOpenChange: setStackOpen, open: stackOpen, headerRightButtonProps: {
                    accessibilityLabel: "关闭 Stack Sheet",
                    label: "关闭",
                }, screenOptions: getNativeStackScrollEdgeHeaderOptions({
                    headerBackgroundColor: appBackgroundColors.header,
                    screenBackgroundColor: appBackgroundColors.sheet,
                }), sheetProps: {
                    ...(autoStack
                        ? { detents: ["auto"], maxContentHeight: 650 }
                        : { snapPoints: ["70%"] }),
                }, children: [_jsx(NativeSheetStack.Screen, { name: "index", options: { title: "Stack Sheet" }, children: () => _jsx(SheetStackIndexScreen, {}) }), _jsx(NativeSheetStack.Screen, { name: "scroll", options: { title: "RN 长列表" }, children: () => _jsx(SheetStackScrollScreen, {}) }), _jsx(NativeSheetStack.Screen, { name: "short", options: { title: "RN 短列表" }, children: () => _jsx(SheetStackScrollScreen, { short: true }) }), _jsx(NativeSheetStack.Screen, { name: "details", options: { title: "详情" }, children: () => _jsx(SheetStackDetailsScreen, { onClose: () => setStackOpen(false) }) })] })] }));
}
const styles = StyleSheet.create({
    stackList: {
        flex: 1,
    },
});
