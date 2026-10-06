import * as React from "react";
import type { BadgeProps } from "./types";
declare const badgeVariants: (props?: ({
    variant?: "default" | "secondary" | "outline" | "destructive" | null | undefined;
    size?: "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const badgeTextVariants: (props?: ({
    variant?: "default" | "secondary" | "outline" | "destructive" | null | undefined;
    size?: "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Badge({ className, icon, iconClassName, iconProps, label, labelClassName, labelProps, size, variant, asChild, children, ...props }: BadgeProps): React.JSX.Element;
export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
