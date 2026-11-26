import type { TooltipProps } from "./types";
/** Native intentionally preserves the child without adding touch or focus handlers. */
export function TooltipHeroUI({ children }: TooltipProps) { return <>{children}</>; }
