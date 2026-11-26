export type OverlayStateProps = {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
};
export declare function useOverlayState(props: OverlayStateProps, disabled?: boolean): {
    open: boolean;
    setOpen: (next: boolean) => void;
    close: () => void;
};
export type OverlayPartProps<N, W> = {
    className?: string;
    herouiNativeProps?: N;
    herouiWebProps?: W;
};
