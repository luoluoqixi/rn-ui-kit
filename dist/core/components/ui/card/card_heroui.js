import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Card as HeroUICard } from "@heroui/react/card";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasCardContent, normalizeCardChildren, resolveCardContent } from "./card_content";
export function CardHeroUI(props) {
    const { header, title, description, customHeader, hasHeader, content, footer } = resolveCardContent(props);
    const titleClass = cn(props.titleClassName, props.titleProps?.className);
    const descriptionClass = cn(props.descriptionClassName, props.descriptionProps?.className);
    const titleFont = StyleSheet.flatten(useDefaultTextStyle(undefined, titleClass));
    const descriptionFont = StyleSheet.flatten(useDefaultTextStyle(undefined, descriptionClass));
    return (_jsx(TextClassContext.Provider, { value: "text-foreground", children: _jsxs(HeroUICard, { ...props.herouiWebProps, variant: props.variant, className: props.className, children: [hasHeader && (_jsx(HeroUICard.Header, { ...props.headerProps?.herouiWebProps, className: cn(props.headerClassName, props.headerProps?.className), children: customHeader ? (normalizeCardChildren(header)) : (_jsxs(_Fragment, { children: [hasCardContent(title) && (_jsx(HeroUICard.Title, { ...props.titleProps?.herouiWebProps, className: titleClass, style: {
                                    fontFamily: titleFont?.fontFamily,
                                    ...props.titleProps?.herouiWebProps?.style,
                                }, children: _jsx(TextClassContext.Provider, { value: cn("text-sm leading-6 text-foreground font-medium", titleClass), children: title }) })), hasCardContent(description) && (_jsx(HeroUICard.Description, { ...props.descriptionProps?.herouiWebProps, className: descriptionClass, style: {
                                    fontFamily: descriptionFont?.fontFamily,
                                    ...props.descriptionProps?.herouiWebProps?.style,
                                }, children: _jsx(TextClassContext.Provider, { value: cn("text-sm leading-5 text-muted", descriptionClass), children: description }) }))] })) })), hasCardContent(content) && (_jsx(HeroUICard.Content, { ...props.contentProps?.herouiWebProps, className: cn(props.contentClassName, props.contentProps?.className), children: normalizeCardChildren(content) })), normalizeCardChildren(props.children), hasCardContent(footer) && (_jsx(HeroUICard.Footer, { ...props.footerProps?.herouiWebProps, className: cn(props.footerClassName, props.footerProps?.className), children: normalizeCardChildren(footer) }))] }) }));
}
