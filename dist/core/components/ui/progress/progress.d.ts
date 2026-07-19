import type { ProgressIndicatorProps, ProgressProps } from "./types";
declare function ProgressRoot(props: ProgressProps): import("react").JSX.Element;
declare function ProgressIndicator(props: ProgressIndicatorProps): import("react").JSX.Element;
export declare const Progress: typeof ProgressRoot & {
    Indicator: typeof ProgressIndicator;
};
export {};
