import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { Platform } from "react-native";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { useUiTheme } from "../utils/theme";
import { ButtonHeroUI } from "./button_heroui";
import { ButtonNative } from "./button_native";
const systemVariants = {
    primary: "default", secondary: "secondary", tertiary: "secondary", outline: "outline",
    ghost: "ghost", danger: "destructive", "danger-soft": "secondary",
};
function SystemButton({ nativeMatchContents, nativeButtonStyle = "automatic", nativeComposeProps, nativeSwiftProps, nativeSystemImage, nativeSystemImageSize, buttonSize, buttonColor, children, title, variant = "primary", disabled, style, onPress, accessibilityLabel, "aria-label": ariaLabel, }) {
    const theme = useUiTheme();
    const resolvedTitle = title ?? (typeof children === "string" || typeof children === "number" ? String(children) : "");
    return _jsx(ButtonNative, { matchContents: nativeMatchContents, accessibilityLabel: ariaLabel ?? accessibilityLabel, androidColors: {
            destructive: theme.danger, primary: theme.accent, primaryForeground: theme.accentForeground,
            secondary: theme.default,
            secondaryForeground: variant === "danger-soft" ? theme.danger : theme.defaultForeground,
        }, buttonSize: buttonSize, buttonColor: buttonColor, children: title == null && (typeof children === "string" || typeof children === "number") ? children : undefined, disabled: !!disabled, nativeButtonStyle: nativeButtonStyle, nativeComposeProps: nativeComposeProps, nativeOpacity: disabled ? 0.5 : 1, nativeSystemImage: nativeSystemImage, nativeSystemImageSize: nativeSystemImageSize, nativeSwiftProps: nativeSwiftProps, 
        // Expo UI's system callbacks have no RN gesture payload; retain the existing native API.
        onPress: () => onPress?.({ defaultPrevented: false }), style: typeof style === "function" ? style({ hovered: false, pressed: false }) : style, title: resolvedTitle, variant: systemVariants[variant] });
}
export const Button = forwardRef(function Button({ native, nativeHaptics, disabled, isDisabled, loading = false, onPress, ...props }, ref) {
    const haptics = useResolvedNativeHaptics(nativeHaptics);
    const unavailable = !!(disabled || isDisabled || loading);
    const handlePress = (event) => {
        onPress?.(event);
        if (!event.defaultPrevented)
            triggerNativeHaptics(haptics);
    };
    if (native === true && Platform.OS !== "web")
        return _jsx(SystemButton, { ...props, disabled: unavailable, onPress: handlePress });
    return _jsx(ButtonHeroUI, { ...props, loading: loading, disabled: unavailable, onPress: handlePress, ref: ref });
});
