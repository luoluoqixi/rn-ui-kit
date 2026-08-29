import type { ComponentProps, ReactNode } from "react";
import type * as RadioGroupPrimitive from "@rn-primitives/radio-group";

import type { NativeHapticsSetting, RenderProp } from "../utils";

export type RadioGroupItemRenderContext = {
  checked: boolean;
  disabled?: boolean;
  value: string;
};

export type RadioGroupSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface RadioGroupItemData {
  "aria-label"?: string;
  "description"?: RenderProp<RadioGroupItemRenderContext>;
  "descriptionClassName"?: string;
  "disabled"?: boolean;
  "label"?: RenderProp<RadioGroupItemRenderContext>;
  "labelClassName"?: string;
  "labelPosition"?: "left" | "right";
  "size"?: RadioGroupSize;
  "itemProps"?: Omit<RadioGroupItemProps, "value" | "label" | "description">;
  "value": string;
}

export type RadioGroupItemProps = Omit<
  ComponentProps<typeof RadioGroupPrimitive.Item>,
  "children"
> & {
  description?: RenderProp<RadioGroupItemRenderContext>;
  descriptionClassName?: string;
  indicatorProps?: ComponentProps<typeof RadioGroupPrimitive.Indicator>;
  indicatorClassName?: string;
  label?: RenderProp<RadioGroupItemRenderContext>;
  labelClassName?: string;
  labelPosition?: "left" | "right";
  nativeHaptics?: NativeHapticsSetting;
  size?: RadioGroupSize;
  containerClassName?: string;
};

export type RadioGroupProps = Omit<
  ComponentProps<typeof RadioGroupPrimitive.Root>,
  "children" | "onValueChange" | "value"
> & {
  children?: ReactNode;
  defaultValue?: string;
  items?: RadioGroupItemData[];
  itemProps?: Omit<RadioGroupItemProps, "value" | "label" | "description">;
  labelPosition?: "left" | "right";
  nativeHaptics?: NativeHapticsSetting;
  size?: RadioGroupSize;
  onValueChange?: (value: string) => void;
  value?: string;
};
