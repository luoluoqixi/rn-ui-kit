import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import type { TooltipProps } from "./types";
import { TooltipRoot } from "./tooltip_trigger";
declare function TooltipRootComponent({ children, content, contentProps, openOnPress, size, triggerProps, ...props }: TooltipProps): React.JSX.Element;
declare function TooltipContent({ className, children, sideOffset, portalHost, side, size: sizeProp, style, ...props }: import("./types").TooltipContentProps): React.JSX.Element;
declare const Tooltip: typeof TooltipRootComponent & {
    Content: typeof TooltipContent;
    Overlay: {
        ({ asChild, forceMount, onPress: OnPressProp, closeOnPress, ref, ...props }: import("@rn-primitives/types").ForceMountable & Omit<import("react-native").PressableProps & React.RefAttributes<import("react-native").View>, "ref"> & {
            asChild?: boolean;
        } & {
            onKeyDown?: (ev: React.KeyboardEvent) => void;
            onKeyUp?: (ev: React.KeyboardEvent) => void;
        } & {
            closeOnPress?: boolean;
        } & React.RefAttributes<import("react-native").View>): React.JSX.Element | null;
        displayName: string;
    };
    Portal: ({ hostName, ...props }: React.ComponentProps<typeof TooltipPrimitive.Portal>) => React.JSX.Element;
    Root: typeof TooltipRoot;
    Trigger: React.ForwardRefExoticComponent<Omit<Omit<import("react-native").PressableProps & React.RefAttributes<import("react-native").View>, "ref"> & {
        asChild?: boolean;
    } & {
        onKeyDown?: (ev: React.KeyboardEvent) => void;
        onKeyUp?: (ev: React.KeyboardEvent) => void;
    } & React.RefAttributes<import("@rn-primitives/tooltip").TriggerRef>, "ref"> & React.RefAttributes<import("@rn-primitives/tooltip").TriggerRef>>;
};
export { Tooltip };
