import { Icon } from "../icon";
import * as React from "react";
import type { ToggleProps, ToggleSize } from "./types";
declare const toggleVariants: (props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const toggleTextVariants: (props?: ({
    size?: "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare const ToggleSizeContext: React.Context<ToggleSize>;
declare function Toggle({ className, variant, size, nativeHaptics, title, children, onPressedChange, onPressIn, onPressOut, ...props }: ToggleProps): React.JSX.Element;
declare function ToggleIcon({ className, ...props }: React.ComponentProps<typeof Icon>): React.JSX.Element;
declare const ToggleComponent: typeof Toggle & {
    Icon: typeof ToggleIcon;
    Root: typeof Toggle;
};
export { ToggleComponent as Toggle, toggleTextVariants, toggleVariants };
