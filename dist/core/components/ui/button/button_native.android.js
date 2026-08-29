import { jsx as _jsx } from "react/jsx-runtime";
import { Button as ComposeButton, FilledTonalButton, Host, OutlinedButton, Text as ComposeText, TextButton, } from "@luoluoqixi/expo-ui-55/jetpack-compose";
import { height as composeHeight, size as composeSize, width as composeWidth, } from "@luoluoqixi/expo-ui-55/jetpack-compose/modifiers";
function resolveContent(children, title) {
    if (typeof children === "string" || typeof children === "number") {
        return _jsx(ComposeText, { children: String(children) });
    }
    return _jsx(ComposeText, { children: title });
}
function getButtonStyle(variant, colors) {
    if (variant === "outline") {
        return {
            Component: OutlinedButton,
            colors: { contentColor: colors.primary },
        };
    }
    if (variant === "secondary") {
        return {
            Component: FilledTonalButton,
            colors: {
                containerColor: colors.secondary,
                contentColor: colors.secondaryForeground,
            },
        };
    }
    if (variant === "ghost" || variant === "link" || variant === "icon") {
        return {
            Component: TextButton,
            colors: { contentColor: colors.primary },
        };
    }
    return {
        Component: ComposeButton,
        colors: {
            containerColor: variant === "destructive" ? colors.destructive : colors.primary,
            contentColor: colors.primaryForeground,
        },
    };
}
function getButtonSizeModifiers(buttonSize) {
    if (buttonSize?.width != null && buttonSize.height != null) {
        return [composeSize(buttonSize.width, buttonSize.height)];
    }
    if (buttonSize?.width != null) {
        return [composeWidth(buttonSize.width)];
    }
    if (buttonSize?.height != null) {
        return [composeHeight(buttonSize.height)];
    }
    return undefined;
}
/** Expo UI Jetpack Compose renderer used by the Android native Button mode. */
export function ButtonNative({ androidColors, buttonSize, children, disabled: isDisabled, nativeComposeProps, onPress, style, title, variant, }) {
    const colors = androidColors ?? {
        destructive: "#dc2626",
        primary: "#27272a",
        primaryForeground: "#fafafa",
        secondary: "#f4f4f5",
        secondaryForeground: "#27272a",
    };
    const { Component, colors: buttonColors } = getButtonStyle(variant, colors);
    const content = resolveContent(children, title);
    const sizeModifiers = getButtonSizeModifiers(buttonSize);
    const { colors: overriddenColors, enabled: overriddenEnabled, modifiers: overriddenModifiers, ...composeButtonProps } = nativeComposeProps ?? {};
    return (_jsx(Host, { matchContents: true, style: style, children: _jsx(Component, { ...composeButtonProps, colors: (overriddenColors ?? buttonColors), enabled: overriddenEnabled ?? !isDisabled, modifiers: overriddenModifiers ?? sizeModifiers, onClick: onPress, children: content }) }));
}
