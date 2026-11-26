import type { Alert as NativeAlert } from "heroui-native/alert";
import type { Alert as WebAlert } from "@heroui/react/alert";
import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react-native";
import type { IconProps } from "../icon";
import type { RenderProp } from "../utils/render";
export type AlertStatus = "default" | "accent" | "success" | "warning" | "danger";
export type AlertRenderContext = {
    status: AlertStatus;
    icon?: LucideIcon;
};
type AlertSlot<Native, Web> = {
    className?: string;
    herouiNativeProps?: Omit<Native, "children" | "className" | "asChild">;
    herouiWebProps?: Omit<Web, "children" | "className" | "render">;
};
export type AlertIndicatorProps = AlertSlot<ComponentProps<typeof NativeAlert.Indicator>, ComponentProps<typeof WebAlert.Indicator<"div">>>;
export type AlertContentProps = AlertSlot<ComponentProps<typeof NativeAlert.Content>, ComponentProps<typeof WebAlert.Content<"div">>>;
export type AlertTitleProps = AlertSlot<ComponentProps<typeof NativeAlert.Title>, ComponentProps<typeof WebAlert.Title<"p">>>;
export type AlertDescriptionProps = AlertSlot<ComponentProps<typeof NativeAlert.Description>, ComponentProps<typeof WebAlert.Description<"span">>>;
export type AlertProps = AlertSlot<Omit<ComponentProps<typeof NativeAlert>, "status">, Omit<ComponentProps<typeof WebAlert<"div">>, "status">> & {
    status?: AlertStatus;
    title?: RenderProp<AlertRenderContext>;
    titleProps?: AlertTitleProps;
    titleClassName?: string;
    description?: RenderProp<AlertRenderContext>;
    descriptionProps?: AlertDescriptionProps;
    descriptionClassName?: string;
    content?: RenderProp<AlertRenderContext>;
    contentProps?: AlertContentProps;
    contentClassName?: string;
    children?: ReactNode;
    /** Trailing action, outside the text column. */
    action?: RenderProp<AlertRenderContext>;
    /** undefined uses HeroUI's status icon; null/false hides the indicator. */
    indicator?: RenderProp<AlertRenderContext>;
    indicatorProps?: AlertIndicatorProps;
    indicatorClassName?: string;
    icon?: LucideIcon;
    iconProps?: Omit<IconProps, "as">;
    iconSize?: IconProps["size"];
    iconClassName?: string;
    iconContainerClassName?: string;
    iconAlign?: "start" | "center";
};
export {};
