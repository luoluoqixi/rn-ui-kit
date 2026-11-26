import type { MenubarMenuData, MenubarProps } from "./types";
export declare function useMenubarModel(p: MenubarProps): {
    value: string | undefined;
    enabled: MenubarMenuData[];
    tabStop: string;
    setActive: import("react").Dispatch<import("react").SetStateAction<string>>;
    select: (next: string | undefined) => void;
    change: (item: MenubarMenuData, open: boolean) => void;
    entries: (menu: MenubarMenuData) => import("../menu/types").MenuEntry[];
};
export type MenubarModel = ReturnType<typeof useMenubarModel>;
