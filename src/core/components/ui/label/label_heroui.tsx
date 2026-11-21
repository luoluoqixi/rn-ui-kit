import { Label } from "@heroui/react/label";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
import type { LabelProps } from "./types";
export function LabelHeroUI({ children, className, textClassName, nativeID, htmlFor, isRequired, isInvalid, isDisabled, herouiWebProps, textProps }: LabelProps) {
  const classes = cn(className, textClassName, textProps?.className);
  const font = StyleSheet.flatten(useDefaultTextStyle(undefined, classes));
  return <Label id={nativeID} {...herouiWebProps} htmlFor={htmlFor} isRequired={isRequired} isInvalid={isInvalid} isDisabled={isDisabled}
    className={classes} style={{ fontFamily: font?.fontFamily, ...herouiWebProps?.style }}>{children}</Label>;
}
