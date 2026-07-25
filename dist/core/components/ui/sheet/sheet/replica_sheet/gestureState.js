/**
 * Re-export gesture state from @tamagui/native.
 * Sheet uses this for backward compatibility with existing code.
 */
import { getGestureHandler } from "@tamagui/native";
// backward compat helpers
export function isGestureHandlerEnabled() {
    return getGestureHandler().isEnabled;
}
export function getGestureHandlerState() {
    return getGestureHandler().state;
}
export function setGestureHandlerState(updates) {
    getGestureHandler().set(updates);
}
// alias for backward compatibility
export const setGestureState = setGestureHandlerState;
