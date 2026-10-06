import type { ComponentProps, ReactNode } from "react";
import type * as DialogPrimitive from "@rn-primitives/dialog";
import type { ViewProps } from "react-native";

import type { ButtonProps } from "../button";
import type { RenderProp } from "../utils";

export type DialogRenderContext = {
  open: boolean;
};

export type DialogTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;
export type DialogPortalProps = Omit<ComponentProps<typeof DialogPrimitive.Portal>, "children">;
export type DialogOverlayProps = ComponentProps<typeof DialogPrimitive.Overlay>;
export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string;
  portalProps?: DialogPortalProps;
  overlayProps?: DialogOverlayProps;
};
export type DialogHeaderProps = ViewProps;
export type DialogFooterProps = ViewProps;
export type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;
export type DialogDescriptionProps = ComponentProps<typeof DialogPrimitive.Description>;

export type DialogProps = ComponentProps<typeof DialogPrimitive.Root> & {
  actionLabel?: RenderProp<DialogRenderContext>;
  actionProps?: ButtonProps;
  actionClassName?: string;
  actions?: RenderProp<DialogRenderContext>;
  cancelLabel?: RenderProp<DialogRenderContext>;
  cancelProps?: ButtonProps;
  cancelClassName?: string;
  children?: ReactNode;
  content?: RenderProp<DialogRenderContext>;
  contentClassName?: string;
  contentProps?: DialogContentProps;
  description?: RenderProp<DialogRenderContext>;
  descriptionClassName?: string;
  descriptionProps?: DialogDescriptionProps;
  footerClassName?: string;
  headerClassName?: string;
  title?: RenderProp<DialogRenderContext>;
  titleClassName?: string;
  titleProps?: DialogTitleProps;
  trigger?: RenderProp<DialogRenderContext>;
  triggerClassName?: string;
  triggerProps?: Omit<DialogTriggerProps, "children" | "asChild">;
};
