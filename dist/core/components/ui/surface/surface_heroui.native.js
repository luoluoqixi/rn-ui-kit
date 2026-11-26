import { jsx as _jsx } from "react/jsx-runtime";
import { Surface } from "heroui-native/surface";
export function SurfaceHeroUI(p) {
    return _jsx(Surface, { ...p.herouiNativeProps, variant: p.variant, className: p.className, children: p.children });
}
