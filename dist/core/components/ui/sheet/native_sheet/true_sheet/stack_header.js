import { jsx as _jsx } from "react/jsx-runtime";
import { Pressable } from "react-native";
import { Text } from "../../../text";
import { useTrueSheetStackHost } from "./stack_context";
import React from "react";
import { cn, useUiTheme, isWeb } from "../../../utils";
function normalizeButtonChildren(children, textClassName, textStyle) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { className: textClassName, style: textStyle, children: child })) : (child));
}
/** 原生 Stack `headerRight`：关闭当前 True Sheet。 */
export function TrueSheetStackHeaderCloseButton({ title, titleClassName, titleStyle, onPress, buttonColor, ...buttonProps }) {
    const { onRequestClose } = useTrueSheetStackHost();
    const theme = useUiTheme();
    const titleNode = title ?? (buttonProps.children == null ? "关闭" : undefined);
    const handlePress = (event) => {
        onPress?.(event);
        if (!event.defaultPrevented) {
            onRequestClose();
        }
    };
    return (_jsx(Pressable, { ...buttonProps, className: cn("p-2 active:opacity-60", isWeb() && "hover:opacity-80", buttonProps.className), "aria-label": buttonProps["aria-label"] ?? "Close", onPress: handlePress, children: (typeof titleNode === "function"
            ? titleNode
            : normalizeButtonChildren(titleNode, cn("text-base", titleClassName), [
                titleStyle,
                { color: buttonColor ?? theme.primary },
            ])) }));
}
