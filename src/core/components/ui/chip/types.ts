import type { Chip as NativeChip } from "heroui-native/chip";
import type { Chip as WebChip } from "@heroui/react/chip";
import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react-native";
import type { IconProps } from "../icon";
import type { RenderProp } from "../utils/render";

export type ChipSize = "sm" | "md" | "lg";
export type ChipVariant = "primary" | "secondary" | "tertiary" | "soft";
export type ChipColor = "default" | "accent" | "success" | "warning" | "danger";
export type ChipRenderContext = { size: ChipSize; variant: ChipVariant; color: ChipColor; icon?: LucideIcon };
type ChipSlot<Native, Web> = {
  className?: string;
  herouiNativeProps?: Omit<Native, "children" | "className">;
  herouiWebProps?: Omit<Web, "children" | "className" | "render">;
};
export type ChipLabelProps = ChipSlot<ComponentProps<typeof NativeChip.Label>, ComponentProps<typeof WebChip.Label<"span">>>;
export type ChipProps = ChipSlot<
  Omit<ComponentProps<typeof NativeChip>, "size" | "variant" | "color">,
  Omit<ComponentProps<typeof WebChip<"span">>, "size" | "variant" | "color">
> & {
  size?: ChipSize;
  variant?: ChipVariant;
  color?: ChipColor;
  label?: RenderProp<ChipRenderContext>;
  /** Replaces label; startContent/endContent still apply. */
  children?: ReactNode;
  labelProps?: ChipLabelProps;
  labelClassName?: string;
  startContent?: RenderProp<ChipRenderContext>;
  endContent?: RenderProp<ChipRenderContext>;
  icon?: LucideIcon;
  iconProps?: Omit<IconProps, "as">;
  iconClassName?: string;
};
