import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { useUiTheme } from "../utils/theme";
import {
  itemLabel,
  flattenItems,
  SelectNativeTrigger,
  SelectBasicTrigger,
  useSelectState,
} from "./shared";
import type { SelectHandle, SelectProps } from "./types";

export const SelectDialog = React.forwardRef<SelectHandle, SelectProps>(
  function SelectDialog(props, ref) {
    const { value, setValue } = useSelectState(props);
    const pickerRef = React.useRef<Picker<string>>(null);
    const [open, setOpen] = React.useState(false);
    const items = flattenItems(props);
    const theme = useUiTheme();
    const haptics = useResolvedNativeHaptics(props.nativeHaptics);
    const openPicker = () => {
      if (props.disabled || props.isDisabled) return;
      triggerNativeHaptics(haptics);
      setOpen(true);
      requestAnimationFrame(() => pickerRef.current?.focus());
      props.onOpenChange?.(true);
    };
    React.useImperativeHandle(
      ref,
      () => ({
        open: openPicker,
        close: () => setOpen(false),
      }),
      [openPicker],
    );
    return (
      <View>
        {props.nativeTrigger ? (
          <SelectNativeTrigger props={props} value={value ?? undefined} onPress={openPicker} />
        ) : (
          <SelectBasicTrigger props={props} value={value ?? undefined} onPress={openPicker} />
        )}
        {open ? (
          <View style={styles.pickerHost}>
            <Picker
              {...(props.nativePickerProps as object)}
              ref={pickerRef}
              mode="dialog"
              selectedValue={value ?? ""}
              onBlur={() => {
                setOpen(false);
                props.onOpenChange?.(false);
              }}
              onValueChange={(next) => {
                setValue(next);
                triggerNativeHaptics(haptics);
                setOpen(false);
                props.onOpenChange?.(false);
              }}
            >
              {items.map((item) => {
                const selected = item.value === value;
                return (
                  <Picker.Item
                    enabled={!(item.disabled ?? item.isDisabled)}
                    key={item.value}
                    label={itemLabel(item, value ?? undefined)}
                    value={item.value}
                    {...({
                      swatchColor: item.swatchColor,
                      style: {
                        backgroundColor: selected ? theme.accent : "transparent",
                        color: selected ? theme.accentForeground : undefined,
                      },
                    } as object)}
                  />
                );
              })}
            </Picker>
          </View>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  pickerHost: { height: 1, left: 0, opacity: 0, position: "absolute", top: 0, width: 1 },
});
