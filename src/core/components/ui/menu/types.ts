import type { ComponentProps, KeyboardEventHandler, ReactNode } from "react";
import type { Menu } from "heroui-native/menu";
import type { Dropdown } from "@heroui/react/dropdown";

/** Internal, resolved menu model. Public/native item APIs are adapted at the boundary. */
export type MenuEntry = {
  value: string;
  label?: ReactNode;
  textValue: string;
  icon?: ReactNode;
  reserveIconSpace?: boolean;
  subtitle?: string;
  shortcut?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
  separatorVariant?: "thin" | "thick";
  selected?: boolean;
  checkbox?: boolean;
  indicator?: ReactNode;
  selectionIndicatorPosition?: "left" | "right";
  selectionIndicatorVariant?: "checkmark" | "dot";
  shouldCloseOnSelect?: boolean;
  subMenu?: MenuEntry[];
  subMenuTitle?: ReactNode | false;
  onAction?: () => void;
  herouiNativeProps?: Omit<ComponentProps<typeof Menu.Item>, "children" | "id" | "onPress">;
  herouiWebProps?: Omit<ComponentProps<typeof Dropdown.Item>, "children" | "id" | "onAction">;
};

export type MenuContentProps = {
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  /** Cross-axis alignment. Vertical menus default to Native center / Web start. */
  align?: "start" | "center" | "end";
  sideOffset?: number;
  /** Scrollable content height in logical pixels; defaults to 320. */
  maxHeight?: number;
  herouiNativeProps?: Omit<Extract<ComponentProps<typeof Menu.Content>, { presentation: "popover" }>, "children" | "presentation">;
  herouiWebProps?: Omit<ComponentProps<typeof Dropdown.Popover>, "children">;
};

export type MenuSurfaceProps = {
  items: MenuEntry[];
  contentProps?: MenuContentProps;
  accessibilityLabel?: string;
  /** Menubar owns top-level focus and keeps sibling triggers interactive. */
  isNonModal?: boolean;
  /** Internal ownership marker for Menubar's non-modal outside dismissal. */
  menubarOwner?: string;
  onKeyDownCapture?: KeyboardEventHandler<HTMLDivElement>;
};
