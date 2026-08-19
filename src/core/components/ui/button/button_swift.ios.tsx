import { Button as SwiftButton, Host, HStack, Image, Label } from "@expo/ui/swift-ui";
import {
  accessibilityLabel as swiftAccessibilityLabel,
  buttonStyle,
  disabled,
  frame,
} from "@expo/ui/swift-ui/modifiers";
import { View } from "react-native";

import type { ButtonSwiftProps } from "./button_swift";

/** Expo UI SwiftUI renderer used exclusively by `Button`'s iOS `native="swift-ui"` mode. */
export function ButtonSwift({
  accessibilityLabel,
  disabled: isDisabled,
  nativeButtonStyle,
  nativeOpacity,
  nativeSystemImage,
  nativeSystemImageSize,
  nativeSwiftButtonSize,
  nativeSwiftProps,
  onPress,
  style,
  title,
}: ButtonSwiftProps) {
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
          <HStack modifiers={nativeSwiftButtonSize == null ? undefined : [frame(nativeSwiftButtonSize)]}>
            {labelContent}
          </HStack>
        </SwiftButton>
      </Host>
    </View>
  );
}
