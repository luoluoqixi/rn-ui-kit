import { isValidElement } from "react";
import { Button } from "../button";
import { Text } from "../text";
import { resolveRenderProp } from "../utils/render";
import { useOverlayState } from "../utils/overlay/overlay_state";
import { cn } from "../utils/cn";
import type { DialogProps } from "./types";

export type DialogAdapterProps = DialogProps & { isAlert?: boolean };
export function useDialogModel(p: DialogAdapterProps) {
  const state = useOverlayState(p);
  const context = { open: state.open, close: state.close };
  const trigger = resolveRenderProp(p.trigger, context);
  return { ...state, context,
    title: resolveRenderProp(p.title, context), description: resolveRenderProp(p.description, context),
    content: resolveRenderProp(p.content, context) ?? p.children,
    trigger: trigger == null ? null : isValidElement(trigger) ? trigger :
      <Button {...p.triggerProps} className={cn(p.triggerClassName, p.triggerProps?.className)} variant={p.triggerProps?.variant ?? "secondary"}>{trigger}</Button>,
  };
}
export function DialogActions({ props: p, model: m }: { props: DialogAdapterProps; model: ReturnType<typeof useDialogModel> }) {
  const actions = resolveRenderProp(p.actions, m.context);
  return <>
    {typeof actions === "string" || typeof actions === "number" ? <Text>{actions}</Text> : actions}
    {(["cancel", "action", "destructive"] as const).map(kind => {
      const label = resolveRenderProp(p[`${kind}Label`], m.context);
      if (label == null) return null;
      const props = p[`${kind}Props`];
      return <Button key={kind} {...props} title={undefined}
        accessibilityLabel={p[`${kind}AriaLabel`] ?? props?.accessibilityLabel}
        variant={props?.variant ?? (kind === "cancel" ? "tertiary" : kind === "destructive" ? "danger" : "primary")}
        className={cn(p[`${kind}ClassName`], props?.className)}
        onPress={event => {
          props?.onPress?.(event);
          if (!event.defaultPrevented && (kind === "cancel" || (p.closeOnAction ?? p.isAlert))) m.close();
        }}>{label}</Button>;
    })}
  </>;
}
