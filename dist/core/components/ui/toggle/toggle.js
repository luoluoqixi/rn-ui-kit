import { jsx as _jsx } from "react/jsx-runtime";
import { useFieldValue } from "../utils/field_state";
import { ToggleHeroUI } from "./toggle_heroui";
export function Toggle(p) {
    const [selected, setSelected] = useFieldValue(p.isSelected, p.defaultSelected ?? false, p.onSelectedChange);
    return _jsx(ToggleHeroUI, { ...p, isSelected: selected, onSelectedChange: next => {
            if (!p.isDisabled && next !== selected)
                setSelected(next);
        } });
}
