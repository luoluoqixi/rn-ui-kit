import type { DialogProps } from "./types";
export type DialogAdapterProps = DialogProps & {
    isAlert?: boolean;
};
export declare function useDialogModel(p: DialogAdapterProps): {
    context: {
        open: boolean;
        close: () => void;
    };
    title: import("react").ReactNode;
    description: import("react").ReactNode;
    content: import("react").ReactNode;
    trigger: import("react").JSX.Element | null;
    open: boolean;
    setOpen: (next: boolean) => void;
    close: () => void;
};
export declare function DialogActions({ props: p, model: m }: {
    props: DialogAdapterProps;
    model: ReturnType<typeof useDialogModel>;
}): import("react").JSX.Element;
