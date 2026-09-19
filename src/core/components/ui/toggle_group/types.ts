import type { ComponentProps, ReactNode } from "react";
import type * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import type { VariantProps } from "class-variance-authority";

import type { NativeHapticsSetting, RenderProp } from "../utils";
import type { toggleVariants } from "../toggle";

export type ToggleGroupItemRenderContext = {
  pressed: boolean;
  value: string;
};

export type ToggleGroupItemData = {
  children?: ReactNode;
  disabled?: boolean;
  itemProps?: Omit<ComponentProps<typeof ToggleGroupPrimitive.Item>, "value" | "children">;
  title?: RenderProp<ToggleGroupItemRenderContext>;
  value: string;
};

export type ToggleGroupProps = Omit<ComponentProps<typeof ToggleGroupPrimitive.Root>, "children"> &
  VariantProps<typeof toggleVariants> & {
    children?: ReactNode;
    items?: ToggleGroupItemData[];
    nativeHaptics?: NativeHapticsSetting;
  };
