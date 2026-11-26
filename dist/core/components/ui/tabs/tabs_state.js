import { useFieldValue } from "../utils/field_state";
export function useTabsState(props) {
    const first = props.items.find((item) => !item.isDisabled)?.value ?? "";
    const [value, setValue] = useFieldValue(props.value, props.defaultValue ?? first, props.onValueChange);
    return [
        value,
        (next) => {
            const item = props.items.find((item) => item.value === next);
            if (!props.isDisabled && item && !item.isDisabled && value !== next)
                setValue(next);
        },
    ];
}
