import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { useUiTheme } from "../utils/theme";
import { NATIVE_TRIGGER_DISABLE_OPACITY, NATIVE_TRIGGER_LABEL_OPACITY, NATIVE_TRIGGER_PRESS_OPACITY, NATIVE_TRIGGER_WEB_HOVER_OPACITY, NATIVE_TRIGGER_WEB_PRESS_OPACITY, } from "./constants";
const nativeTriggerSizeStyles = {
    default: { gap: 8, minHeight: 44, paddingHorizontal: 20 },
    "2xs": { gap: 4, minHeight: 32, paddingHorizontal: 8 },
    xs: { gap: 4, minHeight: 36, paddingHorizontal: 12 },
    sm: { gap: 6, minHeight: 40, paddingHorizontal: 16 },
    md: { gap: 8, minHeight: 44, paddingHorizontal: 20 },
    lg: { gap: 8, minHeight: 48, paddingHorizontal: 24 },
    xl: { gap: 10, minHeight: 56, paddingHorizontal: 32 },
    "2xl": { gap: 12, minHeight: 64, paddingHorizontal: 40 },
};
const nativeTriggerLabelFontSizes = {
    default: 16,
    "2xs": 12,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 16,
    xl: 18,
    "2xl": 20,
};
const nativeTriggerIconSizes = {
    default: { chevron: 16, stacked: 10 },
    "2xs": { chevron: 12, stacked: 8 },
    xs: { chevron: 12, stacked: 8 },
    sm: { chevron: 14, stacked: 9 },
    md: { chevron: 16, stacked: 10 },
    lg: { chevron: 16, stacked: 10 },
    xl: { chevron: 18, stacked: 12 },
    "2xl": { chevron: 20, stacked: 14 },
};
function renderTriggerLabel(label, labelProps, defaultColor, fontSize, fontWeight = "500") {
    const { color, opacity, style, ...textProps } = (labelProps ?? {});
    if (typeof label === "string" || typeof label === "number") {
        return (_jsx(Text, { style: [
                {
                    color: color ?? defaultColor,
                    fontSize,
                    fontWeight,
                    opacity: opacity ?? NATIVE_TRIGGER_LABEL_OPACITY,
                },
                style,
            ], ...textProps, children: label }));
    }
    return label;
}
function renderTriggerIcon(icon, color, size) {
    if (icon === "none") {
        return null;
    }
    if (icon === "chevrons-up-down") {
        return _jsx(ChevronsUpDown, { color: color, size: size.chevron });
    }
    return (_jsxs(View, { style: styles.chevronColumn, children: [_jsx(ChevronUp, { color: color, size: size.stacked }), _jsx(ChevronDown, { color: color, size: size.stacked })] }));
}
export const NativeTriggerFace = React.forwardRef(function NativeTriggerFace({ content, containerStyle, icon = "chevrons-up-down", iconColor: iconColorProp, labelProps, label, opacity = 1, size = "default", fontWeight = "500", }, forwardedRef) {
    const theme = useUiTheme();
    if (content != null) {
        return (_jsx(View, { ref: forwardedRef, pointerEvents: "none", style: [styles.customContent, { opacity }], children: content }));
    }
    const labelStyle = StyleSheet.flatten(labelProps?.style);
    const labelColor = labelProps
        ?.color;
    const iconColor = iconColorProp ?? labelColor ?? labelStyle?.color ?? theme.foreground;
    // 图标跟随显式设置的文字透明度，避免文字已经恢复为 1 时右侧箭头仍然偏淡。
    const configuredLabelOpacity = labelProps
        ?.opacity;
    const iconOpacity = typeof configuredLabelOpacity === "number"
        ? configuredLabelOpacity
        : NATIVE_TRIGGER_LABEL_OPACITY;
    return (_jsx(View, { ref: forwardedRef, pointerEvents: "none", style: { alignSelf: "center", flexGrow: 0, flexShrink: 0, opacity, width: "auto" }, children: _jsxs(View, { style: [styles.defaultTrigger, nativeTriggerSizeStyles[size], containerStyle], children: [renderTriggerLabel(label, labelProps, theme.foreground, nativeTriggerLabelFontSizes[size], fontWeight), _jsx(View, { style: { opacity: iconOpacity }, children: renderTriggerIcon(icon, iconColor, nativeTriggerIconSizes[size]) })] }) }));
});
export const NativeTrigger = React.forwardRef(({ active = false, content, containerStyle, disabled, feedbackOpacity, fontWeight = "500", icon, iconColor, keepPressedOpacity = false, labelProps, label, onPressIn, onLongPress, onPressOut, pressedOpacity = true, style, className, size = "default", onHoverIn, onHoverOut, ...pressableProps }, forwardedRef) => {
    const [stickyPressed, setStickyPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const hasCursorOverride = className?.split(/\s+/).some((token) => token.startsWith("cursor-"));
    const wasActiveRef = React.useRef(active);
    const disabledOpacity = feedbackOpacity?.disabled ?? NATIVE_TRIGGER_DISABLE_OPACITY;
    const pressOpacity = feedbackOpacity?.press ?? NATIVE_TRIGGER_PRESS_OPACITY;
    const webHoverOpacity = feedbackOpacity?.webHover ?? NATIVE_TRIGGER_WEB_HOVER_OPACITY;
    const webPressOpacity = feedbackOpacity?.webPress ?? NATIVE_TRIGGER_WEB_PRESS_OPACITY;
    const resolvedPressableProps = {
        ...pressableProps,
        onContextMenu: (event) => {
            event.stopPropagation?.();
            pressableProps.onContextMenu?.(event);
        },
    };
    React.useEffect(() => {
        if (active) {
            wasActiveRef.current = true;
            return;
        }
        if (wasActiveRef.current) {
            wasActiveRef.current = false;
            setStickyPressed(false);
        }
    }, [active]);
    return (_jsx(Pressable, { ref: forwardedRef, ...resolvedPressableProps, className: cn(Platform.OS === "web" && "cursor-default", className), disabled: disabled, onHoverIn: (event) => {
            setHovered(true);
            onHoverIn?.(event);
        }, onHoverOut: (event) => {
            setHovered(false);
            onHoverOut?.(event);
        }, onPress: (event) => {
            // A NativeTrigger may be hosted inside a NativeList row. Its click
            // must not bubble into the row, otherwise both the trigger and the
            // row call present/open and iOS reports an already-visible menu.
            event.stopPropagation?.();
            pressableProps.onPress?.(event);
        }, onPressIn: (event) => {
            if (keepPressedOpacity) {
                setStickyPressed(true);
            }
            onPressIn?.(event);
        }, onLongPress: (event) => {
            // NativeList 行可能托管 ContextMenu；直接交互的 trigger 不应
            // 将长按继续冒泡成行级菜单。
            event.stopPropagation?.();
            onLongPress?.(event);
        }, onPressOut: (event) => {
            onPressOut?.(event);
            if (!keepPressedOpacity || active || wasActiveRef.current) {
                return;
            }
            setStickyPressed(false);
        }, style: (state) => [
            content != null ? styles.customTrigger : undefined,
            Platform.OS === "web"
                ? [
                    hasCursorOverride ? undefined : { cursor: "default" },
                    disabled
                        ? { opacity: disabledOpacity }
                        : active || stickyPressed || (pressedOpacity && state.pressed)
                            ? { opacity: webPressOpacity }
                            : hovered
                                ? { opacity: webHoverOpacity }
                                : undefined,
                ]
                : {
                    opacity: disabled
                        ? disabledOpacity
                        : active || stickyPressed || (pressedOpacity && state.pressed)
                            ? pressOpacity
                            : 1,
                },
            typeof style === "function" ? style(state) : style,
        ], children: _jsx(NativeTriggerFace, { content: content, containerStyle: containerStyle, icon: icon, iconColor: iconColor, label: label, labelProps: labelProps, fontWeight: fontWeight, size: size }) }));
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
        alignSelf: "flex-start",
        flexDirection: "row",
        flexGrow: 0,
        gap: 8,
        justifyContent: "center",
        minHeight: 44,
        flexShrink: 0,
        width: "auto",
        paddingHorizontal: 20,
    },
});
