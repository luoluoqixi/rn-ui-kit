import type { ButtonProps } from "./types";
import type { StyleProp, ViewStyle } from "react-native";

export type ButtonSwiftProps = {
  accessibilityLabel?: string;
  disabled: boolean;
  nativeButtonStyle: NonNullable<ButtonProps["nativeButtonStyle"]>;
  nativeOpacity: number;
  nativeSystemImage: ButtonProps["nativeSystemImage"];
  nativeSystemImageSize: number;
  nativeSwiftButtonSize: ButtonProps["nativeSwiftButtonSize"];
  nativeSwiftProps: ButtonProps["nativeSwiftProps"];
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  title: string;
};

/** Non-iOS fallback. The public Button routes `native="swift-ui"` to its normal renderer here. */
export function ButtonSwift(_props: ButtonSwiftProps) {
  return null;
}
