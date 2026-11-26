import { jsx as _jsx } from "react/jsx-runtime";
import { Children, Fragment, isValidElement } from "react";
import { Text } from "../text";
import { resolveRenderProp } from "../utils/render";
/** React ignores booleans; numeric zero must still create its slot. */
export function hasCardContent(value) {
    return value != null && typeof value !== "boolean";
}
/** Normalize only bare text, including fragments; custom elements remain intact. */
export function normalizeCardChildren(children) {
    return Children.map(children, (child) => {
        if (typeof child === "string" || typeof child === "number")
            return _jsx(Text, { children: child });
        if (isValidElement(child) && child.type === Fragment) {
            return _jsx(Fragment, { children: normalizeCardChildren(child.props.children) }, child.key);
        }
        return child;
    });
}
export function resolveCardContent(props) {
    const context = {};
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
