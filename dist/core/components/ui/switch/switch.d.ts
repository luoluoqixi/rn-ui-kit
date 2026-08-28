import * as React from "react";
import type { SwitchProps } from "./types";
declare function Switch({ className, containerClassName, defaultChecked, label, labelClassName, labelPosition, native, nativeComposeProps, nativeHaptics, nativeSwiftProps, onCheckedChange, ...props }: SwitchProps): React.JSX.Element;
declare const SwitchComponent: typeof Switch & {
    Root: typeof Switch;
};
export { SwitchComponent as Switch };
