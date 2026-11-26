import type { SliderProps, SliderValue } from "./types";
export declare function resolveSliderValues(value: SliderValue | undefined): number[] | undefined;
export declare function resolveSliderFirstValue(value: SliderValue | undefined, fallback: number): number;
export declare function sliderBounds(minValue?: number, maxValue?: number, step?: number): {
    min: number;
    max: number;
    nativeStep: number;
    step: number;
};
export declare function normalizeSliderValues(value: SliderValue | undefined, min: number, max: number, step: number): number[];
export declare function useSliderState<T extends SliderValue>(p: SliderProps<T>, custom: boolean): {
    values: number[];
    min: number;
    max: number;
    step: number;
    nativeStep: number;
    change(next: SliderValue): void;
    end(next: SliderValue): void;
};
