import type { ComponentProps } from "react";
import type * as AvatarPrimitive from "@rn-primitives/avatar";
import type { RenderProp } from "../utils";
import type { VariantProps } from "class-variance-authority";
import type { avatarVariants } from "./avatar";
export type AvatarRenderContext = {
    alt?: string;
    src?: string;
    size?: "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | null;
};
export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;
export type AvatarFallbackProps = ComponentProps<typeof AvatarPrimitive.Fallback>;
export type AvatarProps = Omit<ComponentProps<typeof AvatarPrimitive.Root>, "alt"> & VariantProps<typeof avatarVariants> & {
    alt?: string;
    fallback?: RenderProp<AvatarRenderContext>;
    fallbackClassName?: string;
    fallbackProps?: AvatarFallbackProps;
    imageClassName?: string;
    imageProps?: AvatarImageProps;
    src?: string;
};
