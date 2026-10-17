import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, NativeList, NativeListButtonItem, NativeListNavigationItem, NativeListSection, NativeSheet, NativeSheetStack, Text, getNativeStackScrollEdgeHeaderOptions, useAppBackgroundColors, } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
function SheetStackIndexScreen() {
    const navigation = useNavigation();
    return (_jsx(NativeList, { style: styles.stackList, tracksNavigationBarScrollEdge: true, children: _jsx(NativeListSection, { footer: "\u70B9\u51FB\u540E\u4F1A\u5728\u5F53\u524D Sheet \u5185\u63A8\u5165\u65B0\u7684 Stack \u9875\u9762\u3002", title: "\u5BFC\u822A", children: _jsx(NativeListNavigationItem, { onPress: () => navigation.navigate("details"), subtitle: "\u6F14\u793A Stack \u7684\u524D\u8FDB\u4E0E\u8FD4\u56DE", title: "\u6253\u5F00\u8BE6\u60C5\u9875" }) }) }));
}
function SheetStackDetailsScreen({ onClose }) {
    return (_jsx(NativeList, { style: styles.stackList, tracksNavigationBarScrollEdge: true, children: _jsx(NativeListSection, { footer: "\u53EF\u4F7F\u7528\u5BFC\u822A\u680F\u8FD4\u56DE\u6309\u94AE\u56DE\u5230\u4E0A\u4E00\u9875\u3002", title: "\u8BE6\u60C5", children: _jsx(NativeListButtonItem, { onPress: onClose, title: "\u5173\u95ED Stack Sheet" }) }) }));
}
export function SheetExample() {
    const appBackgroundColors = useAppBackgroundColors();
    const [detentsOpen, setDetentsOpen] = useState(false);
    const [percentOpen, setPercentOpen] = useState(false);
    const [percentPosition, setPercentPosition] = useState(0);
    const [nestedOpen, setNestedOpen] = useState(false);
    const [nestedInnerOpen, setNestedInnerOpen] = useState(false);
    const [nestedPosition, setNestedPosition] = useState(0);
    const [stackOpen, setStackOpen] = useState(false);
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: "detents={[0.4, 0.6, 1]}", title: "TrueSheet detents", children: _jsx(Button, { onPress: () => setDetentsOpen(true), children: "\u6253\u5F00\u591A\u6863 detents" }) }), _jsxs(ExampleBlock, { description: 'snapPoints={["40%", "65%", "90%"]}', title: "\u767E\u5206\u6BD4 snapPoints", children: [_jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setPercentPosition(0), variant: "outline", children: "40%" }), _jsx(Button, { onPress: () => setPercentPosition(1), variant: "outline", children: "65%" }), _jsx(Button, { onPress: () => setPercentPosition(2), variant: "outline", children: "90%" })] }), _jsx(ExampleRow, { children: _jsx(Button, { className: "w-full", onPress: () => setPercentOpen(true), children: "\u6253\u5F00\u767E\u5206\u6BD4 Sheet" }) })] }), _jsx(ExampleBlock, { description: "detents={[0.4, 0.85]}", title: "\u5D4C\u5957 TrueSheet", children: _jsx(Button, { onPress: () => setNestedOpen(true), children: "\u6253\u5F00\u5D4C\u5957 Sheet" }) }), _jsx(ExampleBlock, { description: "iOS \u4F7F\u7528\u539F\u751F Header item\uFF0CAndroid/Web \u4F7F\u7528 React Button", title: "Stack TrueSheet", children: _jsx(Button, { onPress: () => setStackOpen(true), children: "\u6253\u5F00Stack Sheet" }) }), _jsx(NativeSheet, { detents: [0.4, 0.6, 1], handle: true, onOpenChange: setDetentsOpen, open: detentsOpen, children: _jsxs(View, { className: "gap-3 p-5", children: [_jsx(Text, { className: "font-semibold", children: "\u591A\u6863 detents" }), _jsx(Text, { variant: "muted", children: "\u591A\u6863 detents [0.4, 0.6, 1]" }), _jsx(Button, { onPress: () => setDetentsOpen(false), variant: "outline", children: "\u5173\u95ED" })] }) }), _jsx(NativeSheet, { handle: true, onOpenChange: setPercentOpen, onSnapPointChange: setPercentPosition, open: percentOpen, position: percentPosition, snapPoints: ["40%", "65%", "90%"], children: _jsxs(View, { className: "gap-3 p-5", children: [_jsx(Text, { className: "font-semibold", children: "\u767E\u5206\u6BD4 snapPoints" }), _jsxs(Text, { variant: "muted", children: ["\u5F53\u524D\u6863\u4F4D\uFF1A", ["40%", "65%", "90%"][percentPosition]] }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setPercentPosition(0), variant: "outline", children: "40%" }), _jsx(Button, { onPress: () => setPercentPosition(1), variant: "outline", children: "65%" }), _jsx(Button, { onPress: () => setPercentPosition(2), variant: "outline", children: "90%" })] }), _jsx(Button, { onPress: () => setPercentOpen(false), variant: "outline", children: "\u5173\u95ED" })] }) }), _jsx(NativeSheet, { detents: [0.4, 0.85], handle: true, onOpenChange: setNestedOpen, onSnapPointChange: setNestedPosition, open: nestedOpen, position: nestedPosition, children: _jsxs(View, { className: "gap-3 p-5", children: [_jsx(Text, { className: "font-semibold", children: "\u5916\u5C42 Sheet" }), _jsx(Text, { variant: "muted", children: "\u53EF\u4EE5\u7EE7\u7EED\u6253\u5F00\u5185\u5C42 Sheet\u3002detents={[0.4, 0.8]}" }), _jsx(Button, { onPress: () => setNestedOpen(false), variant: "outline", children: "\u5173\u95ED\u5916\u5C42" }), _jsx(Button, { onPress: () => setNestedInnerOpen(true), children: "\u6253\u5F00\u5185\u5C42 Sheet" })] }) }), _jsx(NativeSheet, { detents: [0.4, 0.8], handle: true, onOpenChange: setNestedInnerOpen, open: nestedInnerOpen, children: _jsxs(View, { className: "gap-3 p-5", children: [_jsx(Text, { className: "font-semibold", children: "\u5185\u5C42 Sheet" }), _jsx(Text, { variant: "muted", children: "\u8FD9\u662F\u4ECE\u5916\u5C42 Sheet \u4E2D\u6253\u5F00\u7684\u5D4C\u5957 Sheet\u3002" }), _jsx(Button, { onPress: () => setNestedInnerOpen(false), variant: "outline", children: "\u5173\u95ED\u5185\u5C42" })] }) }), _jsxs(NativeSheetStack, { initialRouteName: "index", name: "rn-ui-kit-sheet-example-stack", onOpenChange: setStackOpen, open: stackOpen, headerRightButtonProps: {
                    accessibilityLabel: "关闭 Stack Sheet",
                    label: "关闭",
                }, screenOptions: getNativeStackScrollEdgeHeaderOptions({
                    headerBackgroundColor: appBackgroundColors.header,
                    screenBackgroundColor: appBackgroundColors.sheet,
                }), sheetProps: {
                    snapPoints: ["70%"],
                }, children: [_jsx(NativeSheetStack.Screen, { name: "index", options: { title: "Stack Sheet" }, children: () => _jsx(SheetStackIndexScreen, {}) }), _jsx(NativeSheetStack.Screen, { name: "details", options: { title: "详情" }, children: () => _jsx(SheetStackDetailsScreen, { onClose: () => setStackOpen(false) }) })] })] }));
}
const styles = StyleSheet.create({
    stackList: {
        flex: 1,
    },
});
