import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { Text } from "../text";
import * as AvatarPrimitive from "@rn-primitives/avatar";
import { Children } from "react";

import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from "./types";

function normalizeAvatarChildren(children: React.ReactNode) {
  return Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
  );
}

function Avatar({
  alt,
  children,
  fallback,
  fallbackClassName,
  fallbackProps,
  imageClassName,
  imageProps,
  src,
  className,
  ...props
}: AvatarProps) {
  const hasFallback = fallback != null || fallbackProps != null || src != null;
  const renderedFallback = resolveRenderProp(fallback, { alt, src });

  return (
    <AvatarPrimitive.Root
      alt={alt ?? ""}
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {children ?? (
        <>
          {src != null ? (
            <AvatarImage
              {...imageProps}
              className={cn(imageClassName, imageProps?.className)}
              source={{ uri: src }}
            />
          ) : null}
          {hasFallback ? (
            <AvatarFallback
              {...fallbackProps}
              className={cn(fallbackClassName, fallbackProps?.className)}
            >
              {renderedFallback}
            </AvatarFallback>
          ) : null}
        </>
      )}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return <AvatarPrimitive.Image className={cn("aspect-square size-full", className)} {...props} />;
}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "bg-muted flex size-full flex-row items-center justify-center rounded-full",
        className,
      )}
      {...props}
    >
      {normalizeAvatarChildren(props.children)}
    </AvatarPrimitive.Fallback>
  );
}

const AvatarComponent = Object.assign(Avatar, {
  Fallback: AvatarFallback,
  Image: AvatarImage,
  Root: Avatar,
});

export { AvatarComponent as Avatar };
