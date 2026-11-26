import { type ReactNode } from "react";
export declare function useToastPortalScope(container: HTMLElement | null | undefined): void;
/** React Aria ToastRegion creates its own portal. Keep that portal inside our
 * registered interaction branch instead of letting it escape to document.body. */
export declare function ToastPortalBoundary({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
/** 移动稳定的 host 而非更换 React Portal target，保留 Toast 的通知、计时与内部状态。 */
export declare function ToastPortal({ children }: {
    children: ReactNode;
}): import("react").ReactPortal | null;
