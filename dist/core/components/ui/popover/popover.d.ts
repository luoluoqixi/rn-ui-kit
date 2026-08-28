import * as React from "react";
import type { PopoverProps } from "./types";
declare function PopoverRootComponent({ children, content, contentProps, triggerProps, ...props }: PopoverProps): React.JSX.Element;
declare function PopoverContent({ className, align, sideOffset, portalHost, style, ...props }: import("./types").PopoverContentProps): React.JSX.Element;
declare const PopoverComponent: typeof PopoverRootComponent & {
    Content: typeof PopoverContent;
    Root: {
        ({ asChild, onOpenChange: onOpenChangeProp, ref, ...viewProps }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & {
            onOpenChange?: (open: boolean) => void;
        } & React.RefAttributes<import("react-native").View>): React.JSX.Element;
        displayName: string;
    };
    Trigger: {
        ({ asChild, onPress: onPressProp, disabled, ref, ...props }: Omit<import("react-native").PressableProps & React.RefAttributes<import("react-native").View>, "ref"> & {
            asChild?: boolean;
        } & {
            onKeyDown?: (ev: React.KeyboardEvent) => void;
            onKeyUp?: (ev: React.KeyboardEvent) => void;
        } & React.RefAttributes<import("@rn-primitives/popover").TriggerRef>): React.JSX.Element;
        displayName: string;
    };
};
export { PopoverComponent as Popover };
