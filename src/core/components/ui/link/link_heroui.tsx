import { Link } from "@heroui/react/link";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { cn } from "../utils/cn";
import type { LinkProps } from "./types";
export function LinkHeroUI({
  children,
  href,
  size = "md",
  isDisabled,
  onPress,
  target,
  rel,
  className,
  labelClassName,
  herouiWebProps,
}: LinkProps) {
  const classes = cn(
    "text-accent",
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base",
    className,
    labelClassName,
  );
  const font = useDefaultTextStyle(undefined, classes);
  const webStyle = herouiWebProps?.style;
  return (
    <Link
      {...herouiWebProps}
      href={href}
      isDisabled={isDisabled}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={classes}
      style={
        typeof webStyle === "function"
          ? (state) => ({ ...textWebStyle(font), ...webStyle(state) })
          : { ...textWebStyle(font), ...webStyle }
      }
      onPress={(event) => {
        if (isDisabled) return;
        herouiWebProps?.onPress?.(event);
        onPress?.();
      }}
    >
      {children}
    </Link>
  );
}
