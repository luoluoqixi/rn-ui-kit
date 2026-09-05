import * as React from "react";
import type { ToastContext } from "./types";
export declare function ToastDefaultsProvider({ children, defaultNative, }: {
    children: React.ReactNode;
    defaultNative?: boolean;
}): React.JSX.Element;
export declare function useToast(): ToastContext;
