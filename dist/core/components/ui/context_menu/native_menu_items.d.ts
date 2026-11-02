import type { ContextMenuItemData } from "./types";
import type { DropdownItemData } from "../dropdown/types";
export type NativeMenuItem = {
    text: string;
    disabled?: boolean;
    checked?: boolean;
    separator?: boolean;
    subMenu?: NativeMenuItem[];
    onSelect?(): void | Promise<void>;
};
/** 将组件数据转换为宿主原生菜单的稳定契约，不携带 React 元素。 */
export declare function createNativeMenuItems(items: (ContextMenuItemData | DropdownItemData)[], itemProps?: Record<string, unknown>, parentDisabled?: boolean): NativeMenuItem[];
