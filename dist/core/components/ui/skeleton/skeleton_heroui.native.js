import { jsx as _jsx } from "react/jsx-runtime";
import { Skeleton } from "heroui-native/skeleton";
import { normalizeSlotText } from "../utils/slot_content";
export function SkeletonHeroUI({ children, isLoading = true, variant, className, herouiNativeProps }) {
    return _jsx(Skeleton, { accessibilityElementsHidden: isLoading, importantForAccessibility: isLoading ? "no-hide-descendants" : "auto", ...herouiNativeProps, isLoading: isLoading, variant: variant, className: className, children: normalizeSlotText(children) });
}
