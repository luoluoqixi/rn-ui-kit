import type { ContextMenuItemData } from "./types";
import type { DropdownItemData } from "../dropdown/types";
import type { MenuAdapterItem } from "../menu/menu_adapter_types";
export type NativeMenuItem = {
    /** 单次菜单树内唯一的透明 ID，宿主应原样返回；value 保留调用方的业务标识。 */
    id?: string;
    value?: string;
    text: string;
    subtitle?: string;
    destructive?: boolean;
    /** 仅显示提示文字，不自动注册系统快捷键。 */
    shortcut?: string;
    iconProps?: Readonly<Record<string, unknown>>;
    hostData?: Readonly<Record<string, unknown>>;
    shouldCloseOnSelect?: boolean;
    disabled?: boolean;
    checked?: boolean;
    separator?: boolean;
    subMenu?: NativeMenuItem[];
    onSelect?(): void | Promise<void>;
};
/** 将组件数据转换为宿主原生菜单的稳定契约，不携带 React 元素。 */
export declare function createNativeMenuItems(items: (ContextMenuItemData | DropdownItemData)[], itemProps?: Record<string, unknown>, parentDisabled?: boolean, options?: {
    kind?: "context-menu" | "dropdown";
    isCurrent?: () => boolean;
}, path?: string): MenuAdapterItem[];
