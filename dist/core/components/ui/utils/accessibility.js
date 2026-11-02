import { Children, isValidElement } from "react";
export function resolveAriaLabel(explicitLabel, fallbackNode) {
    if (explicitLabel != null && explicitLabel.trim().length > 0) {
        return explicitLabel;
    }
    const derivedLabel = Children.toArray(fallbackNode)
        .map((child) => {
        if (typeof child === "string" || typeof child === "number") {
            return String(child);
        }
        if (isValidElement(child)) {
            return resolveAriaLabel(undefined, child.props.children) ?? "";
        }
        return "";
    })
        .join("")
        .trim();
    return derivedLabel.length > 0 ? derivedLabel : undefined;
}
