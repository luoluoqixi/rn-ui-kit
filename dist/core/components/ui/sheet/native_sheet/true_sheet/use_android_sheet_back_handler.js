import { useEffect } from "react";
import { BackHandler } from "react-native";
import { os } from "../../../utils/platform";
/** Sheet 展示且为 Android 时：子页 `onBack`，根页 `onClose`。 */
export function useAndroidSheetBackHandler({ enabled, canGoBack, onBack, onClose, }) {
    useEffect(() => {
        if (os() !== "android" || !enabled) {
            return;
        }
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            if (canGoBack) {
                onBack();
                return true;
            }
            onClose();
            return true;
        });
        return () => subscription.remove();
    }, [canGoBack, enabled, onBack, onClose]);
}
