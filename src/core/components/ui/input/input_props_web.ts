import { useImperativeHandle, useRef } from "react";
import type { ComponentProps, CSSProperties, DOMAttributes, Ref } from "react";
import type { Input } from "@heroui/react/input";
import { useDefaultTextStyle } from "../provider/font_provider";
import { useMergedRefs } from "../utils/field_state";
import { cn } from "../utils/cn";
import type { TextInputOptions } from "../utils/field_types";
import { textWebStyle } from "../text/text_style_web";
/** Shared DOM input/textarea event model. No RN event or ref is cast into a DOM event/ref. */
export function useWebInputProps<
  T extends HTMLInputElement | HTMLTextAreaElement,
  P extends DOMAttributes<T> & {
    ref?: Ref<T>;
    style?: ComponentProps<typeof Input>["style"];
  },
>(props: TextInputOptions, webProps: P | undefined, className?: string) {
  const {
    controlRef,
    style,
    onChangeText,
    nativeID,
    accessibilityLabel,
    isDisabled,
    isReadOnly,
    isRequired,
    isInvalid,
    ...shared
  } = props;
  const inputRef = useRef<T>(null);
  useImperativeHandle(
    controlRef,
    () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }),
    [],
  );
  const ref = useMergedRefs(inputRef, webProps?.ref);
  const fontStyle = useDefaultTextStyle(style, className);
  const baseStyle = textWebStyle(fontStyle);
  const webStyle = webProps?.style;
  return {
    ...webProps,
    ...shared,
    ref,
    id: nativeID,
    "aria-label": accessibilityLabel,
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    "aria-invalid": isInvalid,
    "data-invalid": isInvalid || undefined,
    className: cn("w-full", className),
    style:
      typeof webStyle === "function"
        ? (
            state: Parameters<
              Exclude<
                ComponentProps<typeof Input>["style"],
                CSSProperties | undefined
              >
            >[0],
          ) => ({ ...baseStyle, ...webStyle(state) })
        : { ...baseStyle, ...webStyle },
    onChange: (event: React.ChangeEvent<T>) => {
      webProps?.onChange?.(event);
      if (!event.defaultPrevented) onChangeText?.(event.currentTarget.value);
    },
  };
}
