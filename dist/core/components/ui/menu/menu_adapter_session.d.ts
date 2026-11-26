import type { MenuAdapter, MenuAdapterItem, MenuAdapterRequest } from "./menu_adapter_types";
type Control = {
    owner: object;
    feedbackReleased: boolean;
    cancel(notify?: boolean): void;
};
export declare function startMenuAdapterSession({ scope, owner, adapter, request, createItems, onRelease, onError, restoreFocus, }: {
    scope: object;
    owner: object;
    adapter: MenuAdapter;
    request: Omit<MenuAdapterRequest, "items" | "signal" | "isCurrent" | "select">;
    createItems(isCurrent: () => boolean): MenuAdapterItem[];
    onRelease(): void;
    onError(error: unknown): void;
    restoreFocus(): void;
}): Control;
export {};
