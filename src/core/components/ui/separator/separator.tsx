import { cn } from "../utils/cn";
import * as SeparatorPrimitive from "@rn-primitives/separator";
import { SeparatorProps } from "./types";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
