import { Icon } from "../icon";
import { toggleVariants } from "../toggle";
import { type NativeHapticsSetting } from "../utils";
import { type RenderProp } from "../utils/render";
import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import type { ToggleGroupItemRenderContext, ToggleGroupProps } from "./types";
declare function ToggleGroup({ className, variant, size, nativeHaptics, children, items, ...props }: ToggleGroupProps): React.JSX.Element;
declare function ToggleGroupItem({ className, children, variant, size, isFirst, isLast, nativeHaptics, title, onPress, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants> & {
    isFirst?: boolean;
    isLast?: boolean;
    nativeHaptics?: NativeHapticsSetting;
    title?: RenderProp<ToggleGroupItemRenderContext>;
}): React.JSX.Element;
declare function ToggleGroupIcon({ className, ...props }: React.ComponentProps<typeof Icon>): React.JSX.Element;
declare const ToggleGroupComponent: typeof ToggleGroup & {
    Icon: typeof ToggleGroupIcon;
    Item: typeof ToggleGroupItem;
    Root: typeof ToggleGroup;
};
export { ToggleGroupComponent as ToggleGroup };
