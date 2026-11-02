import type { ContextMenuProps } from "./types";
/** 宿主原生菜单保留与自定义菜单相同的触发和生命周期回调。 */
export declare function ContextMenuHost({ items, itemProps, trigger, triggerProps, children, onOpenChange, onOpenWillChange, ...props }: ContextMenuProps): import("react").JSX.Element;
