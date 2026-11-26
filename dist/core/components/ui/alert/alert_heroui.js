import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert as HeroUIAlert } from "@heroui/react/alert";
import { useId } from "react";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent, normalizeSlotText } from "../utils/slot_content";
import { alertStatusText, resolveAlertContent } from "./alert_content";
export function AlertHeroUI(props) {
    const { status, title, description, content, action, indicator, showIndicator } = resolveAlertContent(props);
    const generatedId = useId();
    const titleId = props.titleProps?.herouiWebProps?.id ?? generatedId + "-title";
    const descriptionId = props.descriptionProps?.herouiWebProps?.id ?? generatedId + "-description";
    const titleClass = cn(props.titleClassName, props.titleProps?.className);
    const descriptionClass = cn(props.descriptionClassName, props.descriptionProps?.className);
    const titleFont = StyleSheet.flatten(useDefaultTextStyle(undefined, titleClass));
    const descriptionFont = StyleSheet.flatten(useDefaultTextStyle(undefined, descriptionClass));
    const hasContent = [title, description, content, props.children].some(hasSlotContent);
    return (_jsx(TextClassContext.Provider, { value: "text-sm text-muted", children: _jsxs(HeroUIAlert, { role: "alert", "aria-labelledby": hasSlotContent(title) ? titleId : undefined, "aria-describedby": hasSlotContent(description) ? descriptionId : undefined, ...props.herouiWebProps, status: status, className: props.className, children: [showIndicator && (_jsx(HeroUIAlert.Indicator, { ...props.indicatorProps?.herouiWebProps, className: cn(props.iconAlign === "center" && "self-center pt-0", props.iconContainerClassName, props.indicatorClassName, props.indicatorProps?.className), children: indicator === undefined ? undefined : normalizeSlotText(indicator) })), hasContent && (_jsxs(HeroUIAlert.Content, { ...props.contentProps?.herouiWebProps, className: cn("min-w-0", props.contentClassName, props.contentProps?.className), children: [hasSlotContent(title) && (_jsx(HeroUIAlert.Title, { ...props.titleProps?.herouiWebProps, id: titleId, className: titleClass, style: { fontFamily: titleFont?.fontFamily, ...props.titleProps?.herouiWebProps?.style }, children: _jsx(TextClassContext.Provider, { value: cn("text-sm font-medium", alertStatusText[status], titleClass), children: title }) })), hasSlotContent(description) && (_jsx(HeroUIAlert.Description, { ...props.descriptionProps?.herouiWebProps, id: descriptionId, className: descriptionClass, style: { fontFamily: descriptionFont?.fontFamily, ...props.descriptionProps?.herouiWebProps?.style }, children: _jsx(TextClassContext.Provider, { value: cn("text-sm text-muted", descriptionClass), children: description }) })), normalizeSlotText(content), normalizeSlotText(props.children)] })), normalizeSlotText(action)] }) }));
}
