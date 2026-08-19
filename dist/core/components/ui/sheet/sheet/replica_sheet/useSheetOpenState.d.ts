import type { SheetProps } from "./types";
export declare const useSheetOpenState: (props: SheetProps) => {
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    isHidden: boolean | undefined;
    controller: import("tamagui").SheetControllerContextValue | null;
};
export type SheetOpenState = ReturnType<typeof useSheetOpenState>;
