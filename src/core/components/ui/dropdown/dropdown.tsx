import { Platform } from "react-native";
import { DropdownNative } from "./dropdown_native";
import { DropdownHeroUI } from "./dropdown_heroui";
import type { DropdownProps } from "./types";
import { DropdownHost } from "./dropdown_host";
import { resolveMenuAdapter, useMenuConfig } from "../context_menu/menu_provider";

export function Dropdown(p: DropdownProps) {
  const config = useMenuConfig();
  const { native: nativeProp, menuAdapter, menuAdapterOptions, ...props } = p;
  const adapter = resolveMenuAdapter(config, menuAdapter);
  // 不改变移动端默认 renderer；旧 native 配置未曾影响 Dropdown，亦不在此扩展。
  const native = nativeProp ?? (Platform.OS === "web"
    ? !!adapter && config.native !== false : true);
  if (native && Platform.OS !== "web") return <DropdownNative {...props} />;
  if (native && adapter && p.items != null) return <DropdownHost {...p} />;
  return <DropdownHeroUI {...props} />;
}
