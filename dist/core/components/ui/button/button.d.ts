import * as React from "react";
import type { ButtonProps } from "./types";
declare const buttonVariants: (props?: ({
    variant?: "default" | "link" | "destructive" | "secondary" | "icon" | "outline" | "ghost" | null | undefined;
    size?: "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const buttonTextVariants: (props?: ({
    variant?: "default" | "link" | "destructive" | "secondary" | "icon" | "outline" | "ghost" | null | undefined;
    size?: "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const Button: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<import("react-native").View>>;
export { Button, buttonTextVariants, buttonVariants };
