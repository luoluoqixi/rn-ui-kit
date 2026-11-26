import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge as HeroUIBadge } from "@heroui/react/badge";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent } from "../utils/slot_content";
import { resolveBadgeContent } from "./badge_content";
export function BadgeHeroUI(props) {
    const { size, variant, color, placement, content, textClass } = resolveBadgeContent(props);
    const labelClass = cn(props.labelClassName, props.labelProps?.className);
    const labelFont = StyleSheet.flatten(useDefaultTextStyle(undefined, labelClass));
    return (_jsxs(HeroUIBadge.Anchor, { ...props.anchorProps?.herouiWebProps, className: cn("self-start", props.anchorClassName, props.anchorProps?.className), 
        // Anchors may contain RN Web Views and buttons, so use a flow-content host.
        render: anchorProps => _jsx("div", { ...anchorProps }), children: [props.children, !props.isHidden && (_jsx(TextClassContext.Provider, { value: cn(textClass, labelClass), children: _jsx(HeroUIBadge, { ...props.herouiWebProps, size: size, variant: variant, color: color, placement: placement, className: cn("pointer-events-none z-10", props.className), "aria-label": props.accessibilityLabel ?? props.herouiWebProps?.["aria-label"], children: hasSlotContent(content) && (_jsx(HeroUIBadge.Label, { ...props.labelProps?.herouiWebProps, className: labelClass, style: { fontFamily: labelFont?.fontFamily, ...props.labelProps?.herouiWebProps?.style }, children: content })) }) }))] }));
}
