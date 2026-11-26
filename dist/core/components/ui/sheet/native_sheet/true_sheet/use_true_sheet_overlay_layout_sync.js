import { useCallback, useMemo } from "react";
import { useTrueSheetOverlayLayoutSetter } from "./overlay_layout_context";
/**
 * 合并 TrueSheet 布局事件与 overlay 上下文同步；回调须写在 `{...sheetProps}` 之后以免被覆盖。
 */
export function useTrueSheetOverlayLayoutSync(sheetProps) {
    const setOverlayLayout = useTrueSheetOverlayLayoutSetter();
    const syncOverlayLayout = useCallback((event) => {
        setOverlayLayout?.({
            detent: event.nativeEvent.detent,
            sheetTopPosition: event.nativeEvent.position,
        });
    }, [setOverlayLayout]);
    const resetOverlayLayout = useCallback(() => {
        setOverlayLayout?.({ detent: 1, sheetTopPosition: null });
    }, [setOverlayLayout]);
    return useMemo(() => ({
        onDetentChange: (event) => {
            syncOverlayLayout(event);
            sheetProps?.onDetentChange?.(event);
        },
        onDidDismiss: (event) => {
            resetOverlayLayout();
            sheetProps?.onDidDismiss?.(event);
        },
        onDidPresent: (event) => {
            syncOverlayLayout(event);
            sheetProps?.onDidPresent?.(event);
        },
        onDragChange: (event) => {
            syncOverlayLayout(event);
            sheetProps?.onDragChange?.(event);
        },
        onDragEnd: (event) => {
            syncOverlayLayout(event);
            sheetProps?.onDragEnd?.(event);
        },
        onPositionChange: (event) => {
            syncOverlayLayout(event);
            sheetProps?.onPositionChange?.(event);
        },
        onWillPresent: (event) => {
            syncOverlayLayout(event);
            sheetProps?.onWillPresent?.(event);
        },
    }), [resetOverlayLayout, sheetProps, syncOverlayLayout]);
}
