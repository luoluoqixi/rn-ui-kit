import type { Skeleton as NativeSkeleton } from "heroui-native/skeleton";
import type { Skeleton as WebSkeleton } from "@heroui/react/skeleton";
import type { ComponentProps, ReactNode } from "react";
export type SkeletonProps = {
  children?: ReactNode;
  isLoading?: boolean;
  variant?: "shimmer" | "pulse" | "none";
  /** Placeholder classes only; loaded content keeps its own layout. */
  className?: string;
  herouiNativeProps?: Omit<ComponentProps<typeof NativeSkeleton>, "children" | "className" | "isLoading" | "variant">;
  herouiWebProps?: Omit<ComponentProps<typeof WebSkeleton<"div">>, "children" | "className" | "animationType">;
};
