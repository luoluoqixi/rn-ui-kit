import type { SelectItemData, SelectItemGroupData } from "./types";
export type ResolvedSelectItemData = SelectItemData & {
    groupKey: string;
    index: number;
    isFirstInGroup: boolean;
    isLastInGroup: boolean;
};
export type ResolvedSelectItemGroupData = Omit<SelectItemGroupData, "items" | "key"> & {
    key: string;
    items: ResolvedSelectItemData[];
};
export declare function resolveSelectItemGroups(options: {
    itemGroups?: SelectItemGroupData[];
    items?: SelectItemData[];
    options?: SelectItemData[];
}): ResolvedSelectItemGroupData[];
