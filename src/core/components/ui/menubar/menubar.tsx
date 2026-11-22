import { MenubarHeroUI } from "./menubar_heroui";
import type { MenubarProps } from "./types";

export function Menubar(props: MenubarProps) {
  return <MenubarHeroUI {...props} />;
}
