import { jsx as _jsx } from "react/jsx-runtime";
import { Typography } from "heroui-native/text";
import { useContext } from "react";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
import { textClassName } from "./text_classes";
import { TextClassContext } from "./text_context";
export function TextHeroUI({ herouiNativeProps, herouiWebProps: _, className, style, type, color, align, weight, ...props }) {
    const inherited = useContext(TextClassContext);
    const classes = textClassName({ type, color, align, weight, className }, inherited, true);
    const fontStyle = useDefaultTextStyle([style, herouiNativeProps?.style], cn(type === "code" && "font-mono", classes));
    if (type === "h1" || type === "h2" || type === "h3" || type === "h4" || type === "h5" || type === "h6") {
        return _jsx(Typography.Heading, { ...props, ...herouiNativeProps, type: type, color: color, align: align, weight: weight, className: classes, style: fontStyle });
    }
    return _jsx(Typography, { ...props, ...herouiNativeProps, type: type, color: color, align: align, weight: weight, className: classes, style: fontStyle });
}
