import { Surface } from "@heroui/react/surface";
import type { SurfaceProps } from "./types";
export function SurfaceHeroUI(p: SurfaceProps) {
  return <Surface {...p.herouiWebProps} variant={p.variant} className={p.className}>{p.children}</Surface>;
}
