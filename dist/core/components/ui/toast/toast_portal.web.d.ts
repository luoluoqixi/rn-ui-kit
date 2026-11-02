import { type ReactNode } from "react";
export declare function useToastPortalScope(container: HTMLElement | null | undefined): void;
/** 移动稳定的 host 而非更换 React Portal target，保留 Sonner 的通知、计时与内部状态。 */
export declare function ToastPortal({ children }: {
    children: ReactNode;
}): import("react").ReactPortal | null;
