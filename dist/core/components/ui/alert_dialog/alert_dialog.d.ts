import { type OutsideInteractionEvent } from "../dialog/dialog_outside_interaction";
import type { AlertDialogActionProps, AlertDialogCancelProps, AlertDialogContentProps, AlertDialogDescriptionProps, AlertDialogDestructiveProps, AlertDialogOverlayProps, AlertDialogPortalProps, AlertDialogProps, AlertDialogTitleProps, AlertDialogTriggerProps } from "./types";
type AlertDialogOverlayBehaviorProps = AlertDialogOverlayProps & {
    dismissOnOverlayPress?: boolean;
};
type AlertDialogContentBaseProps = AlertDialogContentProps & {
    dismissOnBackPress?: boolean;
    dismissOnOverlayPress?: boolean;
    onInteractOutside?: (event: OutsideInteractionEvent) => void;
    onPointerDownOutside?: (event: OutsideInteractionEvent) => void;
};
declare function AlertDialogRoot(props: AlertDialogProps): import("react").JSX.Element;
declare function AlertDialogTrigger(props: AlertDialogTriggerProps): import("react").JSX.Element;
declare function AlertDialogPortal(props: AlertDialogPortalProps): import("react").JSX.Element;
declare function AlertDialogOverlay(props: AlertDialogOverlayBehaviorProps): import("react").JSX.Element | null;
declare function AlertDialogContent(props: AlertDialogContentBaseProps): import("react").JSX.Element;
declare function AlertDialogAction(props: AlertDialogActionProps): import("react").JSX.Element;
declare function AlertDialogCancel(props: AlertDialogCancelProps): import("react").JSX.Element;
declare function AlertDialogDestructive(props: AlertDialogDestructiveProps): import("react").JSX.Element;
declare function AlertDialogTitle(props: AlertDialogTitleProps): import("react").JSX.Element;
declare function AlertDialogDescription(props: AlertDialogDescriptionProps): import("react").JSX.Element;
export declare const AlertDialog: typeof AlertDialogRoot & {
    Trigger: typeof AlertDialogTrigger;
    Portal: typeof AlertDialogPortal;
    Overlay: typeof AlertDialogOverlay;
    Content: typeof AlertDialogContent;
    Action: typeof AlertDialogAction;
    Cancel: typeof AlertDialogCancel;
    Destructive: typeof AlertDialogDestructive;
    Title: typeof AlertDialogTitle;
    Description: typeof AlertDialogDescription;
};
export {};
