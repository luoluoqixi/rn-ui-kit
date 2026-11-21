import type { TextProps } from "react-native";
import type { ButtonProps } from "../button";
import type { NativeHapticsSetting } from "../utils";

export type LinkProps = TextProps & {
  size?: ButtonProps["size"];
  href?: string;
  nativeHaptics?: NativeHapticsSetting;
  pressStyle?: object;
};
