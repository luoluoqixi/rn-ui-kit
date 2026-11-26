import { Description } from "heroui-native/description";
import { FieldError } from "heroui-native/field-error";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "./cn";
import type { FieldMessagesProps } from "./field_parts";
export function FieldMessagesHeroUI(p: FieldMessagesProps) {
  const description = p.descriptionProps?.herouiNativeProps;
  const error = p.errorMessageProps?.herouiNativeProps;
  const descriptionClass = cn(
    p.descriptionProps?.className,
    p.descriptionClassName,
  );
  const errorClass = cn(
    p.errorMessageProps?.className,
    p.errorMessageClassName,
  );
  const descriptionFont = useDefaultTextStyle(undefined, descriptionClass);
  const errorFont = useDefaultTextStyle(error?.textProps?.style, errorClass);
  return (
    <>
      {p.description != null && (
        <Description
          {...description}
          nativeID={p.descriptionID}
          className={descriptionClass}
          style={[descriptionFont, description?.style]}
          isInvalid={false}
        >
          {p.description}
        </Description>
      )}
      {p.errorMessage != null && (
        <FieldError
          {...error}
          nativeID={p.errorID}
          className={errorClass}
          isInvalid={p.isInvalid ?? false}
          textProps={{ ...error?.textProps, style: errorFont }}
        >
          {p.errorMessage}
        </FieldError>
      )}
    </>
  );
}
