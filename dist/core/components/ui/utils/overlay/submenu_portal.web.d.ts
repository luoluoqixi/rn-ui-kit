import * as Context from "@radix-ui/react-context-menu";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";
/** 二级菜单也使用最近弹层的宿主，保持层叠和 modal 的 DOM 归属。 */
export declare function DropdownSubmenuPortal(props: ComponentProps<typeof Dropdown.SubContent>): import("react").JSX.Element;
export declare function ContextSubmenuPortal(props: ComponentProps<typeof Context.SubContent>): import("react").JSX.Element;
