import type { ComponentProps } from "react";
import type * as SwitchPrimitives from "@rn-primitives/switch";
import type { StyleProp, ViewStyle } from "react-native";

import type { NativeHapticsSetting, RenderProp } from "../utils";

export type SwitchRenderContext = {
  checked: boolean;
  disabled?: boolean;
};

export type SwitchProps = ComponentProps<typeof SwitchPrimitives.Root> & {
  containerClassName?: string;
  defaultChecked?: boolean;
  label?: RenderProp<SwitchRenderContext>;
  labelClassName?: string;
  labelPosition?: "left" | "right";
  native?: boolean;
  nativeComposeProps?: Record<string, unknown>;
  nativeHaptics?: NativeHapticsSetting;
  nativeSwiftProps?: Record<string, unknown>;
};

export type SwitchNativeProps = {
  disabled?: boolean;
  nativeComposeProps?: Record<string, unknown>;
  nativeSwiftProps?: Record<string, unknown>;
  onValueChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
  value: boolean;
};
