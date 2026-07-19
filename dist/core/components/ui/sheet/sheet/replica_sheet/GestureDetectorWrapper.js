import { jsx as _jsx } from "react/jsx-runtime";
import { View } from "react-native";
import { getGestureHandlerState, isGestureHandlerEnabled } from "./gestureState";
/**
 * Conditionally wraps children with GestureDetector when RNGH is available.
 * Uses a plain View wrapper that GestureDetector can attach gesture handlers to.
 */
export function GestureDetectorWrapper({ gesture, children, style }) {
    const { GestureDetector } = getGestureHandlerState();
    const enabled = isGestureHandlerEnabled();
    // only wrap if we have RNGH available AND a gesture to attach
    if (enabled && GestureDetector && gesture) {
        // GestureDetector needs a native View to attach handlers to
        // the View wrapper ensures proper gesture propagation
        return (_jsx(GestureDetector, { gesture: gesture, children: _jsx(View, { style: style, collapsable: false, children: children }) }));
    }
    // pass through children in a consistent View wrapper
    return _jsx(View, { style: style, children: children });
}
