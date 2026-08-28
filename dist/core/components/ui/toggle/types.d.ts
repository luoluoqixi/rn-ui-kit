import type { ComponentProps } from "react";
import type * as TogglePrimitive from "@rn-primitives/toggle";
import type { NativeHapticsSetting, RenderProp } from "../utils";
export type ToggleRenderContext = {
    disabled?: boolean;
    pressed?: boolean;
};
export type ToggleProps = ComponentProps<typeof TogglePrimitive.Root> & {
    nativeHaptics?: NativeHapticsSetting;
    size?: "default" | "sm" | "lg";
    title?: RenderProp<ToggleRenderContext>;
    variant?: "default" | "outline";
};
