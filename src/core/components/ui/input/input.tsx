import { cn } from "../utils/cn";
import { Platform, TextInput } from "react-native";
import { InputProps } from "./types";

const WEB_PLACEHOLDER_TEXT_COLOR_CLASS_NAME = "accent-muted-foreground/50";

function Input({
  className,
  autoFocusNative,
  disabled,
  placeholderClassName,
  unstyled = false,
  ...props
}: InputProps) {
  void placeholderClassName;
  const baseClassName = unstyled
    ? "text-foreground min-w-0 flex-row items-center outline-none"
    : "dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9";
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
            "selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm",
            !unstyled && "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            !unstyled && "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          ),
          native: "placeholder:text-muted-foreground/50",
        }),
        className,
      )}
      autoFocus={autoFocusNative ?? props.autoFocus}
      editable={disabled ? false : props.editable}
    />
  );
}

export { Input };
