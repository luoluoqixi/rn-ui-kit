import { jsx as _jsx } from "react/jsx-runtime";
import { ScrollShadow } from "@heroui/react/scroll-shadow";
export function ScrollShadowHeroUI(p) {
    return _jsx(ScrollShadow, { ...p.herouiWebProps, className: p.className, size: p.size ?? 40, orientation: p.orientation, visibility: p.isEnabled === false ? "none" : p.visibility, isEnabled: p.isEnabled, hideScrollBar: p.hideScrollBar, children: p.children });
}
