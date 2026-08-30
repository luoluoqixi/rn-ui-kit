import * as React from "react";
import { SelectDropdown } from "./select_dropdown";
import type { SelectHandle, SelectProps } from "./types";

/** Native default router. Platform files provide the concrete picker implementation. */
export const SelectNative = React.forwardRef<SelectHandle, SelectProps>(
  function SelectNative(props, ref) {
    return <SelectDropdown {...props} ref={ref} />;
  },
);
