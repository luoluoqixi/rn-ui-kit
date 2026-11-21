import type { ReactNode } from "react";
import { Text } from "../text";
import { cn } from "../utils/cn";
import type { SwitchProps } from "./types";

/** Only plain labels receive automatic text wrapping; custom layouts stay intact. */
export function SwitchLabel({ content, labelProps, labelClassName }: Pick<SwitchProps, "labelProps" | "labelClassName"> & { content: ReactNode }) {
  if (typeof content !== "string" && typeof content !== "number") return content;
  return <Text {...labelProps} className={cn("font-medium", labelProps?.className, labelClassName)}>{content}</Text>;
}
