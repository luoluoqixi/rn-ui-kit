import { jsx as _jsx } from "react/jsx-runtime";
import { Children, Fragment, isValidElement } from "react";
import { Text } from "../text";
export function hasSlotContent(value) {
    return value != null && typeof value !== "boolean";
}
/** Normalize bare text in native View slots, preserving custom elements. */
export function normalizeSlotText(children) {
    return Children.map(children, child => {
        if (typeof child === "string" || typeof child === "number")
            return _jsx(Text, { children: child });
        if (isValidElement(child) && child.type === Fragment) {
            return _jsx(Fragment, { children: normalizeSlotText(child.props.children) }, child.key);
        }
        return child;
    });
}
