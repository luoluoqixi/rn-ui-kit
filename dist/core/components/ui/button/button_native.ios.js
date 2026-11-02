import { jsx as _jsx } from "react/jsx-runtime";
import { Button as SwiftButton, Host, HStack, Image, Label } from "@luoluoqixi/expo-ui-55/swift-ui";
import { accessibilityLabel as swiftAccessibilityLabel, buttonStyle, disabled, frame, foregroundStyle, } from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";
import { View } from "react-native";
import { useUiTheme } from "../utils/theme";
const DEFAULT_SYSTEM_IMAGE_SIZE = 20;
/** Expo UI SwiftUI renderer used by the iOS native Button mode. */
export function ButtonNative({ matchContents, accessibilityLabel, disabled: isDisabled, nativeButtonStyle = "automatic", nativeOpacity = 1, nativeSystemImage, nativeSystemImageSize = DEFAULT_SYSTEM_IMAGE_SIZE, buttonSize, buttonColor, nativeSwiftProps, onPress, style, title, }) {
    const theme = useUiTheme();
    const { children: overriddenChildren, label: overriddenLabel, modifiers: overriddenModifiers, systemImage: overriddenSystemImage, ...swiftButtonProps } = nativeSwiftProps ?? {};
    const iconSystemImage = overriddenSystemImage ?? nativeSystemImage;
    const hasCustomContent = overriddenChildren != null;
    const isIconButton = !hasCustomContent && overriddenLabel == null && iconSystemImage != null;
    const labelContent = overriddenChildren ??
        (isIconButton ? (_jsx(Image, { size: nativeSystemImageSize, systemName: iconSystemImage })) : (_jsx(Label, { systemImage: overriddenSystemImage, title: overriddenLabel ?? title })));
    return (_jsx(View, { style: { opacity: nativeOpacity }, children: _jsx(Host, { ignoreSafeArea: "all", matchContents: matchContents ?? true, style: style, children: _jsx(SwiftButton, { ...swiftButtonProps, modifiers: [
                    buttonStyle(nativeButtonStyle),
                    disabled(isDisabled),
                    swiftAccessibilityLabel(accessibilityLabel ?? title),
                    ...(buttonColor == null ? [foregroundStyle(theme.primary)] : []),
                    ...(overriddenModifiers ?? []),
                    ...(buttonColor == null ? [] : [foregroundStyle(buttonColor)]),
                ], onPress: onPress, children: _jsx(HStack, { modifiers: buttonSize == null ? undefined : [frame(buttonSize)], children: labelContent }) }) }) }));
}
