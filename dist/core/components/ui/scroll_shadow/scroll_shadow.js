import { jsx as _jsx } from "react/jsx-runtime";
import { ScrollShadowHeroUI } from "./scroll_shadow_heroui";
import { normalizeSlotText } from "../utils/slot_content";
export function ScrollShadow(props) { return _jsx(ScrollShadowHeroUI, { ...props, children: normalizeSlotText(props.children) }); }
