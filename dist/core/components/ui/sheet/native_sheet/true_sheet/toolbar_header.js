import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeft } from "@tamagui/lucide-icons-2";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "tamagui";
import { Text } from "../../../text";
import { useAppBackgroundColors } from "../../../utils/theme";
/**
 * Android / 无 Native Stack 时的工具栏：左箭头 + 标题（对齐全屏 Expo Stack 样式，非居中三栏文字）。
 */
export function TrueSheetToolbarHeader({ canGoBack = false, headerRight, transparent = false, onBack, title, }) {
    const theme = useTheme();
    const appBackgroundColors = useAppBackgroundColors();
    const background = appBackgroundColors.sheet;
    const borderColor = theme.borderColor.val;
    const titleColor = theme.gray12.val;
    return (_jsxs(View, { style: [
            styles.root,
            {
                backgroundColor: transparent ? "transparent" : background,
                borderBottomColor: transparent ? "transparent" : borderColor,
            },
        ], children: [canGoBack ? (_jsx(Pressable, { accessibilityLabel: "\u8FD4\u56DE", accessibilityRole: "button", hitSlop: 8, onPress: onBack, style: styles.backButton, children: _jsx(ChevronLeft, { color: "$color10", size: 28, strokeWidth: 2 }) })) : (_jsx(View, { style: styles.backPlaceholder })), _jsx(Text, { ellipsizeMode: "tail", numberOfLines: 1, style: [styles.title, { color: titleColor }, !canGoBack && styles.titleRoot], children: title }), headerRight != null ? (_jsx(View, { style: styles.trailing, children: headerRight })) : (_jsx(View, { style: styles.trailingPlaceholder }))] }));
}
const styles = StyleSheet.create({
    backButton: {
        alignItems: "center",
        height: 48,
        justifyContent: "center",
        marginStart: 4,
        width: 48,
    },
    backPlaceholder: {
        width: 16,
    },
    root: {
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        minHeight: 56,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: "500",
        marginStart: -4,
    },
    titleRoot: {
        marginStart: 0,
        paddingStart: 16,
    },
    trailing: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
        minWidth: 48,
        paddingEnd: 8,
    },
    trailingPlaceholder: {
        width: 16,
    },
});
