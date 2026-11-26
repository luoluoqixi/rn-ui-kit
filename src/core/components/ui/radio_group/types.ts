import type { ComponentProps } from "react";
import type { RadioGroup as NativeGroup } from "heroui-native/radio-group";
import type { Radio as NativeRadio } from "heroui-native/radio";
import type { RadioGroup as WebGroup } from "@heroui/react/radio-group";
import type { Radio as WebRadio } from "@heroui/react/radio";
import type { FieldMetadata, FieldSlotProps } from "../utils/field_types";
import type { NativeHapticsSetting, RenderProp } from "../utils";
export type RadioGroupItemRenderContext = {
  value: string;
  isSelected: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
};
export type RadioGroupItemProps = FieldSlotProps<
  ComponentProps<typeof NativeGroup.Item>,
  ComponentProps<typeof WebRadio>,
  "value" | "isDisabled" | "isInvalid" | "variant" | "isSelected" | "onChange"
> & {
  label?: RenderProp<RadioGroupItemRenderContext>;
  description?: RenderProp<RadioGroupItemRenderContext>;
  labelClassName?: string;
  descriptionClassName?: string;
  labelPosition?: "left" | "right";
  isDisabled?: boolean;
  accessibilityLabel?: string;
  indicator?: RenderProp<RadioGroupItemRenderContext>;
  indicatorProps?: FieldSlotProps<
    ComponentProps<typeof NativeRadio.Indicator>,
    ComponentProps<typeof WebRadio.Control>
  >;
};
export type RadioGroupItemData = RadioGroupItemProps & { value: string };
export type RadioGroupProps = FieldMetadata &
  FieldSlotProps<
    ComponentProps<typeof NativeGroup>,
    ComponentProps<typeof WebGroup>,
    | "value"
    | "onValueChange"
    | "defaultValue"
    | "onChange"
    | "isDisabled"
    | "isInvalid"
    | "variant"
    | "name"
    | "orientation"
    | "isRequired"
  > & {
    items: RadioGroupItemData[];
    itemProps?: RadioGroupItemProps;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    variant?: "primary" | "secondary";
    orientation?: "horizontal" | "vertical";
    labelPosition?: "left" | "right";
    name?: string;
    accessibilityLabel?: string;
    nativeHaptics?: NativeHapticsSetting;
  };
