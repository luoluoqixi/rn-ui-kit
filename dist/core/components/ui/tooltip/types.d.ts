import type { ComponentProps, ReactNode } from "react";
import type { Tooltip } from "@heroui/react/tooltip";
import type { RenderProp } from "../utils/render";
import type { OverlayStateProps } from "../utils/overlay/overlay_state";
export type TooltipRenderContext = {
    open: boolean;
};
export type TooltipContentProps = {
    className?: string;
    side?: "top" | "bottom" | "left" | "right";
    sideOffset?: number;
    herouiWebProps?: Omit<ComponentProps<typeof Tooltip.Content>, "children" | "isOpen" | "onOpenChange">;
};
export type TooltipProps = OverlayStateProps & {
    children?: ReactNode;
    content?: RenderProp<TooltipRenderContext>;
    contentProps?: TooltipContentProps;
    delay?: number;
    closeDelay?: number;
    isDisabled?: boolean;
    showArrow?: boolean;
    herouiWebProps?: Omit<ComponentProps<typeof Tooltip>, "children" | "isOpen" | "defaultOpen" | "onOpenChange">;
};
