import type { ComponentProps } from "react";
import type * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import type { GestureResponderEvent } from "react-native";
import type { RenderProp } from "../utils";

export type AlertDialogTriggerProps = ComponentProps<typeof AlertDialogPrimitive.Trigger>;
export type AlertDialogPortalProps = Omit<
  ComponentProps<typeof AlertDialogPrimitive.Portal>,
  "children"
>;
export type AlertDialogOverlayProps = ComponentProps<typeof AlertDialogPrimitive.Overlay> & {
  dismissOnOverlayPress?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};
export type AlertDialogContentProps = ComponentProps<typeof AlertDialogPrimitive.Content> & {
  overlayProps?: AlertDialogOverlayProps;
  portalHost?: string;
  portalProps?: AlertDialogPortalProps;
};
export type AlertDialogActionProps = ComponentProps<typeof AlertDialogPrimitive.Action>;
export type AlertDialogCancelProps = ComponentProps<typeof AlertDialogPrimitive.Cancel>;
export type AlertDialogDestructiveProps = AlertDialogActionProps;
export type AlertDialogTitleProps = ComponentProps<typeof AlertDialogPrimitive.Title>;
export type AlertDialogDescriptionProps = ComponentProps<typeof AlertDialogPrimitive.Description>;

export type AlertDialogRenderContext = {
  open?: boolean;
};

export type AlertDialogProps = ComponentProps<typeof AlertDialogPrimitive.Root> & {
  actionAriaLabel?: string;
  actionLabel?: RenderProp<AlertDialogRenderContext>;
  actionProps?: AlertDialogActionProps;
  actionClassName?: string;
  actions?: RenderProp<AlertDialogRenderContext>;
  cancelAriaLabel?: string;
  cancelLabel?: RenderProp<AlertDialogRenderContext>;
  cancelProps?: AlertDialogCancelProps;
  cancelClassName?: string;
  contentClassName?: string;
  contentProps?: AlertDialogContentProps;
  dismissOnBackPress?: boolean;
  dismissOnOverlayPress?: boolean;
  disableRemoveScroll?: boolean;
  description?: RenderProp<AlertDialogRenderContext>;
  descriptionProps?: AlertDialogDescriptionProps;
  descriptionClassName?: string;
  destructiveAriaLabel?: string;
  destructiveLabel?: RenderProp<AlertDialogRenderContext>;
  destructiveProps?: AlertDialogDestructiveProps;
  destructiveClassName?: string;
  footerClassName?: string;
  headerClassName?: string;
  overlayProps?: AlertDialogOverlayProps;
  portalProps?: AlertDialogPortalProps;
  title?: RenderProp<AlertDialogRenderContext>;
  titleProps?: AlertDialogTitleProps;
  titleClassName?: string;
  trigger?: RenderProp<AlertDialogRenderContext>;
  triggerProps?: AlertDialogTriggerProps;
  triggerClassName?: string;
};
