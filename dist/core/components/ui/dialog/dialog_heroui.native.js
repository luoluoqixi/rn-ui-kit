import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog as HeroDialog } from "heroui-native/dialog";
import { View } from "react-native";
import { CloseButton } from "../close_button";
import { Text } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
import { DialogActions, useDialogModel } from "./dialog_shared";
import { OverlayPortalWindow } from "../utils/overlay/overlay_portal";
export function DialogHeroUI(p) {
    const m = useDialogModel(p);
    const back = p.dismissOnBackPress ?? !p.isAlert;
    const overlay = p.dismissOnOverlayPress ?? !p.isAlert;
    const titleStyle = useDefaultTextStyle(p.titleProps?.style, p.titleClassName);
    const descriptionStyle = useDefaultTextStyle(p.descriptionProps?.style, p.descriptionClassName);
    return _jsxs(HeroDialog, { ...p.herouiNativeProps, isOpen: m.open, onOpenChange: next => { if (next || back)
            m.setOpen(next); }, children: [m.trigger && _jsx(HeroDialog.Trigger, { asChild: true, children: m.trigger }), m.open && _jsx(OverlayPortalWindow, { forceFullScreen: true, onRequestClose: () => { if (back)
                    m.close(); }, children: _jsxs(View, { pointerEvents: "box-none", className: cn("absolute inset-0 justify-center", p.portalProps?.className), style: p.portalProps?.style, children: [_jsx(HeroDialog.Overlay, { ...p.overlayProps?.herouiNativeProps, className: p.overlayProps?.className, isCloseOnPress: false, onPress: () => { if (overlay)
                                m.close(); } }), _jsxs(HeroDialog.Content, { ...p.contentProps?.herouiNativeProps, isSwipeable: back && !p.isAlert && p.contentProps?.herouiNativeProps?.isSwipeable !== false, accessibilityLabel: p.accessibilityLabel, accessibilityRole: p.isAlert ? "alert" : undefined, accessibilityViewIsModal: true, className: cn("mx-4 gap-4", p.contentClassName, p.contentProps?.className), children: [(p.showCloseButton ?? !p.isAlert) && _jsx(CloseButton, { className: "absolute right-3 top-3 z-10", onPress: m.close }), (m.title != null || m.description != null) && _jsxs(View, { className: cn("gap-2", p.headerClassName), children: [m.title != null && _jsx(HeroDialog.Title, { ...p.titleProps, className: p.titleClassName, style: titleStyle, children: m.title }), m.description != null && _jsx(HeroDialog.Description, { ...p.descriptionProps, className: p.descriptionClassName, style: descriptionStyle, children: m.description })] }), typeof m.content === "string" || typeof m.content === "number" ? _jsx(Text, { children: m.content }) : m.content, (p.actions != null || p.cancelLabel != null || p.actionLabel != null || p.destructiveLabel != null) &&
                                    _jsx(View, { className: cn("flex-row flex-wrap justify-end gap-2", p.footerClassName), children: _jsx(DialogActions, { props: p, model: m }) })] })] }) })] });
}
