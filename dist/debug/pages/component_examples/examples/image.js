import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { Image } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const styles = StyleSheet.create({
    avatarRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 16 },
    imageHost: { alignSelf: "center", width: "100%" },
    verticalSeparatorRow: { alignItems: "center", flexDirection: "row", gap: 12, height: 40 },
});
export function ImageExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u4F7F\u7528 cover\u3001\u56FA\u5B9A\u5BB9\u5668\u3001\u5706\u89D2\u548C\u66FF\u4EE3\u6587\u672C\u7EC4\u6210\u5185\u5BB9\u9884\u89C8\u3002", title: "\u6587\u7AE0\u5C01\u9762", children: _jsx(View, { style: styles.imageHost, children: _jsx(Image, { alt: "\u7EC4\u4EF6\u793A\u4F8B\u56FE\u7247", borderRadius: 16, height: 220, objectFit: "cover", src: "https://picsum.photos/640/440", width: "100%" }) }) }) }));
}
