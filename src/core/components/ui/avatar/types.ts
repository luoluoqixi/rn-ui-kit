import type { Avatar as NativeAvatar } from "heroui-native/avatar";
import type { Avatar as WebAvatar } from "@heroui/react/avatar";
import type { ComponentProps } from "react";
import type { RenderProp } from "../utils/render";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarVariant = "default" | "soft";
export type AvatarColor = "default" | "accent" | "success" | "warning" | "danger";
export type AvatarRenderContext = { alt: string; src?: string; size: AvatarSize; variant: AvatarVariant; color: AvatarColor };
type AvatarSlot<Native, Web> = {
  className?: string;
  herouiNativeProps?: Omit<Native, "children" | "className" | "asChild">;
  herouiWebProps?: Omit<Web, "children" | "className" | "asChild">;
};
export type AvatarImageProps = AvatarSlot<
  Extract<ComponentProps<typeof NativeAvatar.Image>, { asChild?: false }>,
  Omit<ComponentProps<typeof WebAvatar.Image>, "src" | "alt">
>;
export type AvatarFallbackProps = AvatarSlot<ComponentProps<typeof NativeAvatar.Fallback>, ComponentProps<typeof WebAvatar.Fallback>>;
export type AvatarProps = AvatarSlot<
  Omit<ComponentProps<typeof NativeAvatar>, "alt" | "size" | "variant" | "color">,
  Omit<ComponentProps<typeof WebAvatar>, "size" | "variant" | "color">
> & {
  alt?: string;
  src?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  color?: AvatarColor;
  /** undefined uses a person icon; null/false disables the fallback. */
  fallback?: RenderProp<AvatarRenderContext>;
  fallbackProps?: AvatarFallbackProps;
  fallbackClassName?: string;
  fallbackTextClassName?: string;
  imageProps?: AvatarImageProps;
  imageClassName?: string;
};
