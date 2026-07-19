import type { RadioGroupIndicatorProps, RadioGroupItemProps, RadioGroupProps } from "./types";
declare function RadioGroupRoot(props: RadioGroupProps): import("react").JSX.Element;
declare function RadioGroupItem(props: RadioGroupItemProps): import("react").JSX.Element;
declare function RadioGroupIndicator(props: RadioGroupIndicatorProps): import("react").JSX.Element;
export declare const RadioGroup: typeof RadioGroupRoot & {
    Item: typeof RadioGroupItem;
    Indicator: typeof RadioGroupIndicator;
};
export {};
