import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from "./types";
declare function Avatar({ alt, children, fallback, fallbackClassName, fallbackProps, imageClassName, imageProps, src, className, ...props }: AvatarProps): import("react").JSX.Element;
declare function AvatarImage({ className, ...props }: AvatarImageProps): import("react").JSX.Element;
declare function AvatarFallback({ className, ...props }: AvatarFallbackProps): import("react").JSX.Element;
declare const AvatarComponent: typeof Avatar & {
    Fallback: typeof AvatarFallback;
    Image: typeof AvatarImage;
    Root: typeof Avatar;
};
export { AvatarComponent as Avatar };
