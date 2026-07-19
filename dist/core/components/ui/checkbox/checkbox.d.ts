import type { CheckboxIndicatorProps, CheckboxProps } from "./types";
declare function CheckboxRoot(props: CheckboxProps): import("react").JSX.Element;
declare function CheckboxIndicator(props: CheckboxIndicatorProps): import("react").JSX.Element;
export declare const Checkbox: typeof CheckboxRoot & {
    Indicator: typeof CheckboxIndicator;
};
export {};
