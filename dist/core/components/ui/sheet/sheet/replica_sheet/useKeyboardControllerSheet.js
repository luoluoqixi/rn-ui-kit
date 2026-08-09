/**
 * Web stub for keyboard controller sheet hook.
 * Returns no-op values since keyboard-controller is native-only.
 */
import { useRef } from "react";
const noop = () => { };
export function useKeyboardControllerSheet(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_options) {
    const pauseKeyboardHandler = useRef(false);
    return {
        keyboardControllerEnabled: false,
        keyboardHeight: 0,
        isKeyboardVisible: false,
        dismissKeyboard: noop,
        pauseKeyboardHandler,
        flushPendingHide: noop,
    };
}
