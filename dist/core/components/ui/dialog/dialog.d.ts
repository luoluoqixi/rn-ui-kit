import * as DialogPrimitive from "@rn-primitives/dialog";
import * as React from "react";
import { View, type ViewProps } from "react-native";
import type { DialogContentProps, DialogProps } from "./types";
declare function DialogPortal({ hostName, ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>): React.JSX.Element;
declare function DialogRoot({ actionClassName, actionLabel, actionProps, actions, cancelClassName, cancelLabel, cancelProps, children, content, contentClassName, contentProps, defaultOpen, description, descriptionClassName, descriptionProps, footerClassName, headerClassName, onOpenChange, open, title, titleClassName, titleProps, trigger, triggerClassName, triggerProps, ...rootProps }: DialogProps): React.JSX.Element;
declare function DialogOverlay({ className, children, portalHost, onPress, ...props }: Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, "asChild"> & {
    children?: React.ReactNode;
    portalHost?: string;
}): React.JSX.Element;
declare function DialogContent({ className, portalHost, portalProps, overlayProps, children, onStartShouldSetResponder, style, ...props }: DialogContentProps): React.JSX.Element;
declare function DialogHeader({ className, ...props }: ViewProps): React.JSX.Element;
declare function DialogFooter({ className, ...props }: ViewProps): React.JSX.Element;
declare function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): React.JSX.Element;
declare function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): React.JSX.Element;
declare const Dialog: typeof DialogRoot & {
    Close: {
        ({ asChild, onPress: onPressProp, disabled, ref, ...props }: Omit<import("react-native").PressableProps & React.RefAttributes<View>, "ref"> & {
            asChild?: boolean;
        } & {
            onKeyDown?: (ev: React.KeyboardEvent) => void;
            onKeyUp?: (ev: React.KeyboardEvent) => void;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
    Content: typeof DialogContent;
    Description: typeof DialogDescription;
    Footer: typeof DialogFooter;
    Header: typeof DialogHeader;
    Overlay: typeof DialogOverlay;
    Portal: typeof DialogPortal;
    Root: typeof DialogRoot;
    Title: typeof DialogTitle;
    Trigger: {
        ({ asChild, onPress: onPressProp, disabled, ref, ...props }: Omit<import("react-native").PressableProps & React.RefAttributes<View>, "ref"> & {
            asChild?: boolean;
        } & {
            onKeyDown?: (ev: React.KeyboardEvent) => void;
            onKeyUp?: (ev: React.KeyboardEvent) => void;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
};
export { Dialog };
export type * from "./types";
