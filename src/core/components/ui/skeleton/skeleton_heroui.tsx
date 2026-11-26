import { Skeleton } from "@heroui/react/skeleton";
import type { SkeletonProps } from "./types";
export function SkeletonHeroUI({ children, isLoading = true, variant = "shimmer", className, herouiWebProps }: SkeletonProps) {
  if (!isLoading) return <>{children}</>;
  return <Skeleton aria-hidden="true" {...herouiWebProps} animationType={variant} className={className} />;
}
