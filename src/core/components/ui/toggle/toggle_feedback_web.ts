import type { ToggleProps } from "./types";

/** Override the group's no-scale rule without changing its color or focus states. */
export function toggleWebScaleClassName(isScaleDisabled: boolean | undefined, size: ToggleProps["size"]) {
  const press = isScaleDisabled
    ? "active:transform-none! data-[pressed=true]:transform-none!"
    : size === "sm"
      ? "active:transform-[scale(0.98)]! data-[pressed=true]:transform-[scale(0.98)]!"
      : size === "lg"
        ? "active:transform-[scale(0.96)]! data-[pressed=true]:transform-[scale(0.96)]!"
        : "active:transform-[scale(0.97)]! data-[pressed=true]:transform-[scale(0.97)]!";
  return `${press} motion-reduce:transform-none!`;
}
