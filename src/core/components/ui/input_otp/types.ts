import type { ComponentProps } from "react";
import type { InputOTP as NativeOTP } from "heroui-native/input-otp";
import type { InputOTP as WebOTP } from "@heroui/react/input-otp";
import type { FieldSlotProps } from "../utils/field_types";
export type InputOTPGroupProps = FieldSlotProps<
  ComponentProps<typeof NativeOTP.Group>,
  ComponentProps<typeof WebOTP.Group>
>;
export type InputOTPSlotProps = FieldSlotProps<
  ComponentProps<typeof NativeOTP.Slot>,
  ComponentProps<typeof WebOTP.Slot>,
  "index"
>;
export type InputOTPSeparatorProps = FieldSlotProps<
  ComponentProps<typeof NativeOTP.Separator>,
  ComponentProps<typeof WebOTP.Separator>
>;
export type InputOTPProps = FieldSlotProps<
  ComponentProps<typeof NativeOTP>,
  ComponentProps<typeof WebOTP>,
  | "maxLength"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onComplete"
  | "pattern"
  | "pasteTransformer"
  | "variant"
  | "isDisabled"
  | "isInvalid"
  | "inputMode"
  | "placeholder"
> & {
  maxLength?: number;
  /** Insert a separator after every N slots; omitted means a single group. */
  groupSize?: number;
  groupProps?: InputOTPGroupProps;
  slotProps?: InputOTPSlotProps;
  separatorProps?: InputOTPSeparatorProps;
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  onComplete?: (value: string) => void;
  pattern?: string;
  pasteTransformer?: (text: string) => string;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel";
  variant?: "primary" | "secondary";
  isDisabled?: boolean;
  isInvalid?: boolean;
  accessibilityLabel?: string;
  nativeID?: string;
};
