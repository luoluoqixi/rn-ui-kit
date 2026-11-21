import { Spinner } from "heroui-native/spinner";
import { useContext } from "react";
import { withUniwind } from "uniwind";
import { TextClassContext } from "../text/text_context";
import { cn } from "../utils/cn";
import type { SpinnerProps } from "./types";

const StyledSpinner = withUniwind(Spinner, { color: { fromClassName: "className", styleProperty: "color" } });
export function SpinnerHeroUI({ size, color = "accent", isLoading = true, className, accessibilityLabel = "加载中", herouiNativeProps, indicatorProps }: SpinnerProps) {
  const inherited = useContext(TextClassContext);
  if (!isLoading) return null;
  return <StyledSpinner {...herouiNativeProps} size={typeof size === "number" ? undefined : size}
    color={color === "current" ? undefined : color === "accent" ? "default" : color}
    isLoading accessibilityLabel={herouiNativeProps?.accessibilityLabel ?? accessibilityLabel}
    className={cn(color === "current" && "text-foreground", color === "current" && inherited, className)}
    style={[typeof size === "number" ? { width: size, height: size } : undefined, herouiNativeProps?.style]}>
    <Spinner.Indicator {...indicatorProps?.herouiNativeProps} iconProps={{
      ...(typeof size === "number" ? { width: size, height: size } : {}), ...indicatorProps?.herouiNativeProps?.iconProps,
    }} />
  </StyledSpinner>;
}
