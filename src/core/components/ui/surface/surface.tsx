import { SurfaceHeroUI } from "./surface_heroui";
import { normalizeSlotText } from "../utils/slot_content";
import type { SurfaceProps } from "./types";
export function Surface(props: SurfaceProps) { return <SurfaceHeroUI {...props}>{normalizeSlotText(props.children)}</SurfaceHeroUI>; }
