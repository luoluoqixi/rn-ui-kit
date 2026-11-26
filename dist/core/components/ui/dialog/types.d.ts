import type { ComponentProps, ReactNode } from "react";
import type { Dialog as NativeDialog } from "heroui-native/dialog";
import type { Modal } from "@heroui/react/modal";
import type { ButtonProps } from "../button";
import type { TextProps } from "../text";
import type { RenderProp } from "../utils/render";
import type { OverlayPartProps, OverlayStateProps } from "../utils/overlay/overlay_state";
export type DialogRenderContext = {
    open: boolean;
    close: () => void;
};
export type DialogContentProps = OverlayPartProps<Omit<ComponentProps<typeof NativeDialog.Content>, "children">, Omit<ComponentProps<typeof Modal.Dialog>, "children">>;
export type DialogOverlayProps = OverlayPartProps<Omit<ComponentProps<typeof NativeDialog.Overlay>, "children" | "isCloseOnPress">, Omit<ComponentProps<typeof Modal.Backdrop>, "children" | "isOpen" | "onOpenChange" | "isDismissable" | "isKeyboardDismissDisabled">>;
/** Native Modal owns the presentation order; only the container's layout is configurable. */
export type DialogPortalProps = Pick<ComponentProps<typeof NativeDialog.Portal>, "className" | "style">;
export type DialogTitleProps = TextProps;
export type DialogDescriptionProps = TextProps;
export type DialogProps = OverlayStateProps & {
    children?: ReactNode;
    title?: RenderProp<DialogRenderContext>;
    description?: RenderProp<DialogRenderContext>;
    content?: RenderProp<DialogRenderContext>;
    trigger?: RenderProp<DialogRenderContext>;
    triggerProps?: Omit<ButtonProps, "children">;
    triggerClassName?: string;
    contentProps?: DialogContentProps;
    contentClassName?: string;
    overlayProps?: DialogOverlayProps;
    portalProps?: DialogPortalProps;
    titleProps?: DialogTitleProps;
    descriptionProps?: DialogDescriptionProps;
    titleClassName?: string;
    descriptionClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
    actions?: RenderProp<DialogRenderContext>;
    actionLabel?: RenderProp<DialogRenderContext>;
    actionProps?: ButtonProps;
    actionClassName?: string;
    cancelLabel?: RenderProp<DialogRenderContext>;
    cancelProps?: ButtonProps;
    cancelClassName?: string;
    destructiveLabel?: RenderProp<DialogRenderContext>;
    destructiveProps?: ButtonProps;
    destructiveClassName?: string;
    actionAriaLabel?: string;
    cancelAriaLabel?: string;
    destructiveAriaLabel?: string;
    closeOnAction?: boolean;
    showCloseButton?: boolean;
    /** 点击遮罩关闭。Dialog 默认 true；AlertDialog 默认 false。 */
    dismissOnOverlayPress?: boolean;
    /** Web Escape / Android 返回键关闭。Dialog 默认 true；AlertDialog 默认 false。 */
    dismissOnBackPress?: boolean;
    accessibilityLabel?: string;
    size?: ComponentProps<typeof Modal.Container>["size"];
    herouiNativeProps?: Omit<ComponentProps<typeof NativeDialog>, "children" | "isOpen" | "isDefaultOpen" | "onOpenChange">;
    herouiWebProps?: Omit<ComponentProps<typeof Modal>, "children" | "isOpen" | "defaultOpen" | "onOpenChange" | "state">;
};
