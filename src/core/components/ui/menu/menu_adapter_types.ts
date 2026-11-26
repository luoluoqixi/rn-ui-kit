import type { NativeMenuItem } from "../context_menu/native_menu_items";
import type { MenuContentProps } from "./types";

/** 转换后的菜单快照保证有 ID 与动作；旧 NativeMenuItem 仍允许手工省略它们。 */
export type MenuAdapterItem = Omit<NativeMenuItem, "id" | "subMenu" | "onSelect"> & {
  id: string;
  subMenu?: MenuAdapterItem[];
  onSelect(): Promise<void>;
};

export type MenuAnchorRect = { x: number; y: number; width: number; height: number };

/** 坐标均为当前 Web 视口的 CSS 像素；屏幕坐标、DPI、窗口偏移由宿主转换。 */
export type MenuAdapterRequest = {
  kind: "context-menu" | "dropdown";
  source: "pointer" | "keyboard" | "programmatic";
  items: MenuAdapterItem[];
  anchor: { rect: MenuAnchorRect; point?: { x: number; y: number } };
  /** 建议弹出点；下拉菜单另提供完整锚点和方向，供宿主自行定位。 */
  x: number;
  y: number;
  placement: {
    side: NonNullable<MenuContentProps["side"]>;
    align: NonNullable<MenuContentProps["align"]>;
    sideOffset: number;
  };
  /** 由调用方提供，基础库不解释宿主的主题、图标、窗口等扩展配置。 */
  options?: Readonly<Record<string, unknown>>;
  signal: AbortSignal;
  isCurrent(): boolean;
  /** IPC 返回 ID 的宿主可用此方法派发；回调型宿主也可直接调用 item.onSelect。 */
  select(id: string): Promise<void>;
};

export type MenuAdapterSession = {
  /** 仅在确实观察到关闭时 resolve，包括取消。不要传入只代表“已经显示”的 Promise。 */
  closed?: Promise<void>;
  /** 请求失效时尽力关闭菜单；不支持关闭的宿主可省略。 */
  close?(): void | Promise<void>;
  /** 释放监听器或菜单资源；无 closed 时保留到下次请求或组件卸载。 */
  dispose?(): void | Promise<void>;
};

/** 仅替换 Web 菜单呈现，不依赖某个桌面框架，也不替换 iOS / Android 系统菜单。 */
export type MenuAdapter = {
  open(request: MenuAdapterRequest): MenuAdapterSession | Promise<MenuAdapterSession>;
};

export type MenuAdapterProps = {
  /** 覆盖 Provider；false 仅禁用外部适配器，native=false 始终使用 HeroUI。 */
  menuAdapter?: MenuAdapter | false;
  menuAdapterOptions?: Readonly<Record<string, unknown>>;
};
