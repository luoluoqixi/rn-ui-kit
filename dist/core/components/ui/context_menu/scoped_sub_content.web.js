import { jsx as _jsx } from "react/jsx-runtime";
import { Slot } from "@rn-primitives/slot";
import { Pressable } from "react-native";
import { ContextSubmenuPortal } from "../utils/overlay/submenu_portal.web";
// 保留 primitive 的双层结构：Radix 管理 DOM 焦点与样式，RN 内层处理 RN props。
export function ScopedSubContent({ asChild = false, forceMount, ref, ...props }) {
    const Component = asChild ? Slot : Pressable;
    return (_jsx(ContextSubmenuPortal, { forceMount: forceMount, style: { zIndex: 50 }, children: _jsx(Component, { ref: ref, ...props }) }));
}
