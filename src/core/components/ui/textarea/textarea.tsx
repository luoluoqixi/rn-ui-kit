import { cn } from "../utils/cn";
import { Platform, TextInput } from "react-native";
import { TextareaProps } from "./types";

const WEB_PLACEHOLDER_TEXT_COLOR_CLASS_NAME = "accent-muted-foreground/50";

function Textarea({
  className,
  disabled,
  multiline = true,
  numberOfLines = Platform.select({ web: 2, native: 8 }), // On web, numberOfLines also determines initial height. On native, it determines the maximum height.
  placeholderClassName,
  unstyled = false,
  ...props
}: TextareaProps) {
  void placeholderClassName;
  const baseClassName = unstyled
    ? "text-foreground min-w-0 w-full flex-row outline-none"
    : "text-foreground border-input dark:bg-input/30 flex min-h-16 w-full flex-row rounded-md border bg-transparent px-3 py-2 text-base shadow-sm shadow-black/5 md:text-sm";
  const hasExplicitResize = /(?:^|\s)resize(?:-|\s|$)/.test(className ?? "");
  return (
    <TextInput
      {...props}
      placeholderTextColorClassName={
        props.placeholderTextColorClassName ??
        (Platform.OS === "web" ? WEB_PLACEHOLDER_TEXT_COLOR_CLASS_NAME : undefined)
      }
      className={cn(
        baseClassName,
        Platform.select({
          web: cn(
            "field-sizing-content outline-none transition-[color,box-shadow] disabled:cursor-not-allowed",
            !unstyled && "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            !unstyled && "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            !hasExplicitResize && (unstyled ? "resize-none" : "resize-y"),
          ),
        }),
        (disabled || props.editable === false) && "opacity-50",
        className,
      )}
      multiline={multiline}
      editable={disabled ? false : props.editable}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
    />
  );
}

export { Textarea };
