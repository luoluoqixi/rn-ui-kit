import type { ComponentProps, ReactNode, Ref } from "react";
import type { StyleProp, TextStyle } from "react-native";
import type { Description as NativeDescription } from "heroui-native/description";
import type { Description as WebDescription } from "@heroui/react/description";
import type { FieldError as NativeFieldError } from "heroui-native/field-error";
import type { FieldError as WebFieldError } from "@heroui/react/field-error";
import type { LabelProps } from "../label";

/** Platform events, styles and refs remain in their own typed namespace. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type FieldSlotProps<N, W, K extends PropertyKey = never> = {
  className?: string;
  herouiNativeProps?: DistributiveOmit<N, "children" | "className" | "asChild" | K>;
  herouiWebProps?: Omit<W, "children" | "className" | K>;
};
export type FieldDescriptionProps = FieldSlotProps<
  ComponentProps<typeof NativeDescription>,
  ComponentProps<typeof WebDescription>
>;
export type FieldErrorProps = FieldSlotProps<
  ComponentProps<typeof NativeFieldError>,
  ComponentProps<typeof WebFieldError>
>;
export type FieldMetadata = {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  labelClassName?: string;
  descriptionClassName?: string;
  errorMessageClassName?: string;
  labelProps?: Omit<LabelProps, "children">;
  descriptionProps?: FieldDescriptionProps;
  errorMessageProps?: FieldErrorProps;
};
export type TextInputHandle = { focus(): void; blur(): void };
export type TextInputOptions = {
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  variant?: "primary" | "secondary";
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  type?: "text" | "email" | "password" | "url" | "tel" | "search";
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
  autoComplete?:
    | "off"
    | "email"
    | "name"
    | "username"
    | "current-password"
    | "new-password"
    | "one-time-code"
    | "tel";
  autoFocus?: boolean;
  maxLength?: number;
  name?: string;
  nativeID?: string;
  accessibilityLabel?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  /** Portable focus/blur only; full platform refs are available in platform props. */
  controlRef?: Ref<TextInputHandle>;
  style?: StyleProp<TextStyle>;
};
