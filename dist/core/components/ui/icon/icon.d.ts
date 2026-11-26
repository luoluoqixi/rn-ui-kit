import type { IconProps } from "./types";
import * as React from "react";
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
declare function Icon({ as: IconComponent, className, size, color, ...props }: IconProps): React.JSX.Element;
export { Icon };
