import { Skeleton } from "heroui-native/skeleton";
import { normalizeSlotText } from "../utils/slot_content";
import type { SkeletonProps } from "./types";
export function SkeletonHeroUI({ children, isLoading = true, variant, className, herouiNativeProps }: SkeletonProps) {
  return <Skeleton accessibilityElementsHidden={isLoading} importantForAccessibility={isLoading ? "no-hide-descendants" : "auto"}
    {...herouiNativeProps} isLoading={isLoading} variant={variant} className={className}>
    {normalizeSlotText(children)}
  </Skeleton>;
}
