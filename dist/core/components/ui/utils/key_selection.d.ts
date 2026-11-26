/** Keys are strings on both platforms; the Web-only "all" sentinel never escapes. */
export type KeySelectionOptions = {
    /** TagGroup defaults to none; ToggleGroup defaults to single. */
    selectionMode?: "none" | "single" | "multiple";
    selectedKeys?: Iterable<string>;
    defaultSelectedKeys?: Iterable<string>;
    onSelectionChange?: (keys: Set<string>) => void;
    isDisabled?: boolean;
    disabledKeys?: Iterable<string>;
    disallowEmptySelection?: boolean;
};
export declare function useKeySelection(p: KeySelectionOptions, items: readonly {
    id: string;
    isDisabled?: boolean;
}[]): {
    selected: Set<string>;
    disabled: Set<string>;
    change: (keys: Iterable<string | number> | "all") => void;
    toggle: (key: string) => void;
};
