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
export const NativeTriggerFace = React.forwardRef(function NativeTriggerFace({ content, containerStyle, icon = "stacked", labelProps, label, opacity = 1 }, forwardedRef) {
    if (content != null) {
        return (_jsx(View, { ref: forwardedRef, pointerEvents: "none", style: [styles.customContent, { opacity }], children: content }));
    }
    const iconColor = typeof labelProps?.color === "string" ? labelProps.color : "$color";
    const iconOpacity = typeof labelProps?.opacity === "number" ? labelProps.opacity : 0.58;
    return (_jsx(View, { ref: forwardedRef, pointerEvents: "none", style: { opacity }, children: _jsxs(View, { style: [styles.defaultTrigger, containerStyle], children: [renderTriggerLabel(label, labelProps), _jsx(View, { style: { opacity: iconOpacity }, children: renderTriggerIcon(icon, iconColor) })] }) }));
});
const NATIVE_MENU_HANDOFF_GRACE_PERIOD = 500;
export const NativeTrigger = React.forwardRef(({ active = false, content, containerStyle, icon, keepPressedOpacity = false, labelProps, label, onPressIn, onPressOut, pressedOpacity = true, style, ...pressableProps }, forwardedRef) => {
    const [stickyPressed, setStickyPressed] = React.useState(false);
    const wasActiveRef = React.useRef(active);
    const handoffTimeoutRef = React.useRef(null);
    const clearHandoffTimeout = () => {
        if (handoffTimeoutRef.current != null) {
            clearTimeout(handoffTimeoutRef.current);
            handoffTimeoutRef.current = null;
        }
    };
    React.useEffect(() => {
        if (active) {
            wasActiveRef.current = true;
            clearHandoffTimeout();
            return;
        }
        if (wasActiveRef.current) {
            wasActiveRef.current = false;
            setStickyPressed(false);
        }
    }, [active]);
    React.useEffect(() => clearHandoffTimeout, []);
    return (_jsx(Pressable, { ref: forwardedRef, ...pressableProps, onPressIn: (event) => {
            if (keepPressedOpacity) {
                clearHandoffTimeout();
                setStickyPressed(true);
            }
            onPressIn?.(event);
        }, onPressOut: (event) => {
            onPressOut?.(event);
            if (!keepPressedOpacity || active || wasActiveRef.current) {
                return;
            }
            // iOS 原生 Menu 会在松手后才派发 willOpen；未收到该信号则视为拖出等取消操作。
            clearHandoffTimeout();
            handoffTimeoutRef.current = setTimeout(() => {
                if (!wasActiveRef.current) {
                    setStickyPressed(false);
                }
                handoffTimeoutRef.current = null;
            }, NATIVE_MENU_HANDOFF_GRACE_PERIOD);
        }, style: (state) => [
            content != null ? styles.customTrigger : undefined,
            { opacity: active || stickyPressed || (pressedOpacity && state.pressed) ? 0.6 : 1 },
            typeof style === "function" ? style(state) : style,
        ], children: _jsx(NativeTriggerFace, { content: content, containerStyle: containerStyle, icon: icon, label: label, labelProps: labelProps }) }));
});
/** `NativeTrigger` 的兼容别名。 */
export const NativeTriggerPressable = NativeTrigger;
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
