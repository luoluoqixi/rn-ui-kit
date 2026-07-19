import { isWeb } from "../utils/platform";
const TAURI_DRAG_REGION_SELECTOR = "[data-tauri-drag-region]";
function isClosestCapableTarget(target) {
    return (typeof target === "object" &&
        target !== null &&
        "closest" in target &&
        typeof target.closest === "function");
}
function isTauriDragRegionTarget(target) {
    return isClosestCapableTarget(target) && target.closest(TAURI_DRAG_REGION_SELECTOR) !== null;
}
function isToastTarget(target) {
    if (!isClosestCapableTarget(target)) {
        return false;
    }
    // 检查是否在带有 data-toast-container 的元素内
    return target.closest("[data-toast-container]") !== null;
}
function preventDialogDismissForDragRegion(event) {
    if (!isWeb()) {
        return;
    }
    const target = event.detail?.originalEvent?.target;
    if (isTauriDragRegionTarget(target) || isToastTarget(target)) {
        event.preventDefault();
    }
}
export { preventDialogDismissForDragRegion, isTauriDragRegionTarget, TAURI_DRAG_REGION_SELECTOR };
