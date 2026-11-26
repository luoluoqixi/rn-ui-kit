import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SearchField } from "@heroui/react/search-field";
import { Label } from "../label";
import { FieldMessages } from "../utils/field_parts";
import { useWebInputProps } from "../input/input_props_web";
import { cn } from "../utils/cn";
import { useSearchFieldState } from "./search_field_state";
export function SearchFieldHeroUI(p) {
    const state = useSearchFieldState(p);
    const { value: _value, defaultValue: _default, ...input } = useWebInputProps(state.input, p.inputProps?.herouiWebProps, cn(p.inputProps?.className, p.inputClassName));
    return _jsxs(SearchField, { ...p.herouiWebProps, className: cn("w-full", p.className), value: state.value, onChange: state.change, isDisabled: p.isDisabled, isReadOnly: p.isReadOnly, isInvalid: p.isInvalid, isRequired: p.isRequired, variant: p.variant, name: p.name, "aria-label": state.input.accessibilityLabel, validationBehavior: p.herouiWebProps?.validationBehavior ?? "aria", onSubmit: state.submit, onClear: () => { if (!p.isDisabled && !p.isReadOnly)
            p.onClear?.(); }, children: [p.label != null && _jsx(Label, { ...p.labelProps, nativeID: state.id + "-label", htmlFor: state.id, controlRef: state.control, isDisabled: p.isDisabled, isInvalid: p.isInvalid, isRequired: p.isRequired, className: cn(p.labelProps?.className, p.labelClassName), children: p.label }), _jsxs(SearchField.Group, { ...p.groupProps?.herouiWebProps, className: cn(p.groupProps?.className, p.groupClassName), children: [p.showSearchIcon !== false && _jsx(SearchField.SearchIcon, { children: p.searchIcon }), _jsx(SearchField.Input, { ...input }), state.canClear && _jsx(SearchField.ClearButton, { className: p.clearButtonClassName, "aria-label": "\u6E05\u9664\u641C\u7D22" })] }), _jsx(FieldMessages, { ...p, descriptionID: state.id + "-description", errorID: state.id + "-error" })] });
}
