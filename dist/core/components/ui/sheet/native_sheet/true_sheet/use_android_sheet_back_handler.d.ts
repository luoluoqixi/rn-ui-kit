export type UseAndroidSheetBackHandlerOptions = {
    /** 为 false 时不拦截硬件返回（例如 Sheet 未展示时）。 */
    enabled: boolean;
    canGoBack: boolean;
    onBack: () => void;
    onClose: () => void;
};
/** Sheet 展示且为 Android 时：子页 `onBack`，根页 `onClose`。 */
export declare function useAndroidSheetBackHandler({ enabled, canGoBack, onBack, onClose, }: UseAndroidSheetBackHandlerOptions): void;
