import type { PopoverAnchorProps, PopoverArrowProps, PopoverCloseProps, PopoverContentProps, PopoverProps, PopoverTriggerProps } from "./types";
declare function PopoverRoot(props: PopoverProps): import("react").JSX.Element;
declare function PopoverAnchor(props: PopoverAnchorProps): import("react").JSX.Element;
declare function PopoverArrow(props: PopoverArrowProps): import("react").JSX.Element;
declare function PopoverTrigger(props: PopoverTriggerProps): import("react").JSX.Element;
declare function PopoverContent(props: PopoverContentProps): import("react").JSX.Element;
declare function PopoverClose(props: PopoverCloseProps): import("react").JSX.Element;
export declare const Popover: typeof PopoverRoot & {
    Anchor: typeof PopoverAnchor;
    Arrow: typeof PopoverArrow;
    Trigger: typeof PopoverTrigger;
    Content: typeof PopoverContent;
    Close: typeof PopoverClose;
};
export {};
