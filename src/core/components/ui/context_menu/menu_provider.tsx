import { createContext, useContext, type ReactNode } from "react";
import type { NativeMenuItem } from "./native_menu_items";

export type NativeMenuRequest = {
  items: NativeMenuItem[];
  x: number;
  y: number;
  isCurrent?(): boolean;
};
export type MenuConfig = {
  /** Web 菜单及子菜单的高度上限；不提供时保留组件默认高度。 */
  webContentMaxHeight?: string;
  /** 默认右键菜单 renderer；未提供时沿用平台默认行为。 */
  native?: boolean;
  /** Web 宿主注入原生菜单能力，基础库不依赖具体桌面壳。 */
  showNativeMenu?(request: NativeMenuRequest): Promise<void>;
  onNativeMenuError?(error: unknown): void;
};
const MenuConfigContext = createContext<MenuConfig>({});
export function MenuProvider({
  value,
  children,
}: {
  value: MenuConfig;
  children: ReactNode;
}) {
  return (
    <MenuConfigContext.Provider value={value}>
      {children}
    </MenuConfigContext.Provider>
  );
}
export function useMenuConfig() {
  return useContext(MenuConfigContext);
}
