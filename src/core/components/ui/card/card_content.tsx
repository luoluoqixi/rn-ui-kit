import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { Text } from "../text";
import { resolveRenderProp } from "../utils/render";
import type { CardProps, CardRenderContext } from "./types";

/** React ignores booleans; numeric zero must still create its slot. */
export function hasCardContent(value: ReactNode) {
  return value != null && typeof value !== "boolean";
}

/** Normalize only bare text, including fragments; custom elements remain intact. */
export function normalizeCardChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") return <Text>{child}</Text>;
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      return <Fragment key={child.key}>{normalizeCardChildren(child.props.children)}</Fragment>;
    }
    return child;
  });
}

export function resolveCardContent(props: CardProps) {
  const context: CardRenderContext = {};
  const header = resolveRenderProp(props.header, context);
  const customHeader = hasCardContent(header);
  // Do not invoke callbacks for title/description when a custom header replaces them.
  const title = customHeader ? undefined : resolveRenderProp(props.title, context);
  const description = customHeader ? undefined : resolveRenderProp(props.description, context);
  return {
    header,
    title,
    description,
    customHeader,
    hasHeader: customHeader || hasCardContent(title) || hasCardContent(description),
    content: resolveRenderProp(props.content, context),
    footer: resolveRenderProp(props.footer, context),
  };
}
