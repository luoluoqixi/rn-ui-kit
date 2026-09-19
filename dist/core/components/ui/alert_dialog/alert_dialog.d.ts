import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import * as React from "react";
import { View, type ViewProps } from "react-native";
import type { AlertDialogActionProps, AlertDialogCancelProps, AlertDialogContentProps, AlertDialogDestructiveProps, AlertDialogDescriptionProps, AlertDialogOverlayProps, AlertDialogProps, AlertDialogTitleProps } from "./types";
declare function AlertDialogPortal({ hostName, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>): React.JSX.Element;
declare function AlertDialogRoot({ actionAriaLabel, actionLabel, actionClassName, actionProps, actions, cancelAriaLabel, cancelLabel, cancelClassName, cancelProps, children, contentClassName, contentProps, dismissOnBackPress, dismissOnOverlayPress, disableRemoveScroll, description, descriptionClassName, descriptionProps, destructiveAriaLabel, destructiveLabel, destructiveClassName, destructiveProps, footerClassName, headerClassName, overlayProps, portalProps, title, titleClassName, titleProps, trigger, triggerClassName, triggerProps, ...rootProps }: AlertDialogProps): React.JSX.Element;
declare function AlertDialogOverlay({ className, children, dismissOnOverlayPress, portalHost, onPress, ...props }: Omit<AlertDialogOverlayProps, "asChild"> & {
    children?: React.ReactNode;
    portalHost?: string;
}): React.JSX.Element;
declare function AlertDialogContent({ className, portalHost, portalProps, overlayProps, ...props }: AlertDialogContentProps): React.JSX.Element;
declare function AlertDialogHeader({ className, ...props }: ViewProps): React.JSX.Element;
declare function AlertDialogFooter({ className, ...props }: ViewProps): React.JSX.Element;
declare function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps): React.JSX.Element;
declare function AlertDialogDescription({ className, ...props }: AlertDialogDescriptionProps): React.JSX.Element;
declare function AlertDialogAction({ className, ...props }: AlertDialogActionProps): React.JSX.Element;
declare function AlertDialogCancel({ className, ...props }: AlertDialogCancelProps): React.JSX.Element;
declare function AlertDialogDestructive({ className, ...props }: AlertDialogDestructiveProps): React.JSX.Element;
declare const AlertDialog: typeof AlertDialogRoot & {
    Action: typeof AlertDialogAction;
    Cancel: typeof AlertDialogCancel;
    Content: typeof AlertDialogContent;
    Description: typeof AlertDialogDescription;
    Destructive: typeof AlertDialogDestructive;
    Footer: typeof AlertDialogFooter;
    Header: typeof AlertDialogHeader;
    Overlay: typeof AlertDialogOverlay;
    Portal: typeof AlertDialogPortal;
    Root: typeof AlertDialogRoot;
    Title: typeof AlertDialogTitle;
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
export { AlertDialog };
