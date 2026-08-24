import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { View } from "react-native";
import { Button } from "../button";
import { NativeSheet } from "../sheet/native_sheet";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
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
    return (
      <>
        {props.nativeTrigger ? (
          <SelectNativeTrigger props={props} value={value ?? undefined} onPress={openSheet} />
        ) : (
          <SelectBasicTrigger props={props} value={value ?? undefined} onPress={openSheet} />
        )}
        <NativeSheet
          detents={[0.3]}
          dismissOnOverlayPress
          grabber={false}
          open={open}
          onOpenChange={(next) => {
            if (!next) closeSheet(false);
          }}
        >
          <View className="flex-1 px-4 pb-4">
            <View className="flex-row items-center justify-between py-2">
              <Button native variant="ghost" title="取消" onPress={() => closeSheet(false)} />
              <Text className="text-base font-semibold">
                {typeof props.placeholder === "string" ? props.placeholder : "选择"}
              </Text>
              <Button native title="完成" onPress={() => closeSheet(true)} />
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
