import { SearchField } from "heroui-native/search-field";
import { Label } from "../label";
import { FieldMessages } from "../utils/field_parts";
import { useNativeInputProps } from "../input/input_props_native";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { useSearchFieldState } from "./search_field_state";
import type { SearchFieldProps } from "./types";
export function SearchFieldHeroUI(p: SearchFieldProps) {
  const state = useSearchFieldState(p);
  const haptics = useResolvedNativeHaptics(p.nativeHaptics, { defaultEnabled: true });
  const { value: _value, defaultValue: _default, onChangeText: _change, ...input } = useNativeInputProps(state.input, p.inputProps?.herouiNativeProps, cn(p.inputProps?.className, p.inputClassName));
  return <SearchField {...p.herouiNativeProps} className={cn("w-full", p.className)}
    value={state.value} onChange={state.change} isDisabled={p.isDisabled} isInvalid={p.isInvalid} isRequired={p.isRequired}>
    {p.label != null && <Label {...p.labelProps} nativeID={state.id + "-label"} htmlFor={state.id}
      controlRef={state.control} isDisabled={p.isDisabled} isInvalid={p.isInvalid} isRequired={p.isRequired}
      className={cn(p.labelProps?.className, p.labelClassName)}>{p.label}</Label>}
    <SearchField.Group {...p.groupProps?.herouiNativeProps} className={cn(p.groupProps?.className, p.groupClassName)}>
      {p.showSearchIcon !== false && <SearchField.SearchIcon>{p.searchIcon}</SearchField.SearchIcon>}
      <SearchField.Input {...input} onSubmitEditing={event => {
        p.inputProps?.herouiNativeProps?.onSubmitEditing?.(event);
        if (!event.defaultPrevented) state.submit(event.nativeEvent.text);
      }} />
      {state.canClear && <SearchField.ClearButton className={p.clearButtonClassName} isDisabled={p.isDisabled}
        accessibilityLabel="清除搜索" onPress={() => {
          if (p.isDisabled || p.isReadOnly) return;
          triggerNativeHaptics(haptics); p.onClear?.(); state.control.current?.focus();
        }} />}
    </SearchField.Group>
    <FieldMessages {...p} descriptionID={state.id + "-description"} errorID={state.id + "-error"} />
  </SearchField>;
}
