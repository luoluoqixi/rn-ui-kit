import * as React from "react";
import type { SelectHandle, SelectNativeMode, SelectProps } from "./types";
/** The default keeps the browser basic select and uses the native dropdown on mobile. */
export declare const DEFAULT_SELECT_NATIVE: SelectNativeMode;
declare const SelectRoot: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<SelectHandle>>;
export { SelectRoot as Select };
export type { SelectHandle } from "./types";
