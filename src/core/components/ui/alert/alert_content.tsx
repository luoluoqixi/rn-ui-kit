import { Icon } from "../icon";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import type { AlertProps, AlertRenderContext } from "./types";

export const alertStatusText = {
  default: "text-foreground", accent: "text-accent-soft-foreground",
  success: "text-success-soft-foreground", warning: "text-warning-soft-foreground", danger: "text-danger-soft-foreground",
};
export function resolveAlertContent(props: AlertProps) {
  const context: AlertRenderContext = { status: props.status ?? "default", icon: props.icon };
  const indicator = props.indicator !== undefined
    ? resolveRenderProp(props.indicator, context)
    : props.icon ? (
      <Icon as={props.icon} {...props.iconProps}
        size={props.iconSize ?? props.iconProps?.size ?? 18}
        className={cn(alertStatusText[context.status], props.iconClassName, props.iconProps?.className)} />
    ) : undefined;
  return {
    status: context.status, indicator,
    showIndicator: indicator !== null && typeof indicator !== "boolean",
    title: resolveRenderProp(props.title, context),
    description: resolveRenderProp(props.description, context),
    content: resolveRenderProp(props.content, context),
    action: resolveRenderProp(props.action, context),
  };
}
