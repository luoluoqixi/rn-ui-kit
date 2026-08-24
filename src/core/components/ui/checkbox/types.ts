import type { ComponentProps } from "react";
import type * as CheckboxPrimitive from "@rn-primitives/checkbox";

import type { IconProps } from "../icon";
import type { NativeHapticsSetting, RenderProp } from "../utils";

type PrimitiveCheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

export type CheckboxRenderContext = {
  card: boolean;
  checked: boolean;
  disabled?: boolean;
};

export type CheckboxProps = Omit<PrimitiveCheckboxProps, "checked" | "onCheckedChange"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkedClassName?: string;
  indicatorClassName?: string;
  indicatorProps?: ComponentProps<typeof CheckboxPrimitive.Indicator>;
  iconClassName?: string;
  iconProps?: Omit<IconProps, "as">;
  nativeHaptics?: NativeHapticsSetting;
  label?: RenderProp<CheckboxRenderContext>;
  description?: RenderProp<CheckboxRenderContext>;
  labelPosition?: "left" | "right";
  card?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};
