import type { ButtonProps } from "./types";
import type { StyleProp, ViewStyle } from "react-native";
import type * as React from "react";

export type ButtonNativeProps = {
  accessibilityLabel?: string;
  androidColors?: {
    destructive: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
  };
  buttonSize?: ButtonProps["buttonSize"];
  children?: React.ReactNode;
  disabled: boolean;
  nativeButtonStyle?: ButtonProps["nativeButtonStyle"];
  nativeComposeProps?: ButtonProps["nativeComposeProps"];
  nativeOpacity?: number;
  nativeSystemImage?: ButtonProps["nativeSystemImage"];
  nativeSystemImageSize?: number;
  nativeSwiftProps?: ButtonProps["nativeSwiftProps"];
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  title: string;
  variant: ButtonProps["variant"];
};

/** Web fallback; native platforms resolve this module to Expo UI implementations. */
export function ButtonNative(_props: ButtonNativeProps) {
  return null;
}
