/** 未显式传 `grabber` 时：`plain` 显示，`toolbar` 隐藏。 */
export function resolveTrueSheetGrabber(chrome, explicit) {
    if (explicit !== undefined) {
        return explicit;
    }
    return chrome === "plain";
}
