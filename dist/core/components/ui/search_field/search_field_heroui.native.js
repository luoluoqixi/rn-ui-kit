import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SearchField } from "heroui-native/search-field";
import { Label } from "../label";
import { FieldMessages } from "../utils/field_parts";
import { useNativeInputProps } from "../input/input_props_native";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { useSearchFieldState } from "./search_field_state";
export function SearchFieldHeroUI(p) {
    const state = useSearchFieldState(p);
    const haptics = useResolvedNativeHaptics(p.nativeHaptics, { defaultEnabled: true });
    const { value: _value, defaultValue: _default, onChangeText: _change, ...input } = useNativeInputProps(state.input, p.inputProps?.herouiNativeProps, cn(p.inputProps?.className, p.inputClassName));
    return _jsxs(SearchField, { ...p.herouiNativeProps, className: cn("w-full", p.className), value: state.value, onChange: state.change, isDisabled: p.isDisabled, isInvalid: p.isInvalid, isRequired: p.isRequired, children: [p.label != null && _jsx(Label, { ...p.labelProps, nativeID: state.id + "-label", htmlFor: state.id, controlRef: state.control, isDisabled: p.isDisabled, isInvalid: p.isInvalid, isRequired: p.isRequired, className: cn(p.labelProps?.className, p.labelClassName), children: p.label }), _jsxs(SearchField.Group, { ...p.groupProps?.herouiNativeProps, className: cn(p.groupProps?.className, p.groupClassName), children: [p.showSearchIcon !== false && _jsx(SearchField.SearchIcon, { children: p.searchIcon }), _jsx(SearchField.Input, { ...input, onSubmitEditing: event => {
                            p.inputProps?.herouiNativeProps?.onSubmitEditing?.(event);
                            if (!event.defaultPrevented)
                                state.submit(event.nativeEvent.text);
                        } }), state.canClear && _jsx(SearchField.ClearButton, { className: p.clearButtonClassName, isDisabled: p.isDisabled, accessibilityLabel: "\u6E05\u9664\u641C\u7D22", onPress: () => {
                            if (p.isDisabled || p.isReadOnly)
                                return;
                            triggerNativeHaptics(haptics);
                            p.onClear?.();
                            state.control.current?.focus();
                        } })] }), _jsx(FieldMessages, { ...p, descriptionID: state.id + "-description", errorID: state.id + "-error" })] });
}
