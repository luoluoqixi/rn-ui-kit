import { jsx as _jsx } from "react/jsx-runtime";
import { Surface } from "@heroui/react/surface";
export function SurfaceHeroUI(p) {
    return _jsx(Surface, { ...p.herouiWebProps, variant: p.variant, className: p.className, children: p.children });
}
