import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { Text } from "../text";

export function hasSlotContent(value: ReactNode) {
  return value != null && typeof value !== "boolean";
}

/** Normalize bare text in native View slots, preserving custom elements. */
export function normalizeSlotText(children: ReactNode): ReactNode {
  return Children.map(children, child => {
    if (typeof child === "string" || typeof child === "number") return <Text>{child}</Text>;
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      return <Fragment key={child.key}>{normalizeSlotText(child.props.children)}</Fragment>;
    }
    return child;
  });
}
