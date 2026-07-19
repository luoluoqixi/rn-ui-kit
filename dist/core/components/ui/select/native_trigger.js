import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "@tamagui/lucide-icons-2";
import React from "react";
import { Pressable, StyleSheet, View, } from "react-native";
import { Text, getFontSize } from "tamagui";
function renderTriggerLabel(label, labelProps) {
    const resolvedOpacity = typeof labelProps?.opacity === "number" ? labelProps.opacity : 0.58;
    if (typeof label === "string" || typeof label === "number") {
        return (_jsx(Text, { color: "$color", fontSize: getFontSize("$4"), opacity: resolvedOpacity, ...labelProps, children: label }));
    }
    return label;
}
function renderTriggerIcon(icon, color) {
    if (icon === "none") {
        return null;
    }
    if (icon === "chevrons-up-down") {
        return _jsx(ChevronsUpDown, { color: color, size: 14 });
    }
    return (_jsxs(View, { style: styles.chevronColumn, children: [_jsx(ChevronUp, { color: color, size: 10 }), _jsx(ChevronDown, { color: color, size: 10 })] }));
}
export function NativeTriggerFace({ content, containerStyle, icon = "stacked", labelProps, label, opacity = 1, }) {
    if (content != null) {
        return (_jsx(View, { pointerEvents: "none", style: [styles.customContent, { opacity }], children: content }));
    }
    const iconColor = typeof labelProps?.color === "string" ? labelProps.color : "$color";
    const iconOpacity = typeof labelProps?.opacity === "number" ? labelProps.opacity : 0.58;
    return (_jsx(View, { pointerEvents: "none", style: { opacity }, children: _jsxs(View, { style: [styles.defaultTrigger, containerStyle], children: [renderTriggerLabel(label, labelProps), _jsx(View, { style: { opacity: iconOpacity }, children: renderTriggerIcon(icon, iconColor) })] }) }));
}
export const NativeTriggerPressable = React.forwardRef(({ content, containerStyle, icon = "stacked", labelProps, label, onPress, ...viewProps }, forwardedRef) => {
    const [isPressed, setIsPressed] = React.useState(false);
    return (_jsxs(View, { ref: forwardedRef, style: content != null ? styles.customTrigger : undefined, ...viewProps, children: [_jsx(NativeTriggerFace, { content: content, containerStyle: containerStyle, icon: icon, label: label, labelProps: labelProps, opacity: isPressed ? 0.6 : 1 }), _jsx(Pressable, { onPress: onPress, onPressIn: () => setIsPressed(true), onPressOut: () => setIsPressed(false), style: StyleSheet.absoluteFill })] }));
});
const styles = StyleSheet.create({
    chevronColumn: {
        alignItems: "center",
        justifyContent: "center",
    },
    customContent: {
        alignSelf: "stretch",
        width: "100%",
    },
    customTrigger: {
        alignSelf: "stretch",
        width: "100%",
    },
    defaultTrigger: {
        alignItems: "center",
        alignSelf: "center",
        flexDirection: "row",
        gap: 4,
        justifyContent: "center",
        minHeight: 44,
        minWidth: 180,
    },
});
