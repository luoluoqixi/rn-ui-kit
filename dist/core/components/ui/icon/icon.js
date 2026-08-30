import { jsx as _jsx } from "react/jsx-runtime";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import * as React from "react";
import { withUniwind } from "uniwind";
function IconImpl({ as: IconComponent, ...props }) {
    return _jsx(IconComponent, { ...props });
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
const iconSizeClasses = {
    default: "size-5",
    "2xs": "size-3",
    "xs": "size-3.5",
    "sm": "size-4",
    "md": "size-5",
    "lg": "size-6",
    "xl": "size-7",
    "2xl": "size-8",
};
function isIconSize(size) {
    return typeof size === "string" && size in iconSizeClasses;
}
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
function Icon({ as: IconComponent, className, size = "default", ...props }) {
    const textClass = React.useContext(TextClassContext);
    const isCustomSize = isIconSize(size);
    return (_jsx(StyledIcon, { as: IconComponent, className: cn("text-foreground size-5", textClass, isCustomSize ? iconSizeClasses[size] : undefined, className), ...(isCustomSize || size == null ? props : { ...props, size }) }));
}
export { Icon };
