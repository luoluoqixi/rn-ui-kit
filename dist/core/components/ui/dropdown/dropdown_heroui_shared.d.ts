import type { DropdownItemData, DropdownProps } from "./types";
import type { MenuEntry } from "../menu/types";
export declare function useDropdownModel(p: DropdownProps): {
    disabled: boolean;
    trigger: import("react").JSX.Element;
    activate: (item: DropdownItemData) => void;
    open: boolean;
    setOpen: (next: boolean) => void;
    close: () => void;
};
/** 外部宿主复用相同的 Button / NativeTrigger 外观，不重新实现列表行入口。 */
export declare function dropdownTrigger(p: DropdownProps, ctx: {
    native: boolean;
    open: boolean;
}, disabled: boolean): import("react").JSX.Element;
export declare function dropdownText(item: DropdownItemData): string;
export declare function dropdownEntries(items: DropdownItemData[], p: DropdownProps, activate: (item: DropdownItemData) => void): MenuEntry[];
