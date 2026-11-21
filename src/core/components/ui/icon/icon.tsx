import { TextClassContext } from "../text";
import { cn } from "../utils/cn";

import type { LucideProps } from "lucide-react-native";
import type { IconColor, IconProps, IconSize } from "./types";
import * as React from "react";
import { withUniwind } from "uniwind";

type StyledIconProps = Omit<IconProps, "size" | "color"> & Pick<LucideProps, "size" | "color">;

function IconImpl({ as: IconComponent, ...props }: StyledIconProps) {
  return <IconComponent {...props} />;
}

const StyledIcon = withUniwind(IconImpl, {
  size: {
    fromClassName: "className",
    styleProperty: "width",
  },
  color: {
    fromClassName: "className",
    styleProperty: "color",
  },
});

const iconSizeClasses: Record<IconSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};
const iconColorClasses: Record<IconColor, string> = {
  inherit: "",
  foreground: "text-foreground",
  muted: "text-muted",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

/**
 * Lucide icons with HeroUI semantic colors and Uniwind utilities.
 * Inherits the library container's text color, falling back to foreground.
 * Classes override semantic presets; raw color and numeric size override classes.
 * Preset sizes are library conveniences, not an official HeroUI Icon API.
 * @example
 * ```tsx
 * import { ArrowRight } from 'lucide-react-native';
 * import { Icon } from 'rn-ui-kit/core';
 *
 * <Icon as={ArrowRight} size="sm" color="accent" />
 * <Icon as={ArrowRight} className="size-4 text-muted" />
 * ```
 */
function Icon({
  as: IconComponent,
  className,
  size = "md",
  color = "inherit",
  ...props
}: IconProps) {
  const textClass = React.useContext(TextClassContext);
  const semanticColor = typeof color === "string" && Object.hasOwn(iconColorClasses, color);
  return (
    <StyledIcon
      as={IconComponent}
      className={cn(
        "text-foreground size-5",
        textClass,
        typeof size === "string" ? iconSizeClasses[size] : undefined,
        semanticColor ? iconColorClasses[color as IconColor] : undefined,
        className,
      )}
      {...props}
      size={typeof size === "number" ? size : undefined}
      color={semanticColor ? undefined : color}
    />
  );
}

export { Icon };
