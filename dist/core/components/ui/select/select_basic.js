import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { SelectHeroUI } from "./select_heroui";
export const SelectBasic = forwardRef(function SelectBasic(props, ref) {
    return _jsx(SelectHeroUI, { ...props, ref: ref });
});
