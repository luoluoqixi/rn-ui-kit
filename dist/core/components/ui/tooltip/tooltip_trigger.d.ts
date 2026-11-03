import * as React from "react";
import type { TooltipRootProps } from "./types";
declare function TooltipRoot({ children, openOnPress, openOnFocus, onOpenChange, ...props }: TooltipRootProps): React.JSX.Element;
declare const TooltipTrigger: React.ForwardRefExoticComponent<Omit<Omit<import("react-native").PressableProps & React.RefAttributes<import("react-native").View>, "ref"> & {
    asChild?: boolean;
} & {
    onKeyDown?: (ev: React.KeyboardEvent) => void;
    onKeyUp?: (ev: React.KeyboardEvent) => void;
} & React.RefAttributes<import("@rn-primitives/tooltip").TriggerRef>, "ref"> & React.RefAttributes<import("@rn-primitives/tooltip").TriggerRef>>;
export { TooltipRoot, TooltipTrigger };
