import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../utils/cn";
import * as SeparatorPrimitive from "@rn-primitives/separator";
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
    return (_jsx(SeparatorPrimitive.Root, { decorative: decorative, orientation: orientation, className: cn("bg-border shrink-0", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className), ...props }));
}
export { Separator };
