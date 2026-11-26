import { jsx as _jsx } from "react/jsx-runtime";
import { Label } from "@heroui/react/label";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
export function LabelHeroUI({ children, className, textClassName, nativeID, htmlFor, isRequired, isInvalid, isDisabled, herouiWebProps, textProps }) {
    const classes = cn(className, textClassName, textProps?.className);
    const font = StyleSheet.flatten(useDefaultTextStyle(undefined, classes));
    return _jsx(Label, { id: nativeID, ...herouiWebProps, htmlFor: htmlFor, isRequired: isRequired, isInvalid: isInvalid, isDisabled: isDisabled, className: classes, style: { fontFamily: font?.fontFamily, ...herouiWebProps?.style }, children: children });
}
