import * as React from "react";
import type { BadgeProps } from "./types";
declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "secondary" | "outline" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const badgeTextVariants: (props?: ({
    variant?: "default" | "destructive" | "secondary" | "outline" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Badge({ className, icon, iconClassName, iconProps, label, labelClassName, labelProps, variant, asChild, children, ...props }: BadgeProps): React.JSX.Element;
export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
