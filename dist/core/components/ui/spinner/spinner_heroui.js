import { jsx as _jsx } from "react/jsx-runtime";
import { Spinner } from "@heroui/react/spinner";
import { useContext } from "react";
import { TextClassContext } from "../text/text_context";
import { cn } from "../utils/cn";
const colors = new Set(["accent", "current", "success", "warning", "danger"]);
export function SpinnerHeroUI({ size, color = "accent", isLoading = true, className, accessibilityLabel = "加载中", herouiWebProps }) {
    const inherited = useContext(TextClassContext);
    if (!isLoading)
        return null;
    const semantic = colors.has(color);
    return _jsx(Spinner, { ...herouiWebProps, size: typeof size === "number" ? undefined : size, color: semantic ? color : "current", "aria-label": herouiWebProps?.["aria-label"] ?? accessibilityLabel, className: cn(color === "current" && inherited, className), style: { ...(typeof size === "number" ? { width: size, height: size } : {}),
            ...(!semantic ? { color } : {}), ...herouiWebProps?.style } });
}
