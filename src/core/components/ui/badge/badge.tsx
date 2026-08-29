import { TextClassContext } from "../text";
import { Text } from "../text";
import { Icon } from "../icon";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { Slot } from "@rn-primitives/slot";
import { cva } from "class-variance-authority";
import * as React from "react";
import { Platform, View } from "react-native";

import type { BadgeProps } from "./types";

const badgeVariants = cva(
  cn(
    "border-border group shrink-0 flex-row items-center justify-center overflow-hidden rounded-full border",
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-fit whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary border-transparent",
          Platform.select({ web: "[a&]:hover:bg-primary/90" }),
        ),
        secondary: cn(
          "bg-secondary border-transparent",
          Platform.select({ web: "[a&]:hover:bg-secondary/90" }),
        ),
        destructive: cn(
          "bg-destructive border-transparent",
          Platform.select({ web: "[a&]:hover:bg-destructive/90" }),
        ),
        outline: Platform.select({
          web: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        }),
      },
      size: {
        "2xs": "h-5 gap-0.5 px-1.5",
        xs: "h-6 gap-1 px-2",
        sm: "h-7 gap-1 px-2.5",
        md: "h-8 gap-1.5 px-3",
        lg: "h-9 gap-1.5 px-3.5",
        xl: "h-10 gap-2 px-4",
        "2xl": "h-12 gap-2.5 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

const badgeTextVariants = cva("font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-white",
      outline: "text-foreground",
    },
    size: {
      "2xs": "text-[10px]",
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
});

function normalizeBadgeChildren(
  children: React.ReactNode,
  className?: string,
  props?: React.ComponentProps<typeof Text>,
) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <Text {...props} className={className}>
        {child}
      </Text>
    ) : (
      child
    ),
  );
}

function Badge({
  className,
  icon,
  iconClassName,
  iconProps,
  label,
  labelClassName,
  labelProps,
  size,
  variant,
  asChild,
  children,
  ...props
}: BadgeProps) {
  const Component = asChild ? Slot : View;
  const renderedLabel = resolveRenderProp(label, { icon, size, variant });
  const content = children ?? (
    <>
      {icon ? (
        <Icon
          as={icon}
          {...iconProps}
          className={cn(
            {
              "size-2.5": size === "2xs",
              "size-3": size === "xs" || size === "sm" || size == null,
              "size-3.5": size === "md",
              "size-4": size === "lg",
              "size-5": size === "xl",
              "size-6": size === "2xl",
            },
            iconClassName,
            iconProps?.className,
          )}
        />
      ) : null}
      {renderedLabel != null
        ? normalizeBadgeChildren(
            renderedLabel,
            cn(labelClassName, labelProps?.className),
            labelProps,
          )
        : null}
    </>
  );
  return (
    <TextClassContext.Provider value={badgeTextVariants({ size, variant })}>
      <Component className={cn(badgeVariants({ size, variant }), className)} {...props}>
        {content}
      </Component>
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
