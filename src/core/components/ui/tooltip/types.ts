import type { ComponentProps, ReactNode } from "react";
import type * as TooltipPrimitive from "@rn-primitives/tooltip";

import type { RenderProp } from "../utils";

export type TooltipSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type TooltipRenderContext = {
  open?: boolean;
};

export type TooltipContentProps = ComponentProps<typeof TooltipPrimitive.Content> & {
  portalHost?: string;
  size?: TooltipSize;
};

export type TooltipRootProps = ComponentProps<typeof TooltipPrimitive.Root> & {
  /** Allow pressing the trigger to open the tooltip. Disabled by default. */
  openOnPress?: boolean;
};

export type TooltipProps = TooltipRootProps & {
  content?: RenderProp<TooltipRenderContext>;
  contentProps?: Omit<TooltipContentProps, "children">;
  triggerProps?: Omit<ComponentProps<typeof TooltipPrimitive.Trigger>, "children">;
  children?: ReactNode;
  size?: TooltipSize;
};
