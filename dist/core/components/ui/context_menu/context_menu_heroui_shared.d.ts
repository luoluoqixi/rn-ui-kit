import type { MenuEntry } from "../menu/types";
import type { ContextMenuProps } from "./types";
export declare function useContextMenuModel(p: ContextMenuProps): {
    disabled: boolean;
    trigger: import("react").JSX.Element;
    items: MenuEntry[];
    open: boolean;
    setOpen: (next: boolean) => void;
    close: () => void;
};
