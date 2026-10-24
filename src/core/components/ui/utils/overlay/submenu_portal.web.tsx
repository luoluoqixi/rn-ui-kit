import * as Context from "@radix-ui/react-context-menu";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";
import { useOverlayPortalContainer } from "./overlay_portal_scope.web";

/** 二级菜单也使用最近弹层的宿主，保持层叠和 modal 的 DOM 归属。 */
export function DropdownSubmenuPortal(
  props: ComponentProps<typeof Dropdown.SubContent>,
) {
  const container = useOverlayPortalContainer();
  return (
    <Dropdown.Portal container={container} forceMount={props.forceMount}>
      <Dropdown.SubContent {...props} />
    </Dropdown.Portal>
  );
}
export function ContextSubmenuPortal(
  props: ComponentProps<typeof Context.SubContent>,
) {
  const container = useOverlayPortalContainer();
  return (
    <Context.Portal container={container} forceMount={props.forceMount}>
      <Context.SubContent {...props} />
    </Context.Portal>
  );
}
