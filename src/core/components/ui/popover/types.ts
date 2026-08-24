import type { ComponentProps, ReactNode } from "react";
import type * as PopoverPrimitive from "@rn-primitives/popover";

import type { RenderProp } from "../utils";

export type PopoverRenderContext = {
  open?: boolean;
};

export type PopoverContentProps = ComponentProps<
  typeof PopoverPrimitive.Content
> & {
  portalHost?: string;
};

export type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root> & {
  content?: RenderProp<PopoverRenderContext>;
  contentProps?: Omit<PopoverContentProps, "children">;
  triggerProps?: Omit<
    ComponentProps<typeof PopoverPrimitive.Trigger>,
    "children"
  >;
  children?: ReactNode;
};
