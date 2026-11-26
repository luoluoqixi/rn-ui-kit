import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button as AriaButton } from "react-aria-components/Button";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { Modal } from "@heroui/react/modal";
import { AlertDialog } from "@heroui/react/alert-dialog";
import { Text as AriaText } from "react-aria-components/Text";
import { Pressable } from "react-aria-components/Pressable";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { ModalContentScope } from "../utils/overlay/modal_content_scope";
import { useOverlayPortalContainer } from "../utils/overlay/overlay_portal_scope";
import { HeroUIOverlayLayer } from "../utils/overlay/heroui_layer.web";
import { DialogActions, useDialogModel } from "./dialog_shared";
export function DialogHeroUI(p) {
    const m = useDialogModel(p);
    const titleStyle = textWebStyle(useDefaultTextStyle(p.titleProps?.style, p.titleClassName));
    const descriptionStyle = textWebStyle(useDefaultTextStyle(p.descriptionProps?.style, p.descriptionClassName));
    const container = useOverlayPortalContainer();
    const C = p.isAlert ? AlertDialog : Modal;
    const dialog = (_jsx(ModalContentScope, { children: _jsx(HeroUIOverlayLayer, { children: _jsxs(C.Dialog, { ...p.contentProps?.herouiWebProps, "aria-label": p.accessibilityLabel ?? (m.title == null ? "对话框" : undefined), className: cn(p.contentClassName, p.contentProps?.className), children: [(p.showCloseButton ?? !p.isAlert) && _jsx(C.CloseTrigger, { "aria-label": "\u5173\u95ED" }), (m.title != null || m.description != null) && _jsxs(C.Header, { className: p.headerClassName, children: [m.title != null && _jsx(C.Heading, { className: cn(p.titleProps?.className, p.titleClassName), style: titleStyle, children: m.title }), m.description != null && _jsx(AriaText, { slot: "description", className: cn("text-muted text-sm", p.descriptionClassName), style: descriptionStyle, children: m.description })] }), m.content != null && _jsx(C.Body, { children: typeof m.content === "string" || typeof m.content === "number" ? _jsx(Text, { children: m.content }) : m.content }), (p.actions != null || p.cancelLabel != null || p.actionLabel != null || p.destructiveLabel != null) &&
                        _jsx(C.Footer, { className: p.footerClassName, children: _jsx(DialogActions, { props: p, model: m }) })] }) }) }));
    return _jsxs(C, { ...p.herouiWebProps, isOpen: m.open, onOpenChange: m.setOpen, children: [m.trigger ? _jsx(Pressable, { children: m.trigger }) : _jsx(AriaButton, { "aria-hidden": true, style: { display: "none" }, "aria-label": "\u5BF9\u8BDD\u6846\u89E6\u53D1\u5668" }), _jsx(C.Backdrop, { ...p.overlayProps?.herouiWebProps, UNSTABLE_portalContainer: container ?? undefined, className: p.overlayProps?.className, isDismissable: p.dismissOnOverlayPress ?? !p.isAlert, isKeyboardDismissDisabled: !(p.dismissOnBackPress ?? !p.isAlert), children: p.isAlert ? _jsx(AlertDialog.Container, { size: p.size === "full" ? "cover" : p.size, children: dialog })
                    : _jsx(Modal.Container, { size: p.size, children: dialog }) })] });
}
