import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { Avatar } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const styles = StyleSheet.create({
    avatarRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 16 },
    imageHost: { alignSelf: "center", width: "100%" },
    verticalSeparatorRow: { alignItems: "center", flexDirection: "row", gap: 12, height: 40 },
});
export function AvatarExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: "\u5728\u6210\u5458\u5217\u8868\u4E2D\u6DF7\u5408\u5C55\u793A\u8FDC\u7A0B\u5934\u50CF\u3001\u7F29\u5199 fallback \u548C\u4E0D\u540C\u5C3A\u5BF8\u3002", title: "\u534F\u4F5C\u8005", children: _jsxs(View, { style: styles.avatarRow, children: [_jsx(Avatar, { alt: "Ada Lovelace", fallback: "AL", size: "$6", src: "https://i.pravatar.cc/160?img=47" }), _jsx(Avatar, { fallback: "RN", size: "$6" }), _jsx(Avatar, { fallback: "UI", size: "$5" }), _jsx(Avatar, { fallback: "KIT", size: "$4" })] }) }) }));
}
