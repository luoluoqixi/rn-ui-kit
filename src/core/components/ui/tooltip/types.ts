import type { ComponentProps, ReactNode } from "react";
import type * as TooltipPrimitive from "@rn-primitives/tooltip";

import type { RenderProp } from "../utils";

export type TooltipRenderContext = {
  open?: boolean;
};

export type TooltipContentProps = ComponentProps<typeof TooltipPrimitive.Content> & {
  portalHost?: string;
};

export type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root> & {
  content?: RenderProp<TooltipRenderContext>;
  contentProps?: Omit<TooltipContentProps, "children">;
  triggerProps?: Omit<ComponentProps<typeof TooltipPrimitive.Trigger>, "children">;
  children?: ReactNode;
};
