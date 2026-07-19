import type { ToggleGroupItemProps, ToggleGroupProps } from "./types";
declare function ToggleGroupRoot(props: ToggleGroupProps): import("react").JSX.Element;
declare function ToggleGroupItem(props: ToggleGroupItemProps): import("react").JSX.Element;
export declare const ToggleGroup: typeof ToggleGroupRoot & {
    Item: typeof ToggleGroupItem;
};
export {};
