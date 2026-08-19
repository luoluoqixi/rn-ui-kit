import { jsx as _jsx } from "react/jsx-runtime";
import { Button as SwiftButton, Host, HStack, Image, Label } from "@expo/ui/swift-ui";
import { accessibilityLabel as swiftAccessibilityLabel, buttonStyle, disabled, frame, } from "@expo/ui/swift-ui/modifiers";
import { View } from "react-native";
/** Expo UI SwiftUI renderer used exclusively by `Button`'s iOS `native="swift-ui"` mode. */
export function ButtonSwift({ accessibilityLabel, disabled: isDisabled, nativeButtonStyle, nativeOpacity, nativeSystemImage, nativeSystemImageSize, nativeSwiftButtonSize, nativeSwiftProps, onPress, style, title, }) {
    const { children: overriddenChildren, label: overriddenLabel, modifiers: overriddenModifiers, systemImage: overriddenSystemImage, ...swiftButtonProps } = nativeSwiftProps ?? {};
    const iconSystemImage = overriddenSystemImage ?? nativeSystemImage;
    const hasCustomContent = overriddenChildren != null;
    const isIconButton = !hasCustomContent && overriddenLabel == null && iconSystemImage != null;
    const labelContent = overriddenChildren ??
        (isIconButton ? (_jsx(Image, { size: nativeSystemImageSize, systemName: iconSystemImage })) : (_jsx(Label, { systemImage: overriddenSystemImage, title: overriddenLabel ?? title })));
    return (_jsx(View, { style: { opacity: nativeOpacity }, children: _jsx(Host, { ignoreSafeArea: "all", matchContents: true, style: style, children: _jsx(SwiftButton, { ...swiftButtonProps, modifiers: [
                    buttonStyle(nativeButtonStyle),
                    disabled(isDisabled),
                    swiftAccessibilityLabel(accessibilityLabel ?? title),
                    ...(overriddenModifiers ?? []),
                ], onPress: onPress, children: _jsx(HStack, { modifiers: nativeSwiftButtonSize == null ? undefined : [frame(nativeSwiftButtonSize)], children: labelContent }) }) }) }));
}
