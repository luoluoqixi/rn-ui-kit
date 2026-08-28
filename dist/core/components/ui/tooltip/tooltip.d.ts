import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import type { TooltipProps } from "./types";
declare function TooltipRootComponent({ children, content, contentProps, triggerProps, ...props }: TooltipProps): React.JSX.Element;
declare function TooltipContent({ className, children, sideOffset, portalHost, side, style, ...props }: import("./types").TooltipContentProps): React.JSX.Element;
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
    Root: {
        ({ asChild, delayDuration: _delayDuration, skipDelayDuration: _skipDelayDuration, disableHoverableContent: _disableHoverableContent, onOpenChange: onOpenChangeProp, ref, ...viewProps }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & {
            onOpenChange?: (open: boolean) => void;
            delayDuration?: number;
            skipDelayDuration?: number;
            disableHoverableContent?: boolean;
        } & React.RefAttributes<import("react-native").View>): React.JSX.Element;
        displayName: string;
    };
    Trigger: {
        ({ asChild, onPress: onPressProp, disabled, ref, ...props }: Omit<import("react-native").PressableProps & React.RefAttributes<import("react-native").View>, "ref"> & {
            asChild?: boolean;
        } & {
            onKeyDown?: (ev: React.KeyboardEvent) => void;
            onKeyUp?: (ev: React.KeyboardEvent) => void;
        } & React.RefAttributes<import("@rn-primitives/tooltip").TriggerRef>): React.JSX.Element;
        displayName: string;
    };
};
export { Tooltip };
