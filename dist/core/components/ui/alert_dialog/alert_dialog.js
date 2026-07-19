import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDialogContext } from "@tamagui/dialog";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import { AlertDialog as TamaguiAlertDialog, Dialog as TamaguiDialog, XStack, YStack, } from "tamagui";
import { isWeb, os } from "../utils/platform";
import { Button } from "../button";
import { preventDialogDismissForDragRegion, } from "../dialog/dialog_outside_interaction";
import { useTrueSheetCenteredModalContentOffsetY } from "../sheet/native_sheet/true_sheet/use_true_sheet_centered_modal_layout";
import { resolveAriaLabel } from "../utils";
const DEFAULT_OVERLAY_TRANSITION = "100ms";
const AlertDialogContentBase = TamaguiDialog.Content;
function AlertDialogRoot(props) {
    const scope = props.scope;
    const { actionAriaLabel, actionLabel, actionProps, actions, cancelAriaLabel, cancelLabel, cancelProps, children, contentProps, dismissOnBackPress = true, dismissOnOverlayPress = false, description, descriptionProps, destructiveAriaLabel, destructiveLabel, destructiveProps, overlayProps, portalProps, title, titleProps, trigger, triggerProps, disableRemoveScroll, ...rootProps } = props;
    const hasDefaultStructure = trigger != null ||
        title != null ||
        description != null ||
        actions != null ||
        cancelLabel != null ||
        actionLabel != null ||
        destructiveLabel != null;
    if (!hasDefaultStructure) {
        return (_jsxs(TamaguiAlertDialog, { ...rootProps, children: [_jsx(AlertDialogBackHandler, { dismissOnBackPress: dismissOnBackPress, scope: scope }), children] }));
    }
    return (_jsxs(TamaguiAlertDialog, { disableRemoveScroll: disableRemoveScroll ?? isWeb(), ...rootProps, children: [_jsx(AlertDialogBackHandler, { dismissOnBackPress: dismissOnBackPress, scope: scope }), trigger != null ? (_jsx(AlertDialogTrigger, { ...triggerProps, children: trigger })) : null, _jsxs(AlertDialogPortal, { ...portalProps, children: [_jsx(AlertDialogOverlay, { opacity: 0.5, animateOnly: ["transform", "opacity"], enterStyle: { opacity: 0 }, exitStyle: { opacity: 0 }, transition: DEFAULT_OVERLAY_TRANSITION, ...overlayProps, dismissOnOverlayPress: dismissOnOverlayPress }), _jsx(AlertDialogContent, { transition: [
                            "quicker",
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ], enterStyle: { x: 0, y: 20, opacity: 0 }, exitStyle: { x: 0, y: 10, opacity: 0, scale: 0.95 }, ...contentProps, dismissOnOverlayPress: dismissOnOverlayPress, children: _jsxs(YStack, { gap: "$3", children: [title != null ? _jsx(AlertDialogTitle, { ...titleProps, children: title }) : null, description != null ? (_jsx(AlertDialogDescription, { ...descriptionProps, children: description })) : null, children, actions != null ||
                                    cancelLabel != null ||
                                    actionLabel != null ||
                                    destructiveLabel != null ? (_jsxs(XStack, { gap: "$2", style: { justifyContent: "flex-end" }, children: [actions, cancelLabel != null ? (_jsx(AlertDialogCancel, { ...cancelProps, asChild: true, children: _jsx(Button, { "aria-label": resolveAriaLabel(cancelAriaLabel, cancelLabel), children: cancelLabel }) })) : null, actionLabel != null ? (_jsx(AlertDialogAction, { ...actionProps, asChild: true, children: _jsx(Button, { "aria-label": resolveAriaLabel(actionAriaLabel, actionLabel), children: actionLabel }) })) : null, destructiveLabel != null ? (_jsx(AlertDialogDestructive, { ...destructiveProps, asChild: true, children: _jsx(Button, { "aria-label": resolveAriaLabel(destructiveAriaLabel, destructiveLabel), theme: "red", children: destructiveLabel }) })) : null] })) : null] }) })] })] }));
}
function AlertDialogTrigger(props) {
    return _jsx(TamaguiAlertDialog.Trigger, { ...props, asChild: true });
}
function AlertDialogPortal(props) {
    return _jsx(TamaguiAlertDialog.Portal, { ...props });
}
function AlertDialogOverlay(props) {
    const { dismissOnOverlayPress = false, ...overlayProps } = props;
    const context = useDialogContext(overlayProps.scope);
    if (isWeb() && !context.open) {
        return null;
    }
    return (_jsx(TamaguiAlertDialog.Overlay, { ...overlayProps, onPress: (event) => {
            overlayProps.onPress?.(event);
            if (!event.defaultPrevented && dismissOnOverlayPress && !isWeb()) {
                context.onOpenChange(false);
            }
        }, transition: overlayProps.transition ?? DEFAULT_OVERLAY_TRANSITION }));
}
function AlertDialogContent(props) {
    const contentProps = props;
    const { dismissOnOverlayPress = false, onInteractOutside, onPointerDownOutside, y: yProp, ...restProps } = contentProps;
    const trueSheetCenterY = useTrueSheetCenteredModalContentOffsetY();
    return (_jsx(AlertDialogContentBase, { role: "alertdialog", "aria-modal": true, ...restProps, y: yProp ?? (trueSheetCenterY !== 0 ? trueSheetCenterY : undefined), onPointerDownOutside: (event) => {
            onPointerDownOutside?.(event);
            preventDialogDismissForDragRegion(event);
            if (!event.defaultPrevented && !dismissOnOverlayPress) {
                event.preventDefault();
            }
        }, onInteractOutside: (event) => {
            onInteractOutside?.(event);
            preventDialogDismissForDragRegion(event);
            if (!event.defaultPrevented && !dismissOnOverlayPress) {
                event.preventDefault();
            }
        } }));
}
function AlertDialogBackHandler(props) {
    const { dismissOnBackPress = true, scope } = props;
    const context = useDialogContext(scope);
    const { open, onOpenChange } = context;
    useEffect(() => {
        if (os() !== "android" || !dismissOnBackPress || !open) {
            return;
        }
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            onOpenChange(false);
            return true;
        });
        return () => {
            subscription.remove();
        };
    }, [dismissOnBackPress, onOpenChange, open]);
    return null;
}
function AlertDialogAction(props) {
    return _jsx(TamaguiAlertDialog.Action, { ...props });
}
function AlertDialogCancel(props) {
    return _jsx(TamaguiAlertDialog.Cancel, { ...props });
}
function AlertDialogDestructive(props) {
    return _jsx(TamaguiAlertDialog.Destructive, { ...props });
}
function AlertDialogTitle(props) {
    return _jsx(TamaguiAlertDialog.Title, { ...props });
}
function AlertDialogDescription(props) {
    return _jsx(TamaguiAlertDialog.Description, { ...props });
}
export const AlertDialog = Object.assign(AlertDialogRoot, {
    Trigger: AlertDialogTrigger,
    Portal: AlertDialogPortal,
    Overlay: AlertDialogOverlay,
    Content: AlertDialogContent,
    Action: AlertDialogAction,
    Cancel: AlertDialogCancel,
    Destructive: AlertDialogDestructive,
    Title: AlertDialogTitle,
    Description: AlertDialogDescription,
});
