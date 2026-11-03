import type * as Primitive from "@rn-primitives/dropdown-menu";
import type { ComponentProps } from "react";
import { Slot } from "@rn-primitives/slot";
import { Pressable } from "react-native";
import { DropdownSubmenuPortal } from "../utils/overlay/submenu_portal.web";

// 保留 primitive 的双层结构：Radix 管理 DOM 焦点与样式，RN 内层处理 RN props。
export function ScopedSubContent({
  asChild = false,
  forceMount,
  ref,
  ...props
}: ComponentProps<typeof Primitive.SubContent>) {
  const Component = asChild ? Slot : Pressable;
  return (
    <DropdownSubmenuPortal forceMount={forceMount} style={{ zIndex: 50 }}>
      <Component ref={ref} {...props} />
    </DropdownSubmenuPortal>
  );
}
