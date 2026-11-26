import { jsx as _jsx } from "react/jsx-runtime";
import { SurfaceHeroUI } from "./surface_heroui";
import { normalizeSlotText } from "../utils/slot_content";
export function Surface(props) { return _jsx(SurfaceHeroUI, { ...props, children: normalizeSlotText(props.children) }); }
