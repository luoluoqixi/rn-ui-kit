import { Platform } from "react-native";
export function blurActiveElementOnWeb() {
    if (Platform.OS !== "web" ||
        typeof document === "undefined" ||
        typeof HTMLElement === "undefined") {
        return;
    }
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && activeElement !== document.body) {
        activeElement.blur();
    }
}
