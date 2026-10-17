import type { IconProps } from "./types";
import * as React from "react";
/**
 * A wrapper component for Lucide icons with Uniwind `className` support via `withUniwind`.
 *
 * This component allows you to render any Lucide icon while applying utility classes
 * using `uniwind`. It avoids the need to wrap or configure each icon individually.
 *
 * @component
 * @example
 * ```tsx
 * import { ArrowRight } from 'lucide-react-native';
 * import { Icon } from '@/registry/uniwind/registry/components/ui/icon';
 *
 * <Icon as={ArrowRight} className="text-red-500 size-4" />
 * ```
 *
 * @param {LucideIcon} as - The Lucide icon component to render.
 * @param {string} className - Utility classes to style the icon using Uniwind.
 * @param {IconSize | string | number} size - One of the standard size names, or a native Lucide size.
 * @param {...LucideProps} ...props - Additional Lucide icon props passed to the "as" icon.
 */
declare function Icon({ as: IconComponent, className, size, ...props }: IconProps): React.JSX.Element;
export { Icon };
