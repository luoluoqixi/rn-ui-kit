import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../utils/cn";
import { Slot } from "@rn-primitives/slot";
import * as React from "react";
import { Platform, Text as RNText } from "react-native";
import { textVariants } from "./variants";
const ROLE = {
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    blockquote: Platform.select({ web: "blockquote" }),
    code: Platform.select({ web: "code" }),
};
const ARIA_LEVEL = {
    h1: "1",
    h2: "2",
    h3: "3",
    h4: "4",
};
const TextClassContext = React.createContext(undefined);
const Text = React.forwardRef(function Text({ className, asChild = false, size, variant = "default", ...props }, ref) {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot : RNText;
    return (_jsx(Component, { className: cn(textVariants({ size, variant }), textClass, className), role: variant ? ROLE[variant] : undefined, "aria-level": variant ? ARIA_LEVEL[variant] : undefined, ref: ref, ...props }));
});
export { Text, TextClassContext, textVariants };
