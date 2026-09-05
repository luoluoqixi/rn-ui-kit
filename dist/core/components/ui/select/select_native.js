import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { SelectDropdown } from "./select_dropdown";
/** Native default router. Platform files provide the concrete picker implementation. */
export const SelectNative = React.forwardRef(function SelectNative(props, ref) {
    return _jsx(SelectDropdown, { ...props, ref: ref });
});
