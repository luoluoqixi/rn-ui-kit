import { ScrollShadow } from "@heroui/react/scroll-shadow";
import type { ScrollShadowProps } from "./types";
export function ScrollShadowHeroUI(p: ScrollShadowProps) {
  return <ScrollShadow {...p.herouiWebProps} className={p.className} size={p.size ?? 40}
    orientation={p.orientation} visibility={p.isEnabled === false ? "none" : p.visibility}
    isEnabled={p.isEnabled} hideScrollBar={p.hideScrollBar}>{p.children}</ScrollShadow>;
}
