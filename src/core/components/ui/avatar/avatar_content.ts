import { resolveRenderProp } from "../utils/render";
import type { AvatarProps, AvatarRenderContext } from "./types";

export const avatarFallbackText = {
  default: "text-default-soft-foreground", accent: "text-accent-soft-foreground",
  success: "text-success-soft-foreground", warning: "text-warning-soft-foreground", danger: "text-danger-soft-foreground",
};
export const avatarFallbackSize = { sm: "text-xs", md: "text-sm", lg: "text-base" };
export function resolveAvatarContent(props: AvatarProps) {
  const context: AvatarRenderContext = {
    alt: props.alt ?? "头像", src: props.src, size: props.size ?? "md",
    variant: props.variant ?? "default", color: props.color ?? "accent",
  };
  const fallback = resolveRenderProp(props.fallback, context);
  return { ...context, fallback, showFallback: fallback !== null && typeof fallback !== "boolean" };
}
