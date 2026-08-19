import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDialogContext } from "@tamagui/dialog";
import { X } from "@tamagui/lucide-icons-2";
import { useEffect } from "react";
import { BackHandler, StyleSheet } from "react-native";
import { Dialog as TamaguiDialog, Unspaced, XStack, YStack } from "tamagui";
import { isWeb, os } from "../utils/platform";
import { Button } from "../button";
import { useTrueSheetCenteredModalContentOffsetY } from "../sheet/native_sheet/true_sheet/use_true_sheet_centered_modal_layout";
import { resolveAriaLabel } from "../utils";
import { preventDialogDismissForDragRegion, } from "./dialog_outside_interaction";
const DEFAULT_WIDTH = isWeb() ? "60%" : "80%";
const DEFAULT_Height = isWeb() ? "60%" : "40%";
const DEFAULT_OVERLAY_TRANSITION = "100ms";
const DEFAULT_OVERLAY_OPACITY = 0.5;
const DEFAULT_OVERLAY_ENTER_STYLE = { opacity: 0 };
const DEFAULT_OVERLAY_EXIT_STYLE = isWeb() ? undefined : { opacity: 0 };
const DEFAULT_ANIMATE_ONLY = ["transform", "opacity"];
function DialogRoot(props) {
    const scope = props.scope;
    const { actions, children, closeAriaLabel, closeBtn = true, closeProps, contentProps, dismissOnBackPress = true, dismissOnOverlayPress = true, description, descriptionProps, width, height, minWidth, minHeight, maxWidth, maxHeight, overlayProps, portalProps, title, titleProps, trigger, triggerProps, disableRemoveScroll, ...rootProps } = props;
    const { style: contentStyle, ...restContentProps } = contentProps ?? {};
    const flattenedContentStyle = StyleSheet.flatten(contentStyle);
    const resolvedSizeStyle = {
        width: flattenedContentStyle?.width ?? width ?? DEFAULT_WIDTH,
        height: flattenedContentStyle?.height ?? height ?? DEFAULT_Height,
        minWidth: flattenedContentStyle?.minWidth ?? minWidth,
        minHeight: flattenedContentStyle?.minHeight ?? minHeight,
        maxWidth: flattenedContentStyle?.maxWidth ?? maxWidth,
        maxHeight: flattenedContentStyle?.maxHeight ?? maxHeight,
    };
    const resolvedContentStyle = [contentStyle, resolvedSizeStyle];
    const hasDefaultStructure = trigger != null || title != null || description != null || actions != null;
    if (!hasDefaultStructure) {
        return (_jsxs(TamaguiDialog, { ...rootProps, children: [_jsx(DialogBackHandler, { dismissOnBackPress: dismissOnBackPress, scope: scope }), children] }));
    }
    return (_jsxs(TamaguiDialog, { disableRemoveScroll: disableRemoveScroll ?? isWeb(), ...rootProps, children: [_jsx(DialogBackHandler, { dismissOnBackPress: dismissOnBackPress, scope: scope }), trigger != null ? _jsx(DialogTrigger, { ...triggerProps, children: trigger }) : null, _jsxs(DialogPortal, { ...portalProps, children: [_jsx(DialogOverlay, { ...overlayProps, dismissOnOverlayPress: dismissOnOverlayPress }), _jsx(DialogContent, { transition: [
                            "quicker",
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ], enterStyle: { x: 0, y: 20, opacity: 0 }, exitStyle: { x: 0, y: 10, opacity: 0, scale: 0.95 }, ...restContentProps, dismissOnOverlayPress: dismissOnOverlayPress, style: resolvedContentStyle, children: _jsxs(YStack, { flex: 1, gap: "$3", style: { minHeight: 0 }, children: [title != null ? _jsx(DialogTitle, { ...titleProps, children: title }) : null, description != null ? (_jsx(DialogDescription, { ...descriptionProps, children: description })) : null, children, actions != null ? (_jsx(XStack, { gap: "$2", style: { justifyContent: "flex-end" }, children: actions })) : null, closeBtn === true ? (_jsx(Unspaced, { children: _jsx(DialogClose, { ...closeProps, asChild: true, children: _jsx(Button, { "aria-label": resolveAriaLabel(closeAriaLabel, "Close"), position: "absolute", r: "$3", size: "$2", circular: true, icon: X }) }) })) : null] }) })] })] }));
}
function DialogTrigger(props) {
    return _jsx(TamaguiDialog.Trigger, { ...props, asChild: true });
}
function DialogPortal(props) {
    return _jsx(TamaguiDialog.Portal, { ...props });
}
function DialogOverlay(props) {
    const { dismissOnOverlayPress = true, ...overlayProps } = props;
    const context = useDialogContext(overlayProps.scope);
    if (isWeb() && !context.open) {
        return null;
    }
    return (_jsx(TamaguiDialog.Overlay, { bg: "$background", opacity: DEFAULT_OVERLAY_OPACITY, animateOnly: DEFAULT_ANIMATE_ONLY, enterStyle: DEFAULT_OVERLAY_ENTER_STYLE, exitStyle: DEFAULT_OVERLAY_EXIT_STYLE, transition: DEFAULT_OVERLAY_TRANSITION, ...overlayProps, onPress: (event) => {
            overlayProps.onPress?.(event);
            if (!event.defaultPrevented && dismissOnOverlayPress && !isWeb()) {
                context.onOpenChange(false);
            }
        } }));
}
function DialogContent(props) {
    const { dismissOnOverlayPress = true, onInteractOutside, onPointerDownOutside, y: yProp, ...restProps } = props;
    const trueSheetCenterY = useTrueSheetCenteredModalContentOffsetY();
    return (_jsx(TamaguiDialog.Content, { ...restProps, y: yProp ?? (trueSheetCenterY !== 0 ? trueSheetCenterY : undefined), onPointerDownOutside: (event) => {
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
function DialogBackHandler(props) {
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
function DialogTitle(props) {
    return _jsx(TamaguiDialog.Title, { ...props });
}
function DialogDescription(props) {
    return _jsx(TamaguiDialog.Description, { ...props });
}
function DialogClose(props) {
    return _jsx(TamaguiDialog.Close, { ...props });
}
export const Dialog = Object.assign(DialogRoot, {
    Trigger: DialogTrigger,
    Portal: DialogPortal,
    Overlay: DialogOverlay,
    Content: DialogContent,
    Title: DialogTitle,
    Description: DialogDescription,
    Close: DialogClose,
});
