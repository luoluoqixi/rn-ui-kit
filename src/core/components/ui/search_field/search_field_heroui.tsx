import { SearchField } from "@heroui/react/search-field";
import { Label } from "../label";
import { FieldMessages } from "../utils/field_parts";
import { useWebInputProps } from "../input/input_props_web";
import { cn } from "../utils/cn";
import { useSearchFieldState } from "./search_field_state";
import type { SearchFieldProps } from "./types";
export function SearchFieldHeroUI(p: SearchFieldProps) {
  const state = useSearchFieldState(p);
  const { value: _value, defaultValue: _default, ...input } = useWebInputProps(state.input, p.inputProps?.herouiWebProps, cn(p.inputProps?.className, p.inputClassName));
  return <SearchField {...p.herouiWebProps} className={cn("w-full", p.className)}
    value={state.value} onChange={state.change} isDisabled={p.isDisabled} isReadOnly={p.isReadOnly}
    isInvalid={p.isInvalid} isRequired={p.isRequired} variant={p.variant} name={p.name}
    aria-label={state.input.accessibilityLabel} validationBehavior={p.herouiWebProps?.validationBehavior ?? "aria"}
    onSubmit={state.submit} onClear={() => { if (!p.isDisabled && !p.isReadOnly) p.onClear?.(); }}>
    {p.label != null && <Label {...p.labelProps} nativeID={state.id + "-label"} htmlFor={state.id}
      controlRef={state.control} isDisabled={p.isDisabled} isInvalid={p.isInvalid} isRequired={p.isRequired}
      className={cn(p.labelProps?.className, p.labelClassName)}>{p.label}</Label>}
    <SearchField.Group {...p.groupProps?.herouiWebProps} className={cn(p.groupProps?.className, p.groupClassName)}>
      {p.showSearchIcon !== false && <SearchField.SearchIcon>{p.searchIcon}</SearchField.SearchIcon>}
      <SearchField.Input {...input} />
      {state.canClear && <SearchField.ClearButton className={p.clearButtonClassName} aria-label="清除搜索" />}
    </SearchField.Group>
    <FieldMessages {...p} descriptionID={state.id + "-description"} errorID={state.id + "-error"} />
  </SearchField>;
}
