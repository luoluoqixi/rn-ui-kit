/**
 * Legacy setup - prefer `import '@tamagui/native/setup-gesture-handler'` instead.
 */
import { getGestureHandler } from "@tamagui/native";
export function isGestureHandlerEnabled() {
    return getGestureHandler().isEnabled;
}
export function setupGestureHandler(config) {
    const g = globalThis;
    if (g.__tamagui_sheet_gesture_handler_setup) {
        return;
    }
    g.__tamagui_sheet_gesture_handler_setup = true;
    const { Gesture, GestureDetector, ScrollView } = config;
    if (Gesture && GestureDetector) {
        getGestureHandler().set({
            enabled: true,
            Gesture,
            GestureDetector,
            ScrollView: ScrollView || null,
        });
    }
}
