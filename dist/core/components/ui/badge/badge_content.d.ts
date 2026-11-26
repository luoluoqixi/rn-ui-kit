import type { BadgeProps } from "./types";
export declare const badgeTextSizes: {
    sm: string;
    md: string;
    lg: string;
};
export declare function resolveBadgeContent(props: BadgeProps): {
    content: import("react").ReactNode;
    textClass: string;
    size: import("./types").BadgeSize;
    variant: import("./types").BadgeVariant;
    color: import("./types").BadgeColor;
    placement: import("./types").BadgePlacement;
};
