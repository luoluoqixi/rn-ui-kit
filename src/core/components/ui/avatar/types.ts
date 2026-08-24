import type { ComponentProps } from "react";
import type * as AvatarPrimitive from "@rn-primitives/avatar";
import type { RenderProp } from "../utils";

export type AvatarRenderContext = {
  alt?: string;
  src?: string;
};

export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;
export type AvatarFallbackProps = ComponentProps<typeof AvatarPrimitive.Fallback>;

export type AvatarProps = Omit<ComponentProps<typeof AvatarPrimitive.Root>, "alt"> & {
  alt?: string;
  fallback?: RenderProp<AvatarRenderContext>;
  fallbackClassName?: string;
  fallbackProps?: AvatarFallbackProps;
  imageClassName?: string;
  imageProps?: AvatarImageProps;
  src?: string;
};
