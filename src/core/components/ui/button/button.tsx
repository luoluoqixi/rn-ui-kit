import { type ComponentRef, type ComponentType, forwardRef } from "react";
import {
  Button as RNButton,
  Pressable,
  Text as RNText,
  type StyleProp,
  type ViewStyle,
  View,
} from "react-native";
import { Button as TamaguiButton } from "tamagui";
import { useTheme } from "tamagui";

import { isWeb, os } from "../utils/platform";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";

import { ButtonSwift } from "./button_swift";
import type { ButtonProps } from "./types";

const DISABLED_LONG_PRESS_DELAY = 2_147_483_647;
const TamaguiButtonWithLongPressDelay = TamaguiButton as unknown as ComponentType<
  ButtonProps & { ref?: React.Ref<ComponentRef<typeof TamaguiButton>> }
>;

const DISABLED_BUTTON_OPACITY = 0.5;
const ENABLED_BUTTON_OPACITY = 1;

export const Button = forwardRef<ComponentRef<typeof TamaguiButton>, ButtonProps>((props, ref) => {
  const {
    children,
    buttonSize,
    delayLongPress,
    native,
    nativeButtonStyle = "automatic",
    nativeHaptics,
    nativeSystemImage,
    nativeSystemImageSize = 20,
    nativeSwiftButtonSize,
    nativeSwiftProps,
    onPress,
    title,
    ...buttonProps
  } = props;
  const theme = useTheme();
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
  const resolvedDelayLongPress =
    delayLongPress ?? (props.onLongPress == null ? DISABLED_LONG_PRESS_DELAY : undefined);
  const handlePress: NonNullable<ButtonProps["onPress"]> = (event) => {
    onPress?.(event);

    if (event.defaultPrevented) {
      return;
    }

    triggerNativeHaptics(resolvedNativeHaptics);
  };

  const resolvedOpacity = buttonProps.disabled ? DISABLED_BUTTON_OPACITY : ENABLED_BUTTON_OPACITY;
  const nativeOpacity =
    typeof buttonProps.opacity === "number" ? buttonProps.opacity : resolvedOpacity;
  const resolvedButtonSize = buttonSize ?? nativeSwiftButtonSize;
  const buttonSizeProps =
    resolvedButtonSize == null
      ? {}
      : {
          ...(resolvedButtonSize.height == null ? {} : { height: resolvedButtonSize.height }),
          ...(resolvedButtonSize.width == null ? {} : { width: resolvedButtonSize.width }),
        };
  // Tamagui's circular variant derives all dimensions from `size`, including
  // min/max constraints. Mapping height to it prevents the default token size
  // from overriding the shared Button size API.
  const tamaguiButtonSizeProps =
    resolvedButtonSize == null
      ? {}
      : {
          ...((resolvedButtonSize.height ??
            (buttonProps.circular ? resolvedButtonSize.width : undefined)) == null
            ? {}
            : {
                size:
                  resolvedButtonSize.height ??
                  (buttonProps.circular ? resolvedButtonSize.width : undefined),
              }),
          ...(buttonProps.circular || resolvedButtonSize.width == null
            ? {}
            : { width: resolvedButtonSize.width }),
        };
  const useSwiftUIButton = native === "swift-ui" && os() === "ios";
  const useNativeButton = native === true && (os() === "ios" || os() === "android");
  const resolvedTitle =
    title ??
    (typeof children === "string"
      ? children
      : typeof children === "number"
        ? String(children)
        : undefined) ??
    "";

  if (useSwiftUIButton) {
    return (
      <ButtonSwift
        accessibilityLabel={props["aria-label"]}
        disabled={buttonProps.disabled ?? false}
        nativeButtonStyle={nativeButtonStyle}
        nativeOpacity={nativeOpacity}
        nativeSystemImage={nativeSystemImage}
        nativeSystemImageSize={nativeSystemImageSize}
        nativeSwiftButtonSize={resolvedButtonSize}
        nativeSwiftProps={nativeSwiftProps}
        onPress={() => handlePress({} as Parameters<typeof handlePress>[0])}
        style={buttonProps.style as StyleProp<ViewStyle>}
        title={resolvedTitle}
      />
    );
  }

  if (useNativeButton) {
    if (resolvedButtonSize != null) {
      const nativeColor = theme.color10?.val ?? theme.color6?.val ?? theme.color?.val;
      const isAndroid = os() === "android";
      return (
        <Pressable
          accessibilityLabel={props["aria-label"]}
          disabled={buttonProps.disabled}
          onPress={handlePress}
          style={({ pressed }) => [
            {
              alignItems: "center",
              backgroundColor: isAndroid ? nativeColor : "transparent",
              justifyContent: "center",
              opacity: pressed ? nativeOpacity * 0.65 : nativeOpacity,
            },
            buttonSizeProps,
            buttonProps.style as StyleProp<ViewStyle>,
          ]}
        >
          <RNText style={{ color: isAndroid ? "#ffffff" : nativeColor, textAlign: "center" }}>
            {resolvedTitle}
          </RNText>
        </Pressable>
      );
    }

    return (
      <View style={{ opacity: nativeOpacity }}>
        <RNButton
          accessibilityLabel={props["aria-label"]}
          color={theme.color10?.val ?? theme.color6?.val ?? theme.color?.val}
          disabled={buttonProps.disabled}
          onPress={handlePress}
          title={resolvedTitle}
        />
      </View>
    );
  }

  if (isWeb()) {
    let webTitle = children ?? resolvedTitle;
    if (webTitle === "") {
      webTitle = undefined;
    }
    return (
      <TamaguiButton
        opacity={resolvedOpacity}
        {...buttonProps}
        {...tamaguiButtonSizeProps}
        onPress={handlePress}
        ref={ref}
      >
        {webTitle}
      </TamaguiButton>
    );
  }

  return (
    <TamaguiButtonWithLongPressDelay
      opacity={resolvedOpacity}
      {...buttonProps}
      {...tamaguiButtonSizeProps}
      delayLongPress={resolvedDelayLongPress}
      onPress={handlePress}
      ref={ref}
    >
      {children ?? resolvedTitle}
    </TamaguiButtonWithLongPressDelay>
  );
});
