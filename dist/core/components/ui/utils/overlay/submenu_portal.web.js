import { jsx as _jsx } from "react/jsx-runtime";
import * as Context from "@radix-ui/react-context-menu";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { useOverlayPortalContainer } from "./overlay_portal_scope.web";
/** 二级菜单也使用最近弹层的宿主，保持层叠和 modal 的 DOM 归属。 */
export function DropdownSubmenuPortal(props) {
    const container = useOverlayPortalContainer();
    return (_jsx(Dropdown.Portal, { container: container, forceMount: props.forceMount, children: _jsx(Dropdown.SubContent, { ...props }) }));
}
export function ContextSubmenuPortal(props) {
    const container = useOverlayPortalContainer();
    return (_jsx(Context.Portal, { container: container, forceMount: props.forceMount, children: _jsx(Context.SubContent, { ...props }) }));
}
