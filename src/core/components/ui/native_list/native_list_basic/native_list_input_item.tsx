import * as React from "react";
import { View } from "react-native";
import { Input } from "../../input";
import { NativeListCustomItem, NativeListRow } from "../native_list_basic";
import { useNativeListEditMode } from "../edit_mode";
import type { NativeListInputItemProps } from "../types";

export function NativeListInputItem(props: NativeListInputItemProps) {
  const { inputProps, inputWidth, ...itemProps } = props;
  const disabled = Boolean(itemProps.disabled || inputProps.disabled);
  const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
  const editMode = useNativeListEditMode();
  const input = (
    <Input
      {...inputProps}
      disabled={disabled || editMode}
      unstyled
      style={[
        {
          fontSize: 17,
          height: 44,
          minHeight: 44,
          paddingVertical: 0,
          textAlign: inputProps.textAlign ?? (hasLeadingLabel ? "right" : undefined),
          width: hasLeadingLabel ? (inputWidth ?? 160) : "100%",
        },
        inputProps.style,
      ]}
    />
  );
  if (!hasLeadingLabel) {
    return (
      <NativeListCustomItem
        {...itemProps}
        disabled={disabled}
        paddingVertical={itemProps.paddingVertical ?? 0}
      >
        <View
          style={{
            alignItems: "center",
            flex: 1,
            height: 56,
            justifyContent: "center",
            minWidth: 0,
            width: editMode ? undefined : "100%",
          }}
        >
          {input}
        </View>
      </NativeListCustomItem>
    );
  }
  return (
    <NativeListRow
      {...itemProps}
      disabled={disabled}
      trailing={<View style={{ width: inputWidth ?? 160 }}>{input}</View>}
    />
  );
}
