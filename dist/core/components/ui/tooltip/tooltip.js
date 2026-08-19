import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip as TamaguiTooltip, TooltipGroup as TamaguiTooltipGroup, Text, closeOpenTooltips, } from "tamagui";
const DEFAULT_TOOLTIP_ENTER_STYLE = { opacity: 0, scale: 0.96, y: -4 };
const DEFAULT_TOOLTIP_EXIT_STYLE = { opacity: 0, scale: 0.98, y: -2 };
function TooltipSimple(props) {
    const { anchor, anchorProps, arrow, arrowProps, children, content, contentProps, triggerProps, ...rootProps } = props;
    return (_jsxs(TooltipRoot, { ...rootProps, children: [anchor != null ? _jsx(TooltipAnchor, { ...anchorProps, children: anchor }) : null, _jsx(TooltipTrigger, { ...triggerProps, children: children }), _jsxs(TooltipContent, { ...contentProps, children: [arrow ? _jsx(TooltipArrow, { ...arrowProps }) : null, typeof content === "string" ? _jsx(Text, { children: content }) : content] })] }));
}
function TooltipRootBase(props) {
    return _jsx(TamaguiTooltip, { ...props });
}
function TooltipAnchor(props) {
    return _jsx(TamaguiTooltip.Anchor, { ...props });
}
function TooltipArrow(props) {
    return (_jsx(TamaguiTooltip.Arrow, { ...props, background: props.background ?? "$background", borderColor: props.borderColor ?? "$borderColor" }));
}
function TooltipTrigger(props) {
    return _jsx(TamaguiTooltip.Trigger, { asChild: props.asChild ?? true, ...props });
}
function TooltipContent(props) {
    const { background, borderColor, borderWidth, boxShadow, enterStyle, exitStyle, size, transition, ...contentProps } = props;
    return (_jsx(TamaguiTooltip.Content, { ...contentProps, background: background ?? "$background", borderColor: borderColor ?? "$borderColor", borderWidth: borderWidth ?? 1, boxShadow: boxShadow ?? "0 8px 24px $shadowColor", enterStyle: enterStyle ?? DEFAULT_TOOLTIP_ENTER_STYLE, exitStyle: exitStyle ?? DEFAULT_TOOLTIP_EXIT_STYLE, size: size ?? "$3", transition: transition ?? "100ms" }));
}
function TooltipGroup(props) {
    return _jsx(TamaguiTooltipGroup, { ...props });
}
const TooltipRoot = Object.assign(TooltipRootBase, {
    Anchor: TooltipAnchor,
    Arrow: TooltipArrow,
    Trigger: TooltipTrigger,
    Content: TooltipContent,
    Group: TooltipGroup,
});
export const Tooltip = Object.assign(TooltipSimple, {
    Root: TooltipRoot,
});
export { closeOpenTooltips, TooltipGroup, TooltipRoot };
