import { Surface } from "heroui-native/surface";
import type { SurfaceProps } from "./types";
export function SurfaceHeroUI(p: SurfaceProps) {
  return <Surface {...p.herouiNativeProps} variant={p.variant} className={p.className}>{p.children}</Surface>;
}
