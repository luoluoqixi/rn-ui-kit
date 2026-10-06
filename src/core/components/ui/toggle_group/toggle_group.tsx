import { Icon } from "../icon";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { ToggleSizeContext, toggleTextVariants, toggleVariants } from "../toggle";
import { cn } from "../utils/cn";
import {
  triggerNativeHaptics,
  useResolvedNativeHaptics,
  useUiTheme,
  type NativeHapticsSetting,
} from "../utils";
import { resolveRenderProp, type RenderProp } from "../utils/render";
import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import type { ToggleGroupItemData, ToggleGroupItemRenderContext, ToggleGroupProps } from "./types";

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  nativeHaptics: NativeHapticsSetting | undefined;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

function hasExplicitItemSizing(className: string | undefined, style: unknown) {
  const hasSizingClass = className
    ?.split(/\s+/)
    .some(
      (token) =>
        token.startsWith("w-") ||
        token.startsWith("basis-") ||
        token.startsWith("[width:") ||
        token.startsWith("[flex-basis:"),
    );
  if (hasSizingClass) return true;

  const flattenedStyle = StyleSheet.flatten(style as never) as
    | { width?: unknown; flexBasis?: unknown }
    | undefined;
  return flattenedStyle?.width != null || flattenedStyle?.flexBasis != null;
}

function ToggleGroup({
  className,
  variant,
  size,
  nativeHaptics,
  children,
  items,
  ...props
}: ToggleGroupProps) {
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
    defaultEnabled: true,
  });

  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        "flex flex-row items-center rounded-md shadow-none",
        Platform.select({ web: "w-fit" }),
        variant === "outline" && "shadow-sm shadow-black/5",
        className,
      )}
      {...(props as ToggleGroupPrimitive.RootProps)}
    >
      <ToggleGroupContext.Provider
        value={{ nativeHaptics: resolvedNativeHaptics, variant, size: size ?? "md" }}
      >
        {children ??
          items?.map((item, index) => (
            <ToggleGroupItem
              {...item.itemProps}
              key={item.value}
              value={item.value}
              disabled={item.disabled ?? item.itemProps?.disabled}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              title={item.title}
            >
              {item.children}
            </ToggleGroupItem>
          ))}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function useToggleGroupContext() {
  const context = React.useContext(ToggleGroupContext);
  if (context === null) {
    throw new Error(
      "ToggleGroup compound components cannot be rendered outside the ToggleGroup component",
    );
  }
  return context;
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  isFirst,
  isLast,
  nativeHaptics,
  title,
  onPress,
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants> & {
    isFirst?: boolean;
    isLast?: boolean;
    nativeHaptics?: NativeHapticsSetting;
    title?: RenderProp<ToggleGroupItemRenderContext>;
  }) {
  const context = useToggleGroupContext();
  const { value } = ToggleGroupPrimitive.useRootContext();
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics ?? context.nativeHaptics);
  const theme = useUiTheme();
  const pressed = ToggleGroupPrimitive.utils.getIsSelected(value, props.value);
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const resolvedStyle =
    typeof props.style === "function"
      ? props.style({ hovered: isHovered, pressed: isPressed })
      : props.style;
  const interactionStyle = StyleSheet.flatten([
    resolvedStyle,
    isPressed && !pressed && !props.disabled ? { backgroundColor: theme.accent } : undefined,
  ]);
  const hasCustomSizing = hasExplicitItemSizing(className, props.style);
  const renderedTitle = resolveRenderProp(title, {
    pressed,
    value: String(props.value ?? ""),
  });
  const resolvedSize = context.size || size || "md";

  return (
    <TextClassContext.Provider
      value={cn(toggleTextVariants({ size: resolvedSize }), pressed && "text-accent-foreground")}
    >
      <ToggleSizeContext.Provider value={resolvedSize === "default" ? "md" : resolvedSize}>
        <ToggleGroupPrimitive.Item
          {...props}
          className={cn(
            toggleVariants({
              variant: context.variant || variant,
              size: resolvedSize,
            }),
            props.disabled && "opacity-50",
            pressed && "bg-accent",
            "min-w-0 shrink-0 rounded-none shadow-none",
            isFirst && "rounded-l-md",
            isLast && "rounded-r-md",
            (context.variant === "outline" || variant === "outline") && "border-l-0",
            (context.variant === "outline" || variant === "outline") && isFirst && "border-l",
            Platform.select({
              web: cn("flex-1 focus:z-10 focus-visible:z-10", hasCustomSizing && "flex-none"),
            }),
            className,
          )}
          style={interactionStyle}
          onPress={(event) => {
            onPress?.(event);
            if (!event.defaultPrevented) triggerNativeHaptics(resolvedNativeHaptics);
          }}
          onPressIn={(event) => {
            setIsPressed(true);
            onPressIn?.(event);
          }}
          onPressOut={(event) => {
            setIsPressed(false);
            onPressOut?.(event);
          }}
          onHoverIn={(event) => {
            setIsHovered(true);
            onHoverIn?.(event);
          }}
          onHoverOut={(event) => {
            setIsHovered(false);
            onHoverOut?.(event);
          }}
        >
          {renderedTitle != null ? (
            typeof renderedTitle === "string" || typeof renderedTitle === "number" ? (
              <Text>{renderedTitle}</Text>
            ) : (
              renderedTitle
            )
          ) : typeof children === "function" ? (
            children
          ) : (
            React.Children.map(children, (child) =>
              typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
            )
          )}
        </ToggleGroupPrimitive.Item>
      </ToggleSizeContext.Provider>
    </TextClassContext.Provider>
  );
}

function ToggleGroupIcon({ className, ...props }: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext);
  return <Icon className={cn("size-4 shrink-0", textClass, className)} {...props} />;
}

const ToggleGroupComponent = Object.assign(ToggleGroup, {
  Icon: ToggleGroupIcon,
  Item: ToggleGroupItem,
  Root: ToggleGroup,
});

export { ToggleGroupComponent as ToggleGroup };
