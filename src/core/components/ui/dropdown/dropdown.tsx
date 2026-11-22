import { Platform } from "react-native";
import { DropdownNative } from "./dropdown_native";
import { DropdownHeroUI } from "./dropdown_heroui";
import type { DropdownProps } from "./types";

export function Dropdown({ native = Platform.OS !== "web", ...props }: DropdownProps) {
  return native && Platform.OS !== "web" ? <DropdownNative {...props} /> : <DropdownHeroUI {...props} />;
}
