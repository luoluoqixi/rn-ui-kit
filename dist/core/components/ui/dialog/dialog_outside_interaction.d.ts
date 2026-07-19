declare const TAURI_DRAG_REGION_SELECTOR = "[data-tauri-drag-region]";
type OutsideInteractionEvent = {
    defaultPrevented?: boolean;
    preventDefault: () => void;
    detail?: {
        originalEvent?: {
            target?: unknown;
        };
    };
};
declare function isTauriDragRegionTarget(target: unknown): boolean;
declare function preventDialogDismissForDragRegion(event: OutsideInteractionEvent): void;
export { preventDialogDismissForDragRegion, isTauriDragRegionTarget, TAURI_DRAG_REGION_SELECTOR };
export type { OutsideInteractionEvent };
