import { closeOpenTooltips } from "tamagui";
import type { TooltipAnchorProps, TooltipArrowProps, TooltipContentProps, TooltipGroupProps, TooltipProps, TooltipRootProps, TooltipTriggerProps } from "./types";
declare function TooltipSimple(props: TooltipProps): import("react").JSX.Element;
declare function TooltipRootBase(props: TooltipRootProps): import("react").JSX.Element;
declare function TooltipAnchor(props: TooltipAnchorProps): import("react").JSX.Element;
declare function TooltipArrow(props: TooltipArrowProps): import("react").JSX.Element;
declare function TooltipTrigger(props: TooltipTriggerProps): import("react").JSX.Element;
declare function TooltipContent(props: TooltipContentProps): import("react").JSX.Element;
declare function TooltipGroup(props: TooltipGroupProps): import("react").JSX.Element;
declare const TooltipRoot: typeof TooltipRootBase & {
    Anchor: typeof TooltipAnchor;
    Arrow: typeof TooltipArrow;
    Trigger: typeof TooltipTrigger;
    Content: typeof TooltipContent;
    Group: typeof TooltipGroup;
};
export declare const Tooltip: typeof TooltipSimple & {
    Root: typeof TooltipRootBase & {
        Anchor: typeof TooltipAnchor;
        Arrow: typeof TooltipArrow;
        Trigger: typeof TooltipTrigger;
        Content: typeof TooltipContent;
        Group: typeof TooltipGroup;
    };
};
export { closeOpenTooltips, TooltipGroup, TooltipRoot };
