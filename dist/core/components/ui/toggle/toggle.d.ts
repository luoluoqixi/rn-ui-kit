import { Icon } from "../icon";
import * as React from "react";
import type { ToggleProps } from "./types";
declare const toggleVariants: (props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Toggle({ className, variant, size, nativeHaptics, title, children, onPressedChange, ...props }: ToggleProps): React.JSX.Element;
declare function ToggleIcon({ className, ...props }: React.ComponentProps<typeof Icon>): React.JSX.Element;
declare const ToggleComponent: typeof Toggle & {
    Icon: typeof ToggleIcon;
    Root: typeof Toggle;
};
export { ToggleComponent as Toggle, toggleVariants };
