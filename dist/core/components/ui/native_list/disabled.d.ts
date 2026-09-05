import { type ReactNode } from "react";
export declare function NativeListDisabledProvider({ children, disabled, }: {
    children: ReactNode;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function useResolvedNativeListDisabled(disabled?: boolean): boolean;
export declare function resolveNativeListDisabled(disabled?: boolean, inherited?: boolean): boolean;
