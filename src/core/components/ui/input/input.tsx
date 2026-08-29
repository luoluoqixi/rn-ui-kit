import { cn } from "../utils/cn";
import { Platform, TextInput, type TextStyle } from "react-native";
import type { InputProps, InputSize } from "./types";

const WEB_PLACEHOLDER_TEXT_COLOR_CLASS_NAME = "accent-muted-foreground/50";

const inputSizeStyles: Record<InputSize, TextStyle> = {
  default: { fontSize: 16, height: 44, minHeight: 44, paddingHorizontal: 12 },
  "2xs": { fontSize: 12, height: 32, minHeight: 32, paddingHorizontal: 8 },
  "xs": { fontSize: 12, height: 36, minHeight: 36, paddingHorizontal: 10 },
  "sm": { fontSize: 14, height: 40, minHeight: 40, paddingHorizontal: 12 },
  "md": { fontSize: 16, height: 44, minHeight: 44, paddingHorizontal: 12 },
  "lg": { fontSize: 16, height: 48, minHeight: 48, paddingHorizontal: 16 },
  "xl": { fontSize: 18, height: 56, minHeight: 56, paddingHorizontal: 16 },
  "2xl": { fontSize: 20, height: 64, minHeight: 64, paddingHorizontal: 20 },
};

function Input({
  className,
  autoFocusNative,
  disabled,
  placeholderClassName,
  size = "default",
  unstyled = false,
  ...props
}: InputProps) {
  void placeholderClassName;
  const baseClassName = unstyled
    ? "text-foreground min-w-0 flex-row items-center outline-none"
    : "dark:bg-input/30 border-input bg-background text-foreground flex w-full min-w-0 flex-row items-center rounded-md border shadow-sm shadow-black/5";
  return (
    <TextInput
      {...props}
      placeholderTextColorClassName={
        props.placeholderTextColorClassName ??
        (Platform.OS === "web" ? WEB_PLACEHOLDER_TEXT_COLOR_CLASS_NAME : undefined)
      }
      className={cn(
        baseClassName,
        (disabled || props.editable === false) &&
          cn(
            "opacity-50",
            Platform.select({ web: "disabled:pointer-events-none disabled:cursor-not-allowed" }),
          ),
        Platform.select({
          web: cn(
            "selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow]",
            !unstyled &&
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            !unstyled &&
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          ),
          native: "placeholder:text-muted-foreground/50",
        }),
        className,
      )}
      style={[
        !unstyled ? inputSizeStyles[size] : null,
        {
          includeFontPadding: Platform.OS === "android" ? false : undefined,
          paddingVertical: 0,
          textAlignVertical: Platform.OS === "android" ? "center" : undefined,
        },
        props.style,
      ]}
      autoFocus={autoFocusNative ?? props.autoFocus}
      editable={disabled ? false : props.editable}
    />
  );
}

export { Input };
