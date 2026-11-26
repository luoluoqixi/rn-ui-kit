import { Platform } from "react-native";
import { resolveMenuAdapter, useMenuConfig } from "./menu_provider";
import { ContextMenuHost } from "./context_menu_host";
import { ContextMenuNative } from "./context_menu_native";
import { ContextMenuHeroUI } from "./context_menu_heroui";
import type { ContextMenuProps } from "./types";

function ContextMenuRoot(p: ContextMenuProps) {
  const config = useMenuConfig();
  const { menuAdapter, menuAdapterOptions, ...props } = p;
  const adapter = resolveMenuAdapter(config, menuAdapter);
  const native = p.native ?? config.native ?? (adapter ? true : Platform.OS !== "web");
  if (native && Platform.OS !== "web") return <ContextMenuNative {...props} />;
  if (native && (adapter || (menuAdapter !== false && config.menuAdapter !== false && config.showNativeMenu)) && p.items != null && (p.trigger != null || p.children != null))
    return <ContextMenuHost {...p} />;
  return <ContextMenuHeroUI {...props} />;
}

// Compound helpers belong exclusively to the preserved system-native renderer.
// Custom menus use the single-entry items API on both platforms.
export const ContextMenu = Object.assign(ContextMenuRoot, ContextMenuNative, { Root: ContextMenuRoot });
