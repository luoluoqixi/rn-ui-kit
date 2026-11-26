import { jsx as _jsx } from "react/jsx-runtime";
import { Children } from "react";
import { Text, TextClassContext } from "../text";
/** Bare strings/numbers need a Text boundary on Native; custom nodes stay intact. */
export function AccordionText({ children, className }) {
    return (_jsx(TextClassContext.Provider, { value: className, children: Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child) }));
}
