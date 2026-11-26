import type { ComponentProps, ReactNode } from "react";
import type { Button as NativeButton } from "heroui-native/button";
import type { ToggleButton as WebToggle } from "@heroui/react/toggle-button";
import type { FieldSlotProps } from "../utils/field_types";
import type { NativeHapticsSetting } from "../utils/haptics";
import type { RenderProp } from "../utils/render";
export type ToggleSize = "sm" | "md" | "lg";
export type ToggleVariant = "default" | "ghost";
export type ToggleRenderContext = {
    isSelected: boolean;
    isDisabled: boolean;
};
export type ToggleProps = FieldSlotProps<ComponentProps<typeof NativeButton>, ComponentProps<typeof WebToggle>, "size" | "variant" | "isIconOnly" | "isDisabled" | "isSelected" | "defaultSelected" | "onChange" | "onPress" | "accessibilityLabel" | "aria-label" | "accessibilityState" | "aria-pressed"> & {
    children?: ReactNode;
    title?: RenderProp<ToggleRenderContext>;
    isSelected?: boolean;
    defaultSelected?: boolean;
    onSelectedChange?: (selected: boolean) => void;
    isDisabled?: boolean;
    isIconOnly?: boolean;
    accessibilityLabel?: string;
    size?: ToggleSize;
    variant?: ToggleVariant;
    /** Disable only press scaling; highlight/ripple feedback remains available. Defaults to false. */
    isScaleDisabled?: boolean;
    labelClassName?: string;
    nativeHaptics?: NativeHapticsSetting;
};
