import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react-native";
import type { Text, View } from "react-native";
import type { RenderProp } from "../utils";
import type { IconProps } from "../icon";

export type AlertTitleProps = ComponentProps<typeof Text>;
export type AlertDescriptionProps = ComponentProps<typeof Text>;

export type AlertRenderContext = {
  icon: LucideIcon;
  variant?: "default" | "destructive";
};

export type AlertProps = ComponentProps<typeof View> & {
  description?: RenderProp<AlertRenderContext>;
  descriptionProps?: AlertDescriptionProps;
  descriptionClassName?: string;
  icon: LucideIcon;
  iconContainerClassName?: string;
  iconClassName?: string;
  iconSize?: IconProps["size"];
  iconProps?: Omit<IconProps, "as">;
  iconAlign?: "center" | "start";
  title?: RenderProp<AlertRenderContext>;
  titleProps?: AlertTitleProps;
  titleClassName?: string;
  variant?: "default" | "destructive";
};
