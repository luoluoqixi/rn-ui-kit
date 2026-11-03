import { Button } from "../button";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import * as CollapsiblePrimitive from "@rn-primitives/collapsible";
import * as React from "react";

import type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleRenderContext,
  CollapsibleTriggerProps,
} from "./types";

const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
const CollapsibleContent = CollapsiblePrimitive.Content;

function normalizeCollapsibleChildren(children: React.ReactNode, className?: string) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <Text className={className}>{child}</Text>
    ) : (
      child
    ),
  );
}

function CollapsibleRoot({
  children,
  content,
  contentClassName,
  contentProps,
  defaultOpen,
  disabled = false,
  nativeHaptics,
  onOpenChange,
  open,
  title,
  titleClassName,
  trigger,
  triggerButtonProps,
  triggerClassName,
  triggerProps,
  ...rootProps
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const hasDataStructure =
    children == null && [content, title, trigger].some((value) => value !== undefined);

  if (!hasDataStructure) {
    return (
      <CollapsiblePrimitive.Root
        {...rootProps}
        disabled={disabled}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        open={open}
      >
        {children}
      </CollapsiblePrimitive.Root>
    );
  }

  const resolvedOpen = open ?? uncontrolledOpen;
  const renderContext: CollapsibleRenderContext = {
    disabled,
    open: resolvedOpen,
  };
  const renderedTitle = resolveRenderProp(title, renderContext);
  const renderedTrigger = resolveRenderProp(trigger, renderContext);
  const renderedContent = resolveRenderProp(content, renderContext);
  const handleOpenChange = (nextOpen: boolean) => {
    if (open === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  const defaultTrigger = (
    <Button
      {...triggerButtonProps}
      className={cn("self-start w-full", triggerClassName, triggerButtonProps?.className)}
      disabled={disabled || triggerButtonProps?.disabled}
      nativeHaptics={triggerButtonProps?.nativeHaptics ?? nativeHaptics}
      variant={triggerButtonProps?.variant ?? "secondary"}
    >
      {normalizeCollapsibleChildren(
        renderedTitle ?? (resolvedOpen ? "收起详情" : "展开详情"),
        titleClassName,
      )}
    </Button>
  );

  return (
    <CollapsiblePrimitive.Root
      {...rootProps}
      disabled={disabled}
      onOpenChange={handleOpenChange}
      open={resolvedOpen}
    >
      <CollapsibleTrigger
        {...triggerProps}
        asChild
        className={cn(triggerProps?.className, triggerClassName)}
      >
        {renderedTrigger ?? defaultTrigger}
      </CollapsibleTrigger>
      {renderedContent != null ? (
        <CollapsibleContent
          {...contentProps}
          className={cn(contentClassName, contentProps?.className)}
        >
          {normalizeCollapsibleChildren(renderedContent)}
        </CollapsibleContent>
      ) : null}
    </CollapsiblePrimitive.Root>
  );
}

const Collapsible = Object.assign(CollapsibleRoot, {
  Content: CollapsibleContent,
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
});

export { Collapsible };
export type * from "./types";
