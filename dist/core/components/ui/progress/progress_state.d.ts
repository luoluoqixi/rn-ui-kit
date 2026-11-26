import type { ProgressProps } from "./types";
/** Normalize both implementations before rendering or animating. */
export declare function resolveProgress({ value, minValue, maxValue, isIndeterminate, valueLabel, formatOptions }: ProgressProps): {
    min: number;
    max: number;
    current: number;
    fraction: number;
    isIndeterminate: boolean;
    valueText: string | undefined;
};
