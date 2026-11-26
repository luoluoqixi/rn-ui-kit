import { useState } from "react";
import type { AccordionSelectionProps } from "./types";

function toValues(value: string | string[] | undefined): string[] {
  return value === undefined ? [] : Array.isArray(value) ? [...new Set(value)] : [value];
}

/** Both HeroUI implementations are controlled here, including an empty single value. */
export function useAccordionState(
  props: AccordionSelectionProps & {
    isCollapsible?: boolean;
    isDisabled?: boolean;
  },
) {
  const [internalValue, setInternalValue] = useState(() => toValues(props.defaultValue));
  const isControlled = Object.prototype.hasOwnProperty.call(props, "value");
  const values = isControlled ? toValues(props.value) : internalValue;
  const isMultiple = props.selectionMode === "multiple";

  function onValueChange(value: string | string[] | undefined) {
    const requested = toValues(value);
    const next = isMultiple ? requested : requested.slice(0, 1);
    if (
      props.isDisabled ||
      (next.length === values.length && next.every((item) => values.includes(item)))
    )
      return false;
    if (
      props.isCollapsible === false &&
      (isMultiple
        ? values.some((item) => !next.includes(item))
        : values.length > 0 && next.length === 0)
    )
      return false;

    if (!isControlled) setInternalValue(next);
    if (props.selectionMode === "multiple") props.onValueChange?.(next);
    else props.onValueChange?.(next[0]);
    return true;
  }

  return { values, isMultiple, onValueChange };
}

export function validateAccordionItems(items: readonly { value: string }[]) {
  const keys = new Set<string>();
  for (const { value } of items) {
    if (!value || keys.has(value)) {
      throw new Error("Accordion items must have nonempty, unique values.");
    }
    keys.add(value);
  }
}
