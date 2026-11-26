import { useImperativeHandle, useRef, type ComponentProps } from "react";
import type { Input as NativeInput } from "heroui-native/input";
import type { TextInput } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { useMergedRefs } from "../utils/field_state";
import type { TextInputOptions } from "../utils/field_types";
import type { InputProps } from "./types";
export function useNativeInputProps(
  props: TextInputOptions,
  nativeProps: InputProps["herouiNativeProps"],
  className?: string,
): ComponentProps<typeof NativeInput> {
  const {
    controlRef,
    style,
    type,
    inputMode,
    name: _,
    accessibilityLabel,
    isReadOnly,
    isRequired: _required,
    ...shared
  } = props;
  const inputRef = useRef<TextInput>(null);
  useImperativeHandle(
    controlRef,
    () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }),
    [],
  );
  const ref = useMergedRefs(inputRef, nativeProps?.ref);
  const resolvedMode =
    inputMode ??
    (type === "email" || type === "url" || type === "tel" || type === "search"
      ? type
      : undefined);
  return {
    ...nativeProps,
    ...shared,
    inputMode: resolvedMode,
    ref,
    className,
    accessibilityLabel,
    secureTextEntry: type === "password",
    ...(props.isDisabled !== undefined || isReadOnly !== undefined
      ? { editable: !(props.isDisabled || isReadOnly) }
      : {}),
    accessibilityState: {
      ...nativeProps?.accessibilityState,
      disabled: props.isDisabled,
    },
    style: useDefaultTextStyle([style, nativeProps?.style], className),
  };
}
