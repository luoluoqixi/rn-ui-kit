import * as React from "react";
import type { RadioGroupItemProps, RadioGroupProps } from "./types";
declare function RadioGroup({ className, nativeHaptics, children, defaultValue, items, itemProps, labelPosition, onValueChange, size, value, disabled, ...props }: RadioGroupProps): React.JSX.Element;
declare function RadioGroupItem({ className, description, descriptionClassName, indicatorClassName, indicatorProps, label, labelClassName, labelPosition, nativeHaptics, containerClassName, onPress, onPressIn, onPressOut, onHoverIn, onHoverOut, value, size, disabled, ...props }: RadioGroupItemProps): React.JSX.Element;
declare const RadioGroupComponent: typeof RadioGroup & {
    Item: typeof RadioGroupItem;
    Root: typeof RadioGroup;
};
export { RadioGroupComponent as RadioGroup };
