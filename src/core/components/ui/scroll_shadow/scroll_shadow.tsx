import { ScrollShadowHeroUI } from "./scroll_shadow_heroui";
import { normalizeSlotText } from "../utils/slot_content";
import type { ScrollShadowProps } from "./types";
export function ScrollShadow(props: ScrollShadowProps) { return <ScrollShadowHeroUI {...props}>{normalizeSlotText(props.children)}</ScrollShadowHeroUI>; }
