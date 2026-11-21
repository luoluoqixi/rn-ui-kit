import { Children, type ReactNode } from "react";
import type { ButtonProps, ButtonVariant } from "./types";

const foreground: Record<ButtonVariant, string> = {
  primary: "text-accent-foreground",
  secondary: "text-accent-soft-foreground",
  tertiary: "text-default-foreground",
  outline: "text-default-foreground",
  ghost: "text-default-foreground",
  danger: "text-danger-foreground",
  "danger-soft": "text-danger-soft-foreground",
};

/** Only supply context to library Text / Icon; HeroUI still owns the button surface. */
export function buttonTextClass(variant: ButtonVariant, size: ButtonProps["size"], native = false) {
  return ["font-medium", foreground[variant], native
    ? size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
    : size === "lg" ? "text-base" : "text-sm"].join(" ");
}

export function buttonChildren(children: ReactNode, label: (value: string | number) => ReactNode) {
  return Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? label(child) : child,
  );
}

export function buttonDimensions(size: ButtonProps["buttonSize"]) {
  return size == null ? undefined : {
    ...(size.width == null ? {} : { width: size.width }),
    ...(size.height == null ? {} : { height: size.height }),
  };
}
