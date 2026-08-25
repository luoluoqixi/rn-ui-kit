import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { View } from "react-native";
import { Button } from "../button";
import { cn } from "../utils/cn";
import { NativeSheet } from "../sheet/native_sheet";
import { isIos26Plus, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import {
  flattenItems,
  itemLabel,
  SelectBasicTrigger,
  SelectNativeTrigger,
  useSelectState,
} from "./shared";
import type { SelectHandle, SelectProps } from "./types";
import { Text } from "../text";

export const SelectWheel = React.forwardRef<SelectHandle, SelectProps>(
  function SelectWheel(props, ref) {
    const { value, setValue } = useSelectState(props);
    const items = flattenItems(props);
    const [open, setOpen] = React.useState(false);
    const [pendingValue, setPendingValue] = React.useState(value ?? items[0]?.value ?? "");
    const haptics = useResolvedNativeHaptics(props.nativeHaptics);
    const openSheet = () => {
      if (props.disabled || props.isDisabled) return;
      setPendingValue(value ?? items[0]?.value ?? "");
      setOpen(true);
      props.onOpenChange?.(true);
      triggerNativeHaptics(haptics);
    };
    const closeSheet = (commit: boolean) => {
      if (commit && pendingValue !== value) {
        setValue(pendingValue);
        triggerNativeHaptics(haptics);
      }
      setOpen(false);
      props.onOpenChange?.(false);
    };
    React.useImperativeHandle(
      ref,
      () => ({
        open: openSheet,
        close: () => closeSheet(false),
      }),
      [openSheet],
    );
    const defaultButtonStyle = isIos26Plus() ? "glass" : undefined;
    const defaultButtonSize = {
      width: 40,
      height: isIos26Plus() ? 40 : 20,
    };
    return (
      <>
        {props.nativeTrigger ? (
          <SelectNativeTrigger props={props} value={value ?? undefined} onPress={openSheet} />
        ) : (
          <SelectBasicTrigger props={props} value={value ?? undefined} onPress={openSheet} />
        )}
        <NativeSheet
          {...(props.nativeWheelSheetProps as object)}
          detents={props.nativeWheelSheetProps?.detents ?? [0.3]}
          dismissOnOverlayPress={props.nativeWheelSheetProps?.dismissOnOverlayPress ?? true}
          grabber={props.nativeWheelSheetProps?.grabber ?? false}
          open={open}
          onOpenChange={(next) => {
            if (!next) closeSheet(false);
          }}
        >
          <View
            {...props.nativeWheelContainerProps}
            className={cn("flex-1 px-4 pb-4", props.nativeWheelContainerProps?.className)}
          >
            <View
              {...props.nativeWheelButtonContainerProps}
              className={cn(
                "flex-row items-center justify-between py-2 h-20",
                props.nativeWheelButtonContainerProps?.className,
              )}
            >
              <Button
                {...props.nativeWheelCancelButtonProps}
                buttonSize={props.nativeWheelCancelButtonProps?.buttonSize ?? defaultButtonSize}
                native
                nativeButtonStyle={
                  props.nativeWheelCancelButtonProps?.nativeButtonStyle ?? defaultButtonStyle
                }
                title={
                  props.nativeWheelCancelText ?? props.nativeWheelCancelButtonProps?.title ?? "取消"
                }
                variant={props.nativeWheelCancelButtonProps?.variant ?? "ghost"}
                onPress={props.nativeWheelCancelButtonProps?.onPress ?? (() => closeSheet(false))}
              />
              <Text
                {...props.nativeWheelTitleProps}
                className={cn("text-base font-semibold", props.nativeWheelTitleProps?.className)}
              >
                {typeof props.placeholder === "string" ? props.placeholder : "选择"}
              </Text>
              <Button
                {...props.nativeWheelDoneButtonProps}
                buttonSize={props.nativeWheelDoneButtonProps?.buttonSize ?? defaultButtonSize}
                native
                nativeButtonStyle={
                  props.nativeWheelDoneButtonProps?.nativeButtonStyle ?? defaultButtonStyle
                }
                title={
                  props.nativeWheelDoneText ?? props.nativeWheelDoneButtonProps?.title ?? "完成"
                }
                onPress={props.nativeWheelDoneButtonProps?.onPress ?? (() => closeSheet(true))}
              />
            </View>
            <Picker
              {...(props.nativePickerProps as object)}
              selectedValue={pendingValue}
              style={[{ flex: 1 }, props.nativePickerProps?.style]}
              onValueChange={setPendingValue}
            >
              {items.map((item) => (
                <Picker.Item
                  enabled={!(item.disabled ?? item.isDisabled)}
                  key={item.value}
                  label={itemLabel(item, pendingValue)}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
        </NativeSheet>
      </>
    );
  },
);
