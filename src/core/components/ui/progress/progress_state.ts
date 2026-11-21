import type { ProgressProps } from "./types";

/** Normalize both implementations before rendering or animating. */
export function resolveProgress({ value = 0, minValue = 0, maxValue = 100, isIndeterminate = false, valueLabel, formatOptions }: ProgressProps) {
  let min = Number.isFinite(minValue) ? minValue : 0;
  let max = Number.isFinite(maxValue) ? maxValue : 100;
  if (max <= min || !Number.isFinite(max - min)) { min = 0; max = 100; }
  const current = Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  const fraction = (current - min) / (max - min);
  const valueText = isIndeterminate ? valueLabel : valueLabel ?? new Intl.NumberFormat(undefined, { style: "percent", ...formatOptions }).format(formatOptions?.style && formatOptions.style !== "percent" ? current : fraction);
  return { min, max, current, fraction, isIndeterminate, valueText };
}
