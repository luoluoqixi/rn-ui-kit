import type { ComponentProps, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { Switch as NativeSwitch } from "heroui-native/switch";
import type { ControlField } from "heroui-native/control-field";
import type { Switch as WebSwitch } from "@heroui/react/switch";
import type { FieldMetadata, FieldSlotProps } from "../utils/field_types";
import type { NativeHapticsSetting, RenderProp } from "../utils";

export type SwitchSize = "sm" | "md" | "lg";
export type SwitchRenderContext = { isSelected: boolean; isDisabled: boolean };
export type SwitchProps = Omit<FieldMetadata, "label" | "description" | "labelProps" | "errorMessage" | "errorMessageProps" | "errorMessageClassName"> &
  FieldSlotProps<ComponentProps<typeof ControlField>, ComponentProps<typeof WebSwitch>,
    "isSelected" | "defaultSelected" | "onSelectedChange" | "onChange" | "onPress" | "isDisabled" | "isInvalid" | "isRequired" | "size" | "name" | "value"> & {
    isSelected?: boolean;
    defaultSelected?: boolean;
    onSelectedChange?: (value: boolean) => void;
    isDisabled?: boolean;
    size?: SwitchSize;
    label?: RenderProp<SwitchRenderContext>;
    description?: RenderProp<SwitchRenderContext>;
    labelProps?: import("../text").TextProps;
    labelPosition?: "left" | "right";
    containerClassName?: string;
    accessibilityLabel?: string;
    nativeID?: string;
    name?: string;
    value?: string;
    /** iOS / Android default to the existing system control. */
    native?: boolean;
    nativeSwiftProps?: Record<string, unknown>;
    nativeComposeProps?: Record<string, unknown>;
    nativeHaptics?: NativeHapticsSetting;
    /** System-control host styling; HeroUI root styles belong to platform props. */
    style?: StyleProp<ViewStyle>;
    controlProps?: FieldSlotProps<ComponentProps<typeof NativeSwitch>, ComponentProps<typeof WebSwitch.Control>,
      "isSelected" | "onSelectedChange" | "isDisabled" | "onPress">;
    thumbProps?: FieldSlotProps<ComponentProps<typeof NativeSwitch.Thumb>, ComponentProps<typeof WebSwitch.Thumb>>;
    thumbContent?: RenderProp<SwitchRenderContext>;
  };

export type SwitchNativeProps = {
  disabled?: boolean;
  nativeComposeProps?: Record<string, unknown>;
  nativeSwiftProps?: Record<string, unknown>;
  onValueChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
  value: boolean;
};

/** Internal, resolved state shared by the platform adapters. */
export type SwitchAdapterProps = SwitchProps & {
  selected: boolean;
  onSelect: (value: boolean) => void;
  resolvedLabel: ReactNode;
  resolvedDescription: ReactNode;
};
