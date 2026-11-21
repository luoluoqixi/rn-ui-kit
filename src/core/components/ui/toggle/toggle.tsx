import { useFieldValue } from "../utils/field_state";
import { ToggleHeroUI } from "./toggle_heroui";
import type { ToggleProps } from "./types";
export function Toggle(p: ToggleProps) {
  const [selected, setSelected] = useFieldValue(p.isSelected, p.defaultSelected ?? false, p.onSelectedChange);
  return <ToggleHeroUI {...p} isSelected={selected} onSelectedChange={next => {
    if (!p.isDisabled && next !== selected) setSelected(next);
  }} />;
}
