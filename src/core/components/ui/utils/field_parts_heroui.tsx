import { Description } from "@heroui/react/description";
import { FieldError } from "@heroui/react/field-error";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { cn } from "./cn";
import type { FieldMessagesProps } from "./field_parts";
export function FieldMessagesHeroUI(p: FieldMessagesProps) {
  const description = p.descriptionProps?.herouiWebProps;
  const error = p.errorMessageProps?.herouiWebProps;
  const descriptionClass = cn(
    p.descriptionProps?.className,
    p.descriptionClassName,
  );
  const errorClass = cn(
    p.errorMessageProps?.className,
    p.errorMessageClassName,
  );
  const descriptionFont = useDefaultTextStyle(undefined, descriptionClass);
  const errorFont = useDefaultTextStyle(undefined, errorClass);
  const errorStyle = error?.style;
  return (
    <>
      {p.description != null && (
        <Description
          {...description}
          id={p.descriptionID}
          className={descriptionClass}
          style={{ ...textWebStyle(descriptionFont), ...description?.style }}
        >
          {p.description}
        </Description>
      )}
      {p.isInvalid && p.errorMessage != null && (
        <FieldError
          {...error}
          id={p.errorID}
          className={errorClass}
          style={
            typeof errorStyle === "function"
              ? (state) => ({ ...textWebStyle(errorFont), ...errorStyle(state) })
              : { ...textWebStyle(errorFont), ...errorStyle }
          }
        >
          {p.errorMessage}
        </FieldError>
      )}
    </>
  );
}
