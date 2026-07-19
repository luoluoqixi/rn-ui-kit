import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { H2, Paragraph, Card as TamaguiCard, View } from "tamagui";
import { useAppBackgroundColors } from "../utils/theme";
function CardRoot(props) {
    const { backgroundContent, backgroundProps, children, description, footer, footerProps, header, headerProps, contentProps, style, title, ...rootProps } = props;
    const hasHeader = header != null || title != null || description != null;
    const appBackgroundColors = useAppBackgroundColors();
    return (_jsxs(TamaguiCard, { size: "$4", borderWidth: 1, borderColor: "$borderColor", ...rootProps, style: [{ backgroundColor: appBackgroundColors.card }, style], children: [hasHeader ? (_jsx(CardHeader, { p: "$4", ...headerProps, children: header ?? (_jsxs(_Fragment, { children: [title != null ? _jsx(H2, { fontWeight: "600", children: title }) : null, description != null ? (_jsx(Paragraph, { color: "$color", opacity: 0.6, children: description })) : null] })) })) : null, _jsx(View, { px: "$4", pb: "$4", ...contentProps, children: children }), footer != null ? (_jsx(CardFooter, { p: "$4", ...footerProps, children: footer })) : null, backgroundContent != null ? (_jsx(CardBackground, { items: "center", ...backgroundProps, children: backgroundContent })) : null] }));
}
function CardHeader(props) {
    return _jsx(TamaguiCard.Header, { ...props });
}
function CardFooter(props) {
    return _jsx(TamaguiCard.Footer, { ...props });
}
function CardBackground(props) {
    return _jsx(TamaguiCard.Background, { ...props });
}
export const Card = Object.assign(CardRoot, {
    Header: CardHeader,
    Footer: CardFooter,
    Background: CardBackground,
});
