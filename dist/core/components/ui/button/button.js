import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { Button as RNButton, Pressable, Text as RNText, View, } from "react-native";
import { Button as TamaguiButton } from "tamagui";
import { useTheme } from "tamagui";
import { isWeb, os } from "../utils/platform";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { ButtonSwift } from "./button_swift";
const DISABLED_LONG_PRESS_DELAY = 2_147_483_647;
const TamaguiButtonWithLongPressDelay = TamaguiButton;
const DISABLED_BUTTON_OPACITY = 0.5;
const ENABLED_BUTTON_OPACITY = 1;
export const Button = forwardRef((props, ref) => {
    const { children, buttonSize, delayLongPress, native, nativeButtonStyle = "automatic", nativeHaptics, nativeSystemImage, nativeSystemImageSize = 20, nativeSwiftButtonSize, nativeSwiftProps, onPress, title, ...buttonProps } = props;
    const theme = useTheme();
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const resolvedDelayLongPress = delayLongPress ?? (props.onLongPress == null ? DISABLED_LONG_PRESS_DELAY : undefined);
    const handlePress = (event) => {
        onPress?.(event);
        if (event.defaultPrevented) {
            return;
        }
        triggerNativeHaptics(resolvedNativeHaptics);
    };
    const resolvedOpacity = buttonProps.disabled ? DISABLED_BUTTON_OPACITY : ENABLED_BUTTON_OPACITY;
    const nativeOpacity = typeof buttonProps.opacity === "number" ? buttonProps.opacity : resolvedOpacity;
    const resolvedButtonSize = buttonSize ?? nativeSwiftButtonSize;
    const buttonSizeProps = resolvedButtonSize == null
        ? {}
        : {
            ...(resolvedButtonSize.height == null ? {} : { height: resolvedButtonSize.height }),
            ...(resolvedButtonSize.width == null ? {} : { width: resolvedButtonSize.width }),
        };
    // Tamagui's circular variant derives all dimensions from `size`, including
    // min/max constraints. Mapping height to it prevents the default token size
    // from overriding the shared Button size API.
    const tamaguiButtonSizeProps = resolvedButtonSize == null
        ? {}
        : {
            ...((resolvedButtonSize.height ??
                (buttonProps.circular ? resolvedButtonSize.width : undefined)) == null
                ? {}
                : {
                    size: resolvedButtonSize.height ??
                        (buttonProps.circular ? resolvedButtonSize.width : undefined),
                }),
            ...(buttonProps.circular || resolvedButtonSize.width == null
                ? {}
                : { width: resolvedButtonSize.width }),
        };
    const useSwiftUIButton = native === "swift-ui" && os() === "ios";
    const useNativeButton = native === true && (os() === "ios" || os() === "android");
    const resolvedTitle = title ??
        (typeof children === "string"
            ? children
            : typeof children === "number"
                ? String(children)
                : undefined) ??
        "";
    if (useSwiftUIButton) {
        return (_jsx(ButtonSwift, { accessibilityLabel: props["aria-label"], disabled: buttonProps.disabled ?? false, nativeButtonStyle: nativeButtonStyle, nativeOpacity: nativeOpacity, nativeSystemImage: nativeSystemImage, nativeSystemImageSize: nativeSystemImageSize, nativeSwiftButtonSize: resolvedButtonSize, nativeSwiftProps: nativeSwiftProps, onPress: () => handlePress({}), style: buttonProps.style, title: resolvedTitle }));
    }
    if (useNativeButton) {
        if (resolvedButtonSize != null) {
            const nativeColor = theme.color10?.val ?? theme.color6?.val ?? theme.color?.val;
            const isAndroid = os() === "android";
            return (_jsx(Pressable, { accessibilityLabel: props["aria-label"], disabled: buttonProps.disabled, onPress: handlePress, style: ({ pressed }) => [
                    {
                        alignItems: "center",
                        backgroundColor: isAndroid ? nativeColor : "transparent",
                        justifyContent: "center",
                        opacity: pressed ? nativeOpacity * 0.65 : nativeOpacity,
                    },
                    buttonSizeProps,
                    buttonProps.style,
                ], children: _jsx(RNText, { style: { color: isAndroid ? "#ffffff" : nativeColor, textAlign: "center" }, children: resolvedTitle }) }));
        }
        return (_jsx(View, { style: { opacity: nativeOpacity }, children: _jsx(RNButton, { accessibilityLabel: props["aria-label"], color: theme.color10?.val ?? theme.color6?.val ?? theme.color?.val, disabled: buttonProps.disabled, onPress: handlePress, title: resolvedTitle }) }));
    }
    if (isWeb()) {
        let webTitle = children ?? resolvedTitle;
        if (webTitle === "") {
            webTitle = undefined;
        }
        return (_jsx(TamaguiButton, { opacity: resolvedOpacity, ...buttonProps, ...tamaguiButtonSizeProps, onPress: handlePress, ref: ref, children: webTitle }));
    }
    return (_jsx(TamaguiButtonWithLongPressDelay, { opacity: resolvedOpacity, ...buttonProps, ...tamaguiButtonSizeProps, delayLongPress: resolvedDelayLongPress, onPress: handlePress, ref: ref, children: children ?? resolvedTitle }));
});
