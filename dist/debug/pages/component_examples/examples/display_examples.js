import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, H1, H3, Image, Link, Paragraph, Separator, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
function AvatarExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u5728\u6210\u5458\u5217\u8868\u4E2D\u6DF7\u5408\u5C55\u793A\u8FDC\u7A0B\u5934\u50CF\u3001\u7F29\u5199 fallback \u548C\u4E0D\u540C\u5C3A\u5BF8\u3002", title: "\u534F\u4F5C\u8005", children: _jsxs(View, { style: styles.avatarRow, children: [_jsx(Avatar, { alt: "Ada Lovelace", fallback: "AL", size: "$6", src: "https://i.pravatar.cc/160?img=47" }), _jsx(Avatar, { fallback: "RN", size: "$6" }), _jsx(Avatar, { fallback: "UI", size: "$5" }), _jsx(Avatar, { fallback: "KIT", size: "$4" })] }) }) }));
}
function TextExample() {
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u6807\u9898\u3001\u6BB5\u843D\u3001\u5F3A\u8C03\u4E0E\u8F85\u52A9\u6587\u6848\u7EC4\u5408\u6210\u4E00\u6BB5\u53EF\u9605\u8BFB\u7684\u5185\u5BB9\u3002", title: "\u53D1\u5E03\u8BF4\u660E", children: [_jsx(H1, { children: "\u4E00\u7EA7\u6807\u9898" }), _jsx(H3, { children: "\u4E09\u7EA7\u6807\u9898" }), _jsx(Paragraph, { children: "Paragraph \u9002\u5408\u8F83\u957F\u7684\u6B63\u6587\u5185\u5BB9\uFF0C\u5E76\u7EE7\u627F\u5F53\u524D\u4E3B\u9898\u989C\u8272\u3002\u8FD9\u91CC\u5C55\u793A\u4E86\u4E00\u4E2A\u5B8C\u6574\u7684\u7248\u672C\u66F4\u65B0\u6458\u8981\u3002" }), _jsx(Text, { fontWeight: "600", children: "\u666E\u901A Text \u53EF\u4EE5\u81EA\u7531\u7EC4\u5408\u5B57\u53F7\u548C\u5B57\u91CD\u3002" }), _jsx(Text, { opacity: 0.6, children: "\u8F85\u52A9\u8BF4\u660E\u6587\u5B57" })] }) }));
}
function ImageExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u4F7F\u7528 cover\u3001\u56FA\u5B9A\u5BB9\u5668\u3001\u5706\u89D2\u548C\u66FF\u4EE3\u6587\u672C\u7EC4\u6210\u5185\u5BB9\u9884\u89C8\u3002", title: "\u6587\u7AE0\u5C01\u9762", children: _jsx(View, { style: styles.imageHost, children: _jsx(Image, { alt: "\u7EC4\u4EF6\u793A\u4F8B\u56FE\u7247", borderRadius: 16, height: 220, objectFit: "cover", src: "https://picsum.photos/640/440", width: "100%" }) }) }) }));
}
function CardExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u9ED8\u8BA4 API \u53EF\u4EE5\u7EDF\u4E00\u6807\u9898\u3001\u8BF4\u660E\u3001\u6B63\u6587\u4E0E footer \u7684\u8282\u594F\u3002", title: "\u9879\u76EE\u6458\u8981", children: _jsx(Card, { description: "\u4E0A\u6B21\u540C\u6B65\u4E8E\u4ECA\u5929 10:42\uFF0C\u5305\u542B 12 \u4E2A\u7EC4\u4EF6\u793A\u4F8B\u3002", footer: _jsxs(ExampleRow, { children: [_jsx(Text, { opacity: 0.6, children: "2 \u4F4D\u534F\u4F5C\u8005" }), _jsx(Link, { href: "https://tamagui.dev", target: "_blank", children: "\u67E5\u770B\u8BE6\u60C5" })] }), title: "rn-ui-kit \u8C03\u8BD5\u5DE5\u4F5C\u533A", children: _jsx(Text, { children: "\u8FD9\u91CC\u662F Card \u7684\u6B63\u6587\u533A\u57DF\uFF0C\u53EF\u653E\u7F6E\u9879\u76EE\u6458\u8981\u3001\u72B6\u6001\u548C\u540E\u7EED\u64CD\u4F5C\u3002" }) }) }) }));
}
function SeparatorExample() {
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "\u6C34\u5E73\u5206\u9694\u5185\u5BB9\u533A\u5757\uFF0C\u5782\u76F4\u5206\u9694\u5E76\u5217\u4FE1\u606F\u3002", title: "\u5185\u5BB9\u5C42\u7EA7", children: [_jsx(Text, { children: "\u4E0A\u65B9\u5185\u5BB9" }), _jsx(Separator, {}), _jsx(Text, { children: "\u4E0B\u65B9\u5185\u5BB9" }), _jsxs(View, { style: styles.verticalSeparatorRow, children: [_jsx(Text, { children: "\u5DE6\u4FA7" }), _jsx(Separator, { height: 24, vertical: true }), _jsx(Text, { children: "\u53F3\u4FA7" })] })] }) }));
}
function LinkExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u94FE\u63A5\u53EF\u7528\u4E8E\u6B63\u6587\u5185\u8DF3\u8F6C\u548C\u5355\u72EC\u7684\u5E2E\u52A9\u5165\u53E3\u3002", title: "\u76F8\u5173\u8D44\u6E90", children: _jsxs(ExampleRow, { children: [_jsx(Link, { href: "https://tamagui.dev", target: "_blank", children: "Tamagui \u6587\u6863" }), _jsx(Link, { href: "https://reactnative.dev", target: "_blank", children: "React Native" })] }) }) }));
}
export const displayExamples = [
    {
        Component: AvatarExample,
        group: "内容展示",
        key: "avatar",
        label: "Avatar",
    },
    {
        Component: TextExample,
        group: "内容展示",
        key: "text",
        label: "Text",
    },
    {
        Component: ImageExample,
        group: "内容展示",
        key: "image",
        label: "Image",
    },
    {
        Component: CardExample,
        group: "内容展示",
        key: "card",
        label: "Card",
    },
    {
        Component: SeparatorExample,
        group: "内容展示",
        key: "separator",
        label: "Separator",
    },
    {
        Component: LinkExample,
        group: "内容展示",
        key: "link",
        label: "Link",
    },
];
const styles = StyleSheet.create({
    avatarRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 16 },
    imageHost: { alignSelf: "center", width: "100%" },
    verticalSeparatorRow: { alignItems: "center", flexDirection: "row", gap: 12, height: 40 },
});
