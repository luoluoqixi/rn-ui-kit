import type { DialogCloseProps, DialogContentProps, DialogDescriptionProps, DialogOverlayProps, DialogPortalProps, DialogProps, DialogTitleProps, DialogTriggerProps } from "./types";
type DialogOverlayBehaviorProps = DialogOverlayProps & {
    dismissOnOverlayPress?: boolean;
};
type DialogContentBehaviorProps = DialogContentProps & {
    dismissOnOverlayPress?: boolean;
};
declare function DialogRoot(props: DialogProps): import("react").JSX.Element;
declare function DialogTrigger(props: DialogTriggerProps): import("react").JSX.Element;
declare function DialogPortal(props: DialogPortalProps): import("react").JSX.Element;
declare function DialogOverlay(props: DialogOverlayBehaviorProps): import("react").JSX.Element | null;
declare function DialogContent(props: DialogContentBehaviorProps): import("react").JSX.Element;
declare function DialogTitle(props: DialogTitleProps): import("react").JSX.Element;
declare function DialogDescription(props: DialogDescriptionProps): import("react").JSX.Element;
declare function DialogClose(props: DialogCloseProps): import("react").JSX.Element;
export declare const Dialog: typeof DialogRoot & {
    Trigger: typeof DialogTrigger;
    Portal: typeof DialogPortal;
    Overlay: typeof DialogOverlay;
    Content: typeof DialogContent;
    Title: typeof DialogTitle;
    Description: typeof DialogDescription;
    Close: typeof DialogClose;
};
export {};
