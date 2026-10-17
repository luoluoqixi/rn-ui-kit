import type { ComponentProps, RefAttributes } from "react";
import type { LucideIcon } from "lucide-react-native";
import type { View } from "react-native";
import type { RenderProp } from "../utils";
import type { IconProps } from "../icon";
import type { Text } from "react-native";
import type { badgeVariants } from "./badge";
export type BadgeRenderContext = {
    icon?: LucideIcon;
    variant?: "default" | "secondary" | "destructive" | "outline" | null;
    size?: "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | null;
};
export type BadgeProps = ComponentProps<typeof View> & RefAttributes<View> & {
    asChild?: boolean;
    icon?: LucideIcon;
    iconProps?: Omit<IconProps, "as">;
    iconClassName?: string;
    label?: RenderProp<BadgeRenderContext>;
    labelProps?: ComponentProps<typeof Text>;
    labelClassName?: string;
} & import("class-variance-authority").VariantProps<typeof badgeVariants>;
