import { jsx as _jsx } from "react/jsx-runtime";
import { FontTextInput as TextInput } from "../provider/font_provider";
import { cn } from "../utils/cn";
import { Platform } from "react-native";
const WEB_PLACEHOLDER_TEXT_COLOR_CLASS_NAME = "accent-field-placeholder";
const textareaTextStyles = {
    default: { fontSize: 16 },
    "2xs": { fontSize: 12 },
    xs: { fontSize: 12 },
    sm: { fontSize: 14 },
    md: { fontSize: 16 },
    lg: { fontSize: 16 },
    xl: { fontSize: 18 },
    "2xl": { fontSize: 20 },
};
function Textarea({ className, disabled, multiline = true, numberOfLines = Platform.select({ web: 2, native: 8 }), // On web, numberOfLines also determines initial height. On native, it determines the maximum height.
placeholderClassName, size = "default", unstyled = false, ...props }) {
    void placeholderClassName;
    const baseClassName = unstyled
        ? "text-foreground min-w-0 w-full flex-row outline-none"
        : "text-foreground border-field-border dark:bg-field-border/30 flex min-h-16 w-full flex-row rounded-md border bg-transparent px-3 py-2 shadow-sm shadow-black/5";
    const hasExplicitResize = /(?:^|\s)resize(?:-|\s|$)/.test(className ?? "");
    return (_jsx(TextInput, { ...props, placeholderTextColorClassName: props.placeholderTextColorClassName ??
            (Platform.OS === "web"
                ? WEB_PLACEHOLDER_TEXT_COLOR_CLASS_NAME
                : undefined), className: cn(baseClassName, Platform.select({
            web: cn("field-sizing-content outline-none transition-[color,box-shadow] disabled:cursor-not-allowed", !unstyled &&
                "aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger", !unstyled &&
                "focus-visible:border-focus focus-visible:ring-focus/50 focus-visible:ring-[3px]", !hasExplicitResize && (unstyled ? "resize-none" : "resize-y")),
        }), (disabled || props.editable === false) && "opacity-50", className), style: [!unstyled ? textareaTextStyles[size] : null, props.style], multiline: multiline, editable: disabled ? false : props.editable, numberOfLines: numberOfLines, textAlignVertical: "top" }));
}
export { Textarea };
