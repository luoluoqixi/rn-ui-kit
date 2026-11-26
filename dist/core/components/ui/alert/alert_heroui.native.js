import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert as HeroUIAlert } from "heroui-native/alert";
import { useId } from "react";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent, normalizeSlotText } from "../utils/slot_content";
import { alertStatusText, resolveAlertContent } from "./alert_content";
export function AlertHeroUI(props) {
    const { status, title, description, content, action, indicator, showIndicator } = resolveAlertContent(props);
    const generatedId = useId();
    const rootId = String(props.herouiNativeProps?.id ?? props.herouiNativeProps?.nativeID ?? generatedId);
    const titleId = props.titleProps?.herouiNativeProps?.id ?? props.titleProps?.herouiNativeProps?.nativeID ?? rootId + "_label";
    const descriptionId = props.descriptionProps?.herouiNativeProps?.id ?? props.descriptionProps?.herouiNativeProps?.nativeID ?? rootId + "_desc";
    const titleClass = cn(props.titleClassName, props.titleProps?.className);
    const descriptionClass = cn(props.descriptionClassName, props.descriptionProps?.className);
    const titleFont = useDefaultTextStyle(props.titleProps?.herouiNativeProps?.style, titleClass);
    const descriptionFont = useDefaultTextStyle(props.descriptionProps?.herouiNativeProps?.style, descriptionClass);
    const hasContent = [title, description, content, props.children].some(hasSlotContent);
    return (_jsx(TextClassContext.Provider, { value: "text-sm text-muted", children: _jsxs(HeroUIAlert, { ...props.herouiNativeProps, id: rootId, nativeID: rootId, "aria-labelledby": hasSlotContent(title) ? titleId : undefined, "aria-describedby": hasSlotContent(description) ? descriptionId : undefined, status: status, className: props.className, children: [showIndicator && (_jsx(HeroUIAlert.Indicator, { ...props.indicatorProps?.herouiNativeProps, className: cn(props.iconAlign === "center" && "self-center pt-0", props.iconContainerClassName, props.indicatorClassName, props.indicatorProps?.className), children: indicator === undefined ? undefined : normalizeSlotText(indicator) })), hasContent && (_jsxs(HeroUIAlert.Content, { ...props.contentProps?.herouiNativeProps, className: cn("min-w-0", props.contentClassName, props.contentProps?.className), children: [hasSlotContent(title) && (_jsx(HeroUIAlert.Title, { ...props.titleProps?.herouiNativeProps, id: titleId, nativeID: titleId, className: titleClass, style: titleFont, children: _jsx(TextClassContext.Provider, { value: cn("text-base font-medium", alertStatusText[status], titleClass), children: title }) })), hasSlotContent(description) && (_jsx(HeroUIAlert.Description, { ...props.descriptionProps?.herouiNativeProps, id: descriptionId, nativeID: descriptionId, className: descriptionClass, style: descriptionFont, children: _jsx(TextClassContext.Provider, { value: cn("text-sm text-muted", descriptionClass), children: description }) })), normalizeSlotText(content), normalizeSlotText(props.children)] })), normalizeSlotText(action)] }) }));
}
