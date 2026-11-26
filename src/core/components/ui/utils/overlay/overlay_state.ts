import { useCallback, useState } from "react";

export type OverlayStateProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function useOverlayState(props: OverlayStateProps, disabled = false) {
  const [local, setLocal] = useState(props.defaultOpen ?? false);
  const open = props.open ?? local;
  const setOpen = useCallback((next: boolean) => {
    if ((disabled && next) || next === open) return;
    if (props.open === undefined) setLocal(next);
    props.onOpenChange?.(next);
  }, [disabled, open, props.open, props.onOpenChange]);
  return { open, setOpen, close: () => setOpen(false) };
}

export type OverlayPartProps<N, W> = {
  className?: string;
  herouiNativeProps?: N;
  herouiWebProps?: W;
};
