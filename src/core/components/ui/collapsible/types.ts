import type { ComponentProps, ReactNode } from "react";
import type * as CollapsiblePrimitive from "@rn-primitives/collapsible";

import type { ButtonProps } from "../button";
import type { NativeHapticsSetting, RenderProp } from "../utils";

export type CollapsibleRenderContext = {
  disabled: boolean;
  open: boolean;
};

export type CollapsibleTriggerProps = ComponentProps<typeof CollapsiblePrimitive.Trigger>;
export type CollapsibleContentProps = ComponentProps<typeof CollapsiblePrimitive.Content>;

export type CollapsibleProps = Omit<
  ComponentProps<typeof CollapsiblePrimitive.Root>,
  "children"
> & {
  children?: ReactNode;
  content?: RenderProp<CollapsibleRenderContext>;
  contentClassName?: string;
  contentProps?: Omit<CollapsibleContentProps, "children">;
  nativeHaptics?: NativeHapticsSetting;
  title?: RenderProp<CollapsibleRenderContext>;
  titleClassName?: string;
  trigger?: RenderProp<CollapsibleRenderContext>;
  triggerButtonProps?: ButtonProps;
  triggerClassName?: string;
  triggerProps?: Omit<CollapsibleTriggerProps, "children" | "asChild">;
};
