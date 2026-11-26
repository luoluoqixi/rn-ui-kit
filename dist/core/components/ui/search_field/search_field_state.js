import { useId, useRef } from "react";
import { useFieldValue, useMergedRefs } from "../utils/field_state";
export function useSearchFieldState(p) {
    const generated = useId();
    const id = p.nativeID ?? generated;
    const control = useRef(null);
    const ref = useMergedRefs(control, p.controlRef);
    const [value, setValue] = useFieldValue(p.value, p.defaultValue ?? "", p.onChangeText);
    const change = (next) => { if (!p.isDisabled && !p.isReadOnly && next !== value)
        setValue(next); };
    const input = {
        value, onChangeText: undefined, controlRef: ref, nativeID: id, style: p.style,
        placeholder: p.placeholder ?? "搜索…", variant: p.variant, isDisabled: p.isDisabled,
        isReadOnly: p.isReadOnly, isInvalid: p.isInvalid, isRequired: p.isRequired,
        inputMode: p.inputMode ?? "search", autoComplete: p.autoComplete ?? "off", autoFocus: p.autoFocus,
        maxLength: p.maxLength, name: p.name, type: "search",
        accessibilityLabel: p.accessibilityLabel ?? (typeof p.label === "string" ? p.label : p.label == null ? "搜索" : undefined),
        "aria-labelledby": p["aria-labelledby"] ?? (p.label != null ? id + "-label" : undefined),
        "aria-describedby": [p["aria-describedby"], p.description != null && id + "-description", p.isInvalid && p.errorMessage != null && id + "-error"].filter(Boolean).join(" ") || undefined,
    };
    return { id, value, change, control, input,
        submit: (text = value) => { if (!p.isDisabled)
            p.onSubmit?.(text); },
        canClear: p.isClearable !== false && !p.isReadOnly,
    };
}
