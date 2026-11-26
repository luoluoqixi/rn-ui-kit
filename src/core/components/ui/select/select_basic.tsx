import { forwardRef } from "react";
import { SelectHeroUI } from "./select_heroui";
import type { SelectHandle, SelectProps } from "./types";
export const SelectBasic = forwardRef<SelectHandle, SelectProps>(function SelectBasic(props, ref) {
  return <SelectHeroUI {...props} ref={ref} />;
});
