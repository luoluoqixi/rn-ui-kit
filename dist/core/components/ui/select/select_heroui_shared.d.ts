import { type ForwardedRef } from "react";
import type { SelectHandle, SelectProps } from "./types";
export declare function useHeroSelect(p: SelectProps, ref: ForwardedRef<SelectHandle>): {
    value: string | undefined;
    selected: import("./types").SelectItemData | undefined;
    disabled: boolean;
    setValue: (next: string | null) => void;
    groups: import("./select_grouping").ResolvedSelectItemGroupData[];
    option: {
        value: string;
        label: string;
    } | undefined;
    open: boolean;
    setOpen: (next: boolean) => void;
    close: () => void;
};
