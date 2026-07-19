import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from "./types";
declare function AvatarRoot(props: AvatarProps): import("react").JSX.Element;
declare function AvatarImage(props: AvatarImageProps): import("react").JSX.Element;
declare function AvatarFallback(props: AvatarFallbackProps): import("react").JSX.Element;
export declare const Avatar: typeof AvatarRoot & {
    Image: typeof AvatarImage;
    Fallback: typeof AvatarFallback;
};
export {};
