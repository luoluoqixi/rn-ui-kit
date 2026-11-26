import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Skeleton } from "@heroui/react/skeleton";
export function SkeletonHeroUI({ children, isLoading = true, variant = "shimmer", className, herouiWebProps }) {
    if (!isLoading)
        return _jsx(_Fragment, { children: children });
    return _jsx(Skeleton, { "aria-hidden": "true", ...herouiWebProps, animationType: variant, className: className });
}
