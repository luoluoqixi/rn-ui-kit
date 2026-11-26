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
import { DialogActions, useDialogModel, type DialogAdapterProps } from "./dialog_shared";

export function DialogHeroUI(p: DialogAdapterProps) {
  const m = useDialogModel(p);
  const titleStyle = textWebStyle(useDefaultTextStyle(p.titleProps?.style, p.titleClassName));
  const descriptionStyle = textWebStyle(useDefaultTextStyle(p.descriptionProps?.style, p.descriptionClassName));
  const container = useOverlayPortalContainer();
  const C = p.isAlert ? AlertDialog : Modal;
  const dialog = (
        <ModalContentScope><HeroUIOverlayLayer><C.Dialog {...p.contentProps?.herouiWebProps} aria-label={p.accessibilityLabel ?? (m.title == null ? "对话框" : undefined)}
          className={cn(p.contentClassName, p.contentProps?.className)}>
            {(p.showCloseButton ?? !p.isAlert) && <C.CloseTrigger aria-label="关闭" />}
            {(m.title != null || m.description != null) && <C.Header className={p.headerClassName}>
              {m.title != null && <C.Heading className={cn(p.titleProps?.className, p.titleClassName)} style={titleStyle}>{m.title}</C.Heading>}
              {m.description != null && <AriaText slot="description" className={cn("text-muted text-sm", p.descriptionClassName)} style={descriptionStyle}>{m.description}</AriaText>}
            </C.Header>}
            {m.content != null && <C.Body>{typeof m.content === "string" || typeof m.content === "number" ? <Text>{m.content}</Text> : m.content}</C.Body>}
            {(p.actions != null || p.cancelLabel != null || p.actionLabel != null || p.destructiveLabel != null) &&
              <C.Footer className={p.footerClassName}><DialogActions props={p} model={m} /></C.Footer>}
        </C.Dialog></HeroUIOverlayLayer></ModalContentScope>
  );
  return <C {...p.herouiWebProps} isOpen={m.open} onOpenChange={m.setOpen}>
    {m.trigger ? <Pressable>{m.trigger}</Pressable> : <AriaButton aria-hidden style={{ display: "none" }} aria-label="对话框触发器" />}
    <C.Backdrop {...p.overlayProps?.herouiWebProps} UNSTABLE_portalContainer={container ?? undefined}
      className={p.overlayProps?.className} isDismissable={p.dismissOnOverlayPress ?? !p.isAlert}
      isKeyboardDismissDisabled={!(p.dismissOnBackPress ?? !p.isAlert)}>
      {p.isAlert ? <AlertDialog.Container size={p.size === "full" ? "cover" : p.size}>{dialog}</AlertDialog.Container>
        : <Modal.Container size={p.size}>{dialog}</Modal.Container>}
    </C.Backdrop>
  </C>;
}
