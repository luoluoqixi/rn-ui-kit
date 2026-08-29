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
import type { ToggleProps } from "./types";

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
        default: "h-10 min-w-10 px-2.5 sm:h-9 sm:min-w-9 sm:px-2",
        sm: "h-9 min-w-9 px-2 sm:h-8 sm:min-w-8 sm:px-1.5",
        lg: "h-11 min-w-11 px-3 sm:h-10 sm:min-w-10 sm:px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

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
    isPressed && !props.pressed && !props.disabled
      ? { backgroundColor: theme.accent }
      : undefined,
  ]);
  const resolvedChildren =
    resolveRenderProp(title, {
      disabled: props.disabled,
      pressed: props.pressed,
    }) ?? children;

  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm text-foreground font-medium",
        props.pressed && "text-accent-foreground",
        className,
      )}
    >
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
              typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
            )}
      </TogglePrimitive.Root>
    </TextClassContext.Provider>
  );
}

function ToggleIcon({ className, ...props }: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext);
  return <Icon className={cn("size-4 shrink-0", textClass, className)} {...props} />;
}

const ToggleComponent = Object.assign(Toggle, {
  Icon: ToggleIcon,
  Root: Toggle,
});

export { ToggleComponent as Toggle, toggleVariants };
