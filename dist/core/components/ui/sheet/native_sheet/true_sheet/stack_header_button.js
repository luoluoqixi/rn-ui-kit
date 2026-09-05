export function shouldTrueSheetStackHeaderButtonClose(buttonProps, defaultCloseSheetOnPress) {
    return buttonProps?.closeSheetOnPress ?? defaultCloseSheetOnPress;
}
/** 将跨平台单按钮配置转换为 iOS Native Stack 的真正原生 button item。 */
export function createTrueSheetStackNativeHeaderButton({ buttonProps, defaultCloseSheetOnPress, defaultLabel, headerTintColor, onRequestClose, }) {
    const { accessibilityHint, accessibilityLabel, disabled, iosButtonProps, label, onPress, tintColor, title, } = buttonProps ?? {};
    const { onPress: onIosPress, ...restIosButtonProps } = iosButtonProps ?? {};
    const resolvedLabel = label ?? title ?? restIosButtonProps.label ?? accessibilityLabel ?? defaultLabel;
    return {
        ...restIosButtonProps,
        type: "button",
        label: resolvedLabel,
        tintColor: tintColor ?? restIosButtonProps.tintColor ?? headerTintColor,
        variant: restIosButtonProps.variant ?? "plain",
        ...(disabled === undefined ? {} : { disabled }),
        ...(accessibilityLabel === undefined ? {} : { accessibilityLabel }),
        ...(accessibilityHint === undefined ? {} : { accessibilityHint }),
        onPress: () => {
            onIosPress?.();
            onPress?.();
            if (shouldTrueSheetStackHeaderButtonClose(buttonProps, defaultCloseSheetOnPress)) {
                onRequestClose();
            }
        },
    };
}
