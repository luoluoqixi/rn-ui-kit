import { Button as SwiftButton, Host, HStack, Image, Label } from "@luoluoqixi/expo-ui-55/swift-ui";
import {
  accessibilityLabel as swiftAccessibilityLabel,
  buttonStyle,
  disabled,
  frame,
} from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";
import { View } from "react-native";

import type { ButtonNativeProps } from "./button_native";

const DEFAULT_SYSTEM_IMAGE_SIZE = 20;

/** Expo UI SwiftUI renderer used by the iOS native Button mode. */
export function ButtonNative({
  accessibilityLabel,
  disabled: isDisabled,
  nativeButtonStyle = "automatic",
  nativeOpacity = 1,
  nativeSystemImage,
  nativeSystemImageSize = DEFAULT_SYSTEM_IMAGE_SIZE,
  buttonSize,
  nativeSwiftProps,
  onPress,
  style,
  title,
}: ButtonNativeProps) {
  const {
    children: overriddenChildren,
    label: overriddenLabel,
    modifiers: overriddenModifiers,
    systemImage: overriddenSystemImage,
    ...swiftButtonProps
  } = nativeSwiftProps ?? {};
  const iconSystemImage = overriddenSystemImage ?? nativeSystemImage;
  const hasCustomContent = overriddenChildren != null;
  const isIconButton = !hasCustomContent && overriddenLabel == null && iconSystemImage != null;
  const labelContent =
    overriddenChildren ??
    (isIconButton ? (
      <Image size={nativeSystemImageSize} systemName={iconSystemImage} />
    ) : (
      <Label systemImage={overriddenSystemImage} title={overriddenLabel ?? title} />
    ));
  return (
    <View style={{ opacity: nativeOpacity }}>
      <Host ignoreSafeArea="all" matchContents style={style}>
        <SwiftButton
          {...swiftButtonProps}
          modifiers={[
            buttonStyle(nativeButtonStyle),
            disabled(isDisabled),
            swiftAccessibilityLabel(accessibilityLabel ?? title),
            ...(overriddenModifiers ?? []),
          ]}
          onPress={onPress}
        >
          <HStack modifiers={buttonSize == null ? undefined : [frame(buttonSize)]}>
            {labelContent}
          </HStack>
        </SwiftButton>
      </Host>
    </View>
  );
}
