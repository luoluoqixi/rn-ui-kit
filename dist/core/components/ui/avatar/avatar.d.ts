import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from "./types";
export declare const avatarVariants: (props?: ({
    size?: "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Avatar({ alt, children, fallback, fallbackClassName, fallbackProps, imageClassName, imageProps, src, size, className, ...props }: AvatarProps): import("react").JSX.Element;
declare function AvatarImage({ className, ...props }: AvatarImageProps): import("react").JSX.Element;
declare function AvatarFallback({ className, ...props }: AvatarFallbackProps): import("react").JSX.Element;
declare const AvatarComponent: typeof Avatar & {
    Fallback: typeof AvatarFallback;
    Image: typeof AvatarImage;
    Root: typeof Avatar;
};
export { AvatarComponent as Avatar };
