import type { Badge as WebBadge } from "@heroui/react/badge";
import type { Chip as NativeChip } from "heroui-native/chip";
import type { ComponentProps, ComponentPropsWithRef, ReactNode } from "react";
import type { View } from "react-native";
import type { RenderProp } from "../utils/render";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeVariant = "primary" | "secondary" | "soft";
export type BadgeColor = "default" | "accent" | "success" | "warning" | "danger";
export type BadgePlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";
export type BadgeRenderContext = {
    size: BadgeSize;
    variant: BadgeVariant;
    color: BadgeColor;
    placement: BadgePlacement;
};
type BadgeSlot<Native, Web> = {
    className?: string;
    herouiNativeProps?: Omit<Native, "children" | "className">;
    herouiWebProps?: Omit<Web, "children" | "className" | "render">;
};
export type BadgeAnchorProps = BadgeSlot<ComponentPropsWithRef<typeof View>, ComponentProps<typeof WebBadge.Anchor<"div">>>;
export type BadgeLabelProps = BadgeSlot<ComponentProps<typeof NativeChip.Label>, ComponentProps<typeof WebBadge.Label<"span">>>;
export type BadgeProps = BadgeSlot<Omit<ComponentProps<typeof NativeChip>, "size" | "variant" | "color">, Omit<ComponentProps<typeof WebBadge<"span">>, "size" | "variant" | "color" | "placement">> & {
    /** The element receiving the badge. It remains mounted when isHidden changes. */
    children: ReactNode;
    /** Text, a number, or a custom inline node; omitted content shows a status dot. */
    content?: RenderProp<BadgeRenderContext>;
    size?: BadgeSize;
    variant?: BadgeVariant;
    color?: BadgeColor;
    placement?: BadgePlacement;
    isHidden?: boolean;
    /** Describe the indicator, especially when it has no visible text. */
    accessibilityLabel?: string;
    anchorProps?: BadgeAnchorProps;
    anchorClassName?: string;
    labelProps?: BadgeLabelProps;
    labelClassName?: string;
};
export {};
