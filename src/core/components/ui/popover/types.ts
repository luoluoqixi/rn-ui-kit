import type { ComponentProps, ReactNode } from "react";
import type { Popover as NativePopover } from "heroui-native/popover";
import type { Popover as WebPopover } from "@heroui/react/popover";
import type { RenderProp } from "../utils/render";
import type { OverlayStateProps, OverlayPartProps } from "../utils/overlay/overlay_state";
export type PopoverRenderContext = { open: boolean; close: () => void };
export type PopoverContentProps = OverlayPartProps<
  Omit<Extract<ComponentProps<typeof NativePopover.Content>, { presentation: "popover" }>, "children" | "presentation">,
  Omit<ComponentProps<typeof WebPopover.Content>, "children" | "isOpen" | "onOpenChange">
> & { side?: "top" | "bottom" | "left" | "right"; align?: "start" | "center" | "end"; sideOffset?: number };
export type PopoverProps = OverlayStateProps & {
  children?: ReactNode;
  trigger?: ReactNode;
  content?: RenderProp<PopoverRenderContext>;
  title?: ReactNode;
  description?: ReactNode;
  accessibilityLabel?: string;
  showArrow?: boolean;
  isDisabled?: boolean;
  contentProps?: PopoverContentProps;
  contentClassName?: string;
  herouiNativeProps?: Omit<ComponentProps<typeof NativePopover>, "children" | "isOpen" | "isDefaultOpen" | "onOpenChange">;
  herouiWebProps?: Omit<ComponentProps<typeof WebPopover>, "children" | "isOpen" | "defaultOpen" | "onOpenChange">;
};
