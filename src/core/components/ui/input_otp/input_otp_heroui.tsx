import { InputOTP } from "@heroui/react/input-otp";
import { Fragment } from "react";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { otpGroups } from "./input_otp_state";
import type { InputOTPProps } from "./types";
export function InputOTPHeroUI({
  maxLength,
  groupSize,
  groupProps,
  slotProps,
  separatorProps,
  className,
  value,
  defaultValue,
  onChangeText,
  onComplete,
  pattern = "^\\d+$",
  pasteTransformer,
  placeholder,
  inputMode = "numeric",
  variant,
  isDisabled,
  isInvalid,
  nativeID,
  accessibilityLabel,
  herouiWebProps,
}: InputOTPProps) {
  const groups = otpGroups(maxLength, groupSize);
  const length = groups.flat().length;
  const font = useDefaultTextStyle(undefined, slotProps?.className);
  return (
    <InputOTP
      {...herouiWebProps}
      className={className}
      value={value}
      defaultValue={defaultValue}
      onChange={onChangeText}
      onComplete={onComplete}
      maxLength={length}
      pattern={pattern}
      pasteTransformer={pasteTransformer}
      placeholder={placeholder}
      inputMode={inputMode}
      variant={variant}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      id={nativeID}
      aria-label={accessibilityLabel}
    >
      {groups.map((indices, group) => (
        <Fragment key={group}>
          {group > 0 && (
            <InputOTP.Separator
              {...separatorProps?.herouiWebProps}
              className={separatorProps?.className}
            />
          )}
          <InputOTP.Group
            {...groupProps?.herouiWebProps}
            className={groupProps?.className}
          >
            {indices.map((index) => (
              <InputOTP.Slot
                {...slotProps?.herouiWebProps}
                className={slotProps?.className}
                index={index}
                key={index}
                style={{
                  ...textWebStyle(font),
                  ...slotProps?.herouiWebProps?.style,
                }}
              ></InputOTP.Slot>
            ))}
          </InputOTP.Group>
        </Fragment>
      ))}
    </InputOTP>
  );
}
