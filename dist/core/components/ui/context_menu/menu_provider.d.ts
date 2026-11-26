import { type ReactNode } from "react";
import type { NativeMenuItem } from "./native_menu_items";
import type { MenuAdapter } from "../menu/menu_adapter_types";
export type * from "../menu/menu_adapter_types";
export type NativeMenuRequest = {
    items: NativeMenuItem[];
    x: number;
    y: number;
    isCurrent?(): boolean;
};
export type MenuConfig = {
    /** Web 菜单及子菜单的高度上限；不提供时保留组件默认高度。 */
    webContentMaxHeight?: string;
    /** 默认 ContextMenu renderer；接入 menuAdapter 后也用于 Web Dropdown 的默认选择。 */
    native?: boolean;
    /** Web 的通用外部菜单适配器，同时适用于 ContextMenu 和 Dropdown。 */
    menuAdapter?: MenuAdapter | false;
    /** 兼容旧 Web ContextMenu 接口；Promise 完成视为关闭，不会自动用于 Dropdown。 */
    showNativeMenu?(request: NativeMenuRequest): Promise<void>;
    onNativeMenuError?(error: unknown): void;
};
export declare function MenuProvider({ value, children, }: {
    value: MenuConfig;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useMenuConfig(): MenuConfig;
/** 显式关闭始终优先；无适配器时继续回落到原有 HeroUI 渲染。 */
export declare function resolveMenuAdapter(config: MenuConfig, local?: MenuAdapter | false): MenuAdapter | undefined;
