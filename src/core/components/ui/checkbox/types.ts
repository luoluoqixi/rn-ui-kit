import type { ComponentProps } from "react";
import type { Checkbox as NativeCheckbox } from "heroui-native/checkbox";
import type { ControlField } from "heroui-native/control-field";
import type { Checkbox as WebCheckbox } from "@heroui/react/checkbox";
import type { FieldMetadata, FieldSlotProps } from "../utils/field_types";
import type { NativeHapticsSetting, RenderProp } from "../utils";
export type CheckboxRenderContext = {
  isSelected: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
};
export type CheckboxProps = Omit<
  FieldMetadata,
  "label" | "description" | "labelProps"
> &
  FieldSlotProps<
    ComponentProps<typeof ControlField>,
    ComponentProps<typeof WebCheckbox>,
    | "isSelected"
    | "onSelectedChange"
    | "defaultSelected"
    | "onChange"
    | "onPress"
    | "isDisabled"
    | "isInvalid"
    | "isRequired"
    | "variant"
    | "name"
    | "value"
  > & {
    labelProps?: import("../text").TextProps;
    label?: RenderProp<CheckboxRenderContext>;
    description?: RenderProp<CheckboxRenderContext>;
    isSelected?: boolean;
    defaultSelected?: boolean;
    onSelectedChange?: (value: boolean) => void;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    variant?: "primary" | "secondary";
    name?: string;
    value?: string;
    accessibilityLabel?: string;
    nativeHaptics?: NativeHapticsSetting;
    labelPosition?: "left" | "right";
    controlProps?: FieldSlotProps<
      ComponentProps<typeof NativeCheckbox>,
      ComponentProps<typeof WebCheckbox.Control>,
      | "isSelected"
      | "onSelectedChange"
      | "isDisabled"
      | "isInvalid"
      | "variant"
      | "onPress"
    >;
    indicatorProps?: FieldSlotProps<
      ComponentProps<typeof NativeCheckbox.Indicator>,
      ComponentProps<typeof WebCheckbox.Indicator>
    >;
    indicator?: RenderProp<CheckboxRenderContext>;
  };
