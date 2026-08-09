import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePopoverContext } from "@tamagui/popover";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import { Popover as TamaguiPopover } from "tamagui";
import { os } from "../utils/platform";
const DEFAULT_POPOVER_ENTER_STYLE = { opacity: 0, scale: 0.96, y: -8 };
const DEFAULT_POPOVER_EXIT_STYLE = { opacity: 0, scale: 0.96, y: -8 };
function PopoverRoot(props) {
    const scope = props.scope;
    const { arrow, arrowProps, children, content, contentProps, dismissOnBackPress = true, trigger, triggerProps, ...rootProps } = props;
    const hasDefaultStructure = trigger != null || content != null || arrow != null;
    if (!hasDefaultStructure) {
        return (_jsxs(TamaguiPopover, { ...rootProps, children: [_jsx(PopoverBackHandler, { dismissOnBackPress: dismissOnBackPress, scope: scope }), children] }));
    }
    return (_jsxs(TamaguiPopover, { ...rootProps, children: [_jsx(PopoverBackHandler, { dismissOnBackPress: dismissOnBackPress, scope: scope }), trigger != null ? _jsx(PopoverTrigger, { ...triggerProps, children: trigger }) : null, _jsxs(PopoverContent, { ...contentProps, children: [arrow ? _jsx(PopoverArrow, { ...arrowProps }) : null, content ?? children] })] }));
}
function PopoverAnchor(props) {
    return _jsx(TamaguiPopover.Anchor, { ...props });
}
function PopoverArrow(props) {
    return (_jsx(TamaguiPopover.Arrow, { ...props, background: props.background ?? "$background", borderColor: props.borderColor ?? "$borderColor" }));
}
function PopoverTrigger(props) {
    // Android measureInWindow 依赖非 collapsable 节点，否则锚点会偏
    const measureProps = os() === "android" ? { collapsable: false } : {};
    return _jsx(TamaguiPopover.Trigger, { asChild: props.asChild ?? true, ...measureProps, ...props });
}
function PopoverContent(props) {
    const { background, borderColor, borderWidth, boxShadow, enterStyle, exitStyle, size, style, transition, ...contentProps } = props;
    return (_jsx(TamaguiPopover.Content, { ...contentProps, background: background ?? "$background", borderColor: borderColor ?? "$borderColor", borderWidth: borderWidth ?? 1, boxShadow: boxShadow ?? "0 8px 24px $shadowColor", enterStyle: enterStyle ?? DEFAULT_POPOVER_ENTER_STYLE, exitStyle: exitStyle ?? DEFAULT_POPOVER_EXIT_STYLE, size: size ?? "$4", style: style, transition: transition ?? "100ms" }));
}
function PopoverClose(props) {
    return _jsx(TamaguiPopover.Close, { ...props });
}
function PopoverBackHandler(props) {
    const { dismissOnBackPress = true, scope } = props;
    const context = usePopoverContext(scope);
    const { open, onOpenChange } = context;
    useEffect(() => {
        if (os() !== "android" || !dismissOnBackPress || !open) {
            return;
        }
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            onOpenChange(false, "press");
            return true;
        });
        return () => {
            subscription.remove();
        };
    }, [dismissOnBackPress, onOpenChange, open]);
    return null;
}
export const Popover = Object.assign(PopoverRoot, {
    Anchor: PopoverAnchor,
    Arrow: PopoverArrow,
    Trigger: PopoverTrigger,
    Content: PopoverContent,
    Close: PopoverClose,
});
