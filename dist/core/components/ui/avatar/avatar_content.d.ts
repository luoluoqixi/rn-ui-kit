import type { AvatarProps } from "./types";
export declare const avatarFallbackText: {
    default: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
};
export declare const avatarFallbackSize: {
    sm: string;
    md: string;
    lg: string;
};
export declare function resolveAvatarContent(props: AvatarProps): {
    fallback: import("react").ReactNode;
    showFallback: boolean;
    alt: string;
    src?: string;
    size: import("./types").AvatarSize;
    variant: import("./types").AvatarVariant;
    color: import("./types").AvatarColor;
};
