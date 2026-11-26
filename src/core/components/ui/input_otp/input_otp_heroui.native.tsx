import { InputOTP } from "heroui-native/input-otp";
import { Fragment } from "react";
import { useDefaultTextStyle } from "../provider/font_provider";

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
  herouiNativeProps,
}: InputOTPProps) {
  const groups = otpGroups(maxLength, groupSize);
  const length = groups.flat().length;
  const font = useDefaultTextStyle(undefined, slotProps?.className);
  return (
    <InputOTP
      {...herouiNativeProps}
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
      textInputProps={{
        ...herouiNativeProps?.textInputProps,
        nativeID,
        accessibilityLabel,
      }}
    >
      {groups.map((indices, group) => (
        <Fragment key={group}>
          {group > 0 && (
            <InputOTP.Separator
              {...separatorProps?.herouiNativeProps}
              className={separatorProps?.className}
            />
          )}
          <InputOTP.Group
            {...groupProps?.herouiNativeProps}
            className={groupProps?.className}
          >
            {indices.map((index) => (
              <InputOTP.Slot
                {...slotProps?.herouiNativeProps}
                className={slotProps?.className}
                index={index}
                key={index}
              >
                <InputOTP.SlotPlaceholder style={font} />
                <InputOTP.SlotValue style={font} />
                <InputOTP.SlotCaret />
              </InputOTP.Slot>
            ))}
          </InputOTP.Group>
        </Fragment>
      ))}
    </InputOTP>
  );
}
