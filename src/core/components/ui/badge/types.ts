import type { Chip as NativeChip } from "heroui-native/chip";
import type { Chip as WebChip } from "@heroui/react/chip";
import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react-native";
import type { IconProps } from "../icon";
import type { RenderProp } from "../utils/render";

export type BadgeSize = "sm" | "md" | "lg";
export type BadgeVariant = "primary" | "secondary" | "tertiary" | "soft";
export type BadgeColor = "default" | "accent" | "success" | "warning" | "danger";
export type BadgeRenderContext = { size: BadgeSize; variant: BadgeVariant; color: BadgeColor; icon?: LucideIcon };
type BadgeSlot<Native, Web> = {
  className?: string;
  herouiNativeProps?: Omit<Native, "children" | "className">;
  herouiWebProps?: Omit<Web, "children" | "className" | "render">;
};
export type BadgeLabelProps = BadgeSlot<ComponentProps<typeof NativeChip.Label>, ComponentProps<typeof WebChip.Label<"span">>>;
export type BadgeProps = BadgeSlot<
  Omit<ComponentProps<typeof NativeChip>, "size" | "variant" | "color">,
  Omit<ComponentProps<typeof WebChip<"span">>, "size" | "variant" | "color">
> & {
  size?: BadgeSize;
  variant?: BadgeVariant;
  color?: BadgeColor;
  label?: RenderProp<BadgeRenderContext>;
  /** Replaces label; startContent/endContent still apply. */
  children?: ReactNode;
  labelProps?: BadgeLabelProps;
  labelClassName?: string;
  startContent?: RenderProp<BadgeRenderContext>;
  endContent?: RenderProp<BadgeRenderContext>;
  icon?: LucideIcon;
  iconProps?: Omit<IconProps, "as">;
  iconClassName?: string;
};
