import type { ToggleGroupProps } from "./types";

export function resolveToggleGroupLayout(p: Pick<ToggleGroupProps, "gap" | "isDetached" | "isScaleDisabled">) {
  const requestedGap = p.gap ?? (p.isDetached ? 8 : 0);
  const gap = Number.isFinite(requestedGap) ? Math.max(0, requestedGap) : 0;
  return { gap, isDetached: gap > 0, isScaleDisabled: p.isScaleDisabled ?? gap === 0 };
}
