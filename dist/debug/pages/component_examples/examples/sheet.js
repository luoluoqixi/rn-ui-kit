import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, NativeSheet, Sheet, Switch, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
function ExampleModalSheet({ content, native, onOpenChange, onPositionChange, open, position, snapPoints, snapPointsMode, }) {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    if (native) {
        return (_jsx(View, { pointerEvents: "box-none", style: [styles.nativeSheetHost, { height: windowHeight, width: windowWidth }], children: _jsx(NativeSheet, { content: content, handle: true, modal: true, onOpenChange: onOpenChange, onPositionChange: onPositionChange, open: open, overlay: true, position: position, snapPoints: snapPoints, snapPointsMode: snapPointsMode }) }));
    }
    return (_jsx(Sheet, { content: content, dismissOnSnapToBottom: true, handle: true, modal: true, onOpenChange: onOpenChange, onPositionChange: onPositionChange, open: open, overlay: true, position: position, snapPoints: snapPoints, snapPointsMode: snapPointsMode, transition: "200ms" }));
}
function SheetContent({ children, description, onClose, title, }) {
    return (_jsxs(View, { style: styles.sheetContent, children: [_jsx(Text, { fontSize: "$6", fontWeight: "700", children: title }), _jsx(Text, { opacity: 0.6, children: description }), children, _jsx(Button, { onPress: onClose, theme: "accent", children: "\u5173\u95ED Sheet" })] }));
}
const styles = StyleSheet.create({
    dialogContent: { gap: 8 },
    nativeSheetHost: { left: 0, position: "absolute", top: 0 },
    popoverContent: { gap: 12, minWidth: 240, padding: 12 },
    sheetContent: { gap: 16, padding: 24 },
    sheetItem: {
        borderColor: "rgba(128, 128, 128, 0.28)",
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
});
export function SheetExample() {
    const [native, setNative] = useState(true);
    const [inlineOpen, setInlineOpen] = useState(false);
    const [inlinePosition, setInlinePosition] = useState(0);
    const [percentOpen, setPercentOpen] = useState(false);
    const [percentPosition, setPercentPosition] = useState(0);
    const [constantOpen, setConstantOpen] = useState(false);
    const [constantPosition, setConstantPosition] = useState(0);
    const [fitOpen, setFitOpen] = useState(false);
    const [fitPosition, setFitPosition] = useState(0);
    const [mixedOpen, setMixedOpen] = useState(false);
    const [mixedPosition, setMixedPosition] = useState(0);
    const [nestedOpen, setNestedOpen] = useState(false);
    const [nestedPosition, setNestedPosition] = useState(0);
    const sheetItems = ["最近工作区", "主题与外观", "同步状态", "导出设置"];
    const openSheet = (setOpen, setPosition) => {
        setPosition(0);
        setOpen(true);
    };
    const renderItems = () => sheetItems.map((item) => (_jsx(View, { style: styles.sheetItem, children: _jsx(Text, { children: item }) }, item)));
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u9664\u57FA\u7840 Sheet \u5916\uFF0C\u8FD9\u91CC\u8986\u76D6 percent\u3001constant\u3001fit\u3001mixed \u548C\u5D4C\u5957\u6D6E\u5C42\u3002", title: "\u591A\u79CD Sheet \u5F62\u5F0F", children: [_jsx(Switch, { checked: native, label: "\u4F7F\u7528 NativeSheet", labelPosition: "end", onCheckedChange: setNative }), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => openSheet(setInlineOpen, setInlinePosition), variant: "outlined", children: "Inline percent" }), _jsx(Button, { onPress: () => openSheet(setPercentOpen, setPercentPosition), variant: "outlined", children: "\u5168\u5C40 percent" }), _jsx(Button, { onPress: () => openSheet(setConstantOpen, setConstantPosition), variant: "outlined", children: "constant" }), _jsx(Button, { onPress: () => openSheet(setFitOpen, setFitPosition), variant: "outlined", children: "fit" }), _jsx(Button, { onPress: () => openSheet(setMixedOpen, setMixedPosition), variant: "outlined", children: "mixed" })] }), _jsxs(Text, { opacity: 0.6, children: ["inline\uFF1A", inlineOpen ? `打开，position=${inlinePosition}` : "关闭", " \u00B7 percent\uFF1A", percentOpen ? `打开，position=${percentPosition}` : "关闭"] }), _jsxs(Text, { opacity: 0.6, children: ["constant\uFF1A", constantOpen ? `打开，position=${constantPosition}` : "关闭", " \u00B7 fit\uFF1A", fitOpen ? `打开，position=${fitPosition}` : "关闭", " \u00B7 mixed\uFF1A", mixedOpen ? `打开，position=${mixedPosition}` : "关闭"] }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setInlineOpen, open: inlineOpen, children: _jsx(Sheet, { content: _jsxs(SheetContent, { description: "\u975E modal \u7684 inline Sheet \u4F7F\u7528 percent snap points\uFF0C\u5E76\u53EF\u5728\u5F53\u524D\u9875\u9762\u5185\u62D6\u62FD\u3002", onClose: () => setInlineOpen(false), title: "Inline Sheet", children: [renderItems(), _jsx(Button, { onPress: () => setInlinePosition(1), variant: "outlined", children: "\u5207\u5230\u7B2C\u4E8C\u6863" })] }), dismissOnSnapToBottom: true, handle: true, modal: false, onOpenChange: setInlineOpen, onPositionChange: setInlinePosition, open: inlineOpen, overlay: true, position: inlinePosition, snapPoints: ["76%", "56%"], snapPointsMode: "percent", transition: "medium" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setPercentOpen, open: percentOpen, children: _jsx(ExampleModalSheet, { content: _jsxs(SheetContent, { description: "modal \u5168\u5C40 Sheet\uFF0C\u767E\u5206\u6BD4\u6863\u4F4D\u53EF\u9002\u914D\u4E0D\u540C\u5C4F\u5E55\u9AD8\u5EA6\u3002", onClose: () => setPercentOpen(false), title: "\u5168\u5C40 Sheet \u00B7 percent", children: [renderItems(), _jsx(Button, { onPress: () => openSheet(setNestedOpen, setNestedPosition), variant: "outlined", children: "\u6253\u5F00\u5185\u5C42 Sheet" }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setNestedOpen, open: nestedOpen, children: _jsx(ExampleModalSheet, { content: _jsx(SheetContent, { description: "\u5728\u5916\u5C42 Sheet \u4E2D\u7EE7\u7EED\u6253\u5F00 modal Sheet\uFF0C\u9002\u5408\u4E8C\u6B21\u786E\u8BA4\u6216\u8865\u5145\u914D\u7F6E\u3002", onClose: () => setNestedOpen(false), title: "\u5185\u5C42 Sheet", children: renderItems() }), native: native, onOpenChange: setNestedOpen, onPositionChange: setNestedPosition, open: nestedOpen, position: nestedPosition, snapPoints: ["72%", "88%"], snapPointsMode: "percent" }) })] }), native: native, onOpenChange: (nextOpen) => {
                            setPercentOpen(nextOpen);
                            if (!nextOpen)
                                setNestedOpen(false);
                        }, onPositionChange: setPercentPosition, open: percentOpen, position: percentPosition, snapPoints: ["62%", "90%"], snapPointsMode: "percent" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setConstantOpen, open: constantOpen, children: _jsx(ExampleModalSheet, { content: _jsx(SheetContent, { description: "constant \u4EE5\u56FA\u5B9A\u50CF\u7D20\u9AD8\u5EA6\u5B9A\u4E49\u6863\u4F4D\uFF0C\u9002\u5408\u5185\u5BB9\u5C3A\u5BF8\u660E\u786E\u7684\u64CD\u4F5C\u9762\u677F\u3002", onClose: () => setConstantOpen(false), title: "\u5168\u5C40 Sheet \u00B7 constant", children: renderItems() }), native: native, onOpenChange: setConstantOpen, onPositionChange: setConstantPosition, open: constantOpen, position: constantPosition, snapPoints: [360, 560], snapPointsMode: "constant" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setFitOpen, open: fitOpen, children: _jsx(ExampleModalSheet, { content: _jsx(SheetContent, { description: "fit \u6839\u636E\u5185\u5BB9\u9AD8\u5EA6\u8BA1\u7B97\u9762\u677F\u5C3A\u5BF8\uFF0C\u9002\u5408\u5185\u5BB9\u8F83\u77ED\u4E14\u4E0D\u9700\u8981\u56FA\u5B9A\u6863\u4F4D\u7684\u573A\u666F\u3002", onClose: () => setFitOpen(false), title: "\u5168\u5C40 Sheet \u00B7 fit", children: renderItems() }), native: native, onOpenChange: setFitOpen, onPositionChange: setFitPosition, open: fitOpen, position: fitPosition, snapPointsMode: "fit" }) }), _jsx(Sheet.Controller, { hidden: false, onOpenChange: setMixedOpen, open: mixedOpen, children: _jsx(ExampleModalSheet, { content: _jsx(SheetContent, { description: "mixed \u53EF\u7EC4\u5408 fit \u548C\u767E\u5206\u6BD4\u6863\u4F4D\uFF0C\u517C\u987E\u5185\u5BB9\u9AD8\u5EA6\u4E0E\u66F4\u5927\u53EF\u5C55\u5F00\u7A7A\u95F4\u3002", onClose: () => setMixedOpen(false), title: "\u5168\u5C40 Sheet \u00B7 mixed", children: renderItems() }), native: native, onOpenChange: setMixedOpen, onPositionChange: setMixedPosition, open: mixedOpen, position: mixedPosition, snapPoints: ["fit", "80%"], snapPointsMode: "mixed" }) })] }) }));
}
