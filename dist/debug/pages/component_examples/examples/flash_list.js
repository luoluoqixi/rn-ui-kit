import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { FlashList, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const flashListData = Array.from({ length: 40 }, (_, index) => ({
    id: `flash-row-${index}`,
    label: `FlashList row ${index + 1}`,
}));
const styles = StyleSheet.create({
    listFrame: { height: 320, minHeight: 0 },
    listItem: { borderRadius: 12, borderWidth: StyleSheet.hairlineWidth },
    listRow: {
        borderBottomColor: "rgba(128, 128, 128, 0.22)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        minHeight: 48,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    nativeListFrame: { height: 620, minHeight: 0 },
    scrollFrame: { height: 260, minHeight: 0 },
    scrollView: { flex: 1 },
});
export function FlashListExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u56FA\u5B9A\u9AD8\u5EA6\u4E2D\u6E32\u67D3 40 \u6761\u6570\u636E\uFF0C\u9002\u5408\u4F5C\u4E3A\u957F\u5217\u8868\u7684\u6027\u80FD\u57FA\u7EBF\u3002", title: "\u865A\u62DF\u5316\u5217\u8868", children: _jsx(View, { style: styles.listFrame, children: _jsx(FlashList, { data: flashListData, keyExtractor: (item) => item.id, renderItem: ({ item }) => (_jsx(View, { style: styles.listRow, children: _jsx(Text, { children: item.label }) })) }) }) }) }));
}
