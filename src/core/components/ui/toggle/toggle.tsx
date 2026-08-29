import { Icon } from "../icon";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics, useUiTheme } from "../utils";
import * as TogglePrimitive from "@rn-primitives/toggle";
import { cva } from "class-variance-authority";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { resolveRenderProp } from "../utils/render";
import type { ToggleProps, ToggleSize } from "./types";

const toggleVariants = cva(
  cn(
    "group aria-[checked=false]:active:bg-accent/50 aria-[pressed=false]:active:bg-accent/50 data-[state=off]:active:bg-accent/50 flex flex-row items-center justify-center gap-2 rounded-md",
    Platform.select({
      web: "aria-[checked=false]:hover:bg-accent/50 aria-[pressed=false]:hover:bg-accent/50 data-[state=off]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex cursor-default whitespace-nowrap outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:pointer-events-none [&_svg]:pointer-events-none",
    }),
  ),
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: cn(
          "border-input border bg-transparent shadow-sm shadow-black/5",
          Platform.select({
            web: "aria-[checked=false]:hover:bg-accent/50 aria-[pressed=false]:hover:bg-accent/50 data-[state=off]:hover:bg-accent/50",
          }),
        ),
      },
      size: {
        "2xs": "h-8 min-w-8 gap-1 px-2 py-1",
        "xs": "h-9 min-w-9 gap-1 px-2.5 py-1.5",
        "sm": "h-10 min-w-10 gap-1.5 px-3 py-2",
        "md": "h-11 min-w-11 px-4 py-2.5",
        "lg": "h-12 min-w-12 px-5 py-2.5",
        "xl": "h-14 min-w-14 gap-2.5 px-6 py-3",
        "2xl": "h-16 min-w-16 gap-3 px-8 py-4",
        "default": "h-11 min-w-11 px-4 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const toggleTextVariants = cva("text-foreground font-medium", {
  variants: {
    size: {
      "2xs": "text-[10px]",
      "xs": "text-xs",
      "sm": "text-sm",
      "md": "text-base",
      "lg": "text-lg",
      "xl": "text-xl",
      "2xl": "text-2xl",
      "default": "text-base",
    },
  },
  defaultVariants: { size: "default" },
});

export const ToggleSizeContext = React.createContext<ToggleSize>("default");
const toggleIconSizes: Record<ToggleSize, string> = {
  "default": "size-4",
  "2xs": "size-3",
  "xs": "size-3.5",
  "sm": "size-4",
  "md": "size-4",
  "lg": "size-4",
  "xl": "size-5",
  "2xl": "size-6",
};

function Toggle({
  className,
  variant,
  size,
  nativeHaptics,
  title,
  children,
  onPressedChange,
  onPressIn,
  onPressOut,
  ...props
}: ToggleProps) {
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
    defaultEnabled: true,
  });
  const theme = useUiTheme();
  const [isPressed, setIsPressed] = React.useState(false);
  const resolvedStyle =
    typeof props.style === "function" ? props.style({ pressed: isPressed }) : props.style;
  const interactionStyle = StyleSheet.flatten([
    resolvedStyle,
    isPressed && !props.pressed && !props.disabled ? { backgroundColor: theme.accent } : undefined,
  ]);
  const resolvedChildren =
    resolveRenderProp(title, {
      disabled: props.disabled,
      pressed: props.pressed,
    }) ?? children;

  return (
    <TextClassContext.Provider
      value={cn(toggleTextVariants({ size }), props.pressed && "text-accent-foreground", className)}
    >
      <ToggleSizeContext.Provider value={size ?? "default"}>
        <TogglePrimitive.Root
          {...props}
          className={cn(
            toggleVariants({ variant, size }),
            props.disabled && "opacity-50",
            props.pressed && "bg-accent",
            className,
          )}
          style={interactionStyle}
          onPressedChange={(pressed) => {
            triggerNativeHaptics(resolvedNativeHaptics);
            onPressedChange?.(pressed);
          }}
          onPressIn={(event) => {
            setIsPressed(true);
            onPressIn?.(event);
          }}
          onPressOut={(event) => {
            setIsPressed(false);
            onPressOut?.(event);
          }}
        >
          {typeof resolvedChildren === "function"
            ? resolvedChildren
            : React.Children.map(resolvedChildren, (child) =>
                typeof child === "string" || typeof child === "number" ? (
                  <Text>{child}</Text>
                ) : (
                  child
                ),
              )}
        </TogglePrimitive.Root>
      </ToggleSizeContext.Provider>
    </TextClassContext.Provider>
  );
}

function ToggleIcon({ className, ...props }: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext);
  const size = React.useContext(ToggleSizeContext);
  return (
    <Icon className={cn(toggleIconSizes[size], "shrink-0", textClass, className)} {...props} />
  );
}

const ToggleComponent = Object.assign(Toggle, {
  Icon: ToggleIcon,
  Root: Toggle,
});

export { ToggleComponent as Toggle, toggleTextVariants, toggleVariants };
