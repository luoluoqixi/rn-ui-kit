import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Card as HeroUICard } from "heroui-native/card";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasCardContent, normalizeCardChildren, resolveCardContent } from "./card_content";
export function CardHeroUI(props) {
    const { header, title, description, customHeader, hasHeader, content, footer } = resolveCardContent(props);
    const titleClass = cn(props.titleClassName, props.titleProps?.className);
    const descriptionClass = cn(props.descriptionClassName, props.descriptionProps?.className);
    const titleStyle = useDefaultTextStyle(props.titleProps?.herouiNativeProps?.style, titleClass);
    const descriptionStyle = useDefaultTextStyle(props.descriptionProps?.herouiNativeProps?.style, descriptionClass);
    return (_jsx(TextClassContext.Provider, { value: "text-foreground", children: _jsxs(HeroUICard, { ...props.herouiNativeProps, variant: props.variant, className: cn("gap-3", props.className), children: [hasHeader && (_jsx(HeroUICard.Header, { ...props.headerProps?.herouiNativeProps, className: cn(props.headerClassName, props.headerProps?.className), children: customHeader ? (normalizeCardChildren(header)) : (_jsxs(_Fragment, { children: [hasCardContent(title) && (_jsx(HeroUICard.Title, { ...props.titleProps?.herouiNativeProps, className: titleClass, style: titleStyle, children: _jsx(TextClassContext.Provider, { value: cn("text-lg leading-lg text-foreground font-medium", titleClass), children: title }) })), hasCardContent(description) && (_jsx(HeroUICard.Description, { ...props.descriptionProps?.herouiNativeProps, className: descriptionClass, style: descriptionStyle, children: _jsx(TextClassContext.Provider, { value: cn("text-base text-muted", descriptionClass), children: description }) }))] })) })), hasCardContent(content) && (_jsx(HeroUICard.Body, { ...props.contentProps?.herouiNativeProps, className: cn(props.contentClassName, props.contentProps?.className), children: normalizeCardChildren(content) })), normalizeCardChildren(props.children), hasCardContent(footer) && (_jsx(HeroUICard.Footer, { ...props.footerProps?.herouiNativeProps, className: cn("flex-row items-center", props.footerClassName, props.footerProps?.className), children: normalizeCardChildren(footer) }))] }) }));
}
