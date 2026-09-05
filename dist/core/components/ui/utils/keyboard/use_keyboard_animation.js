import { KeyboardState, useKeyboardHandler } from "react-native-keyboard-controller";
import { useSharedValue, withTiming } from "react-native-reanimated";
/**
 * 获取跨平台键盘的实时动画高度与状态。
 *
 * 使用 `RootProvider` / `UIProvider` 时无需额外配置；否则需要在应用根节点添加
 * `KeyboardAnimationProvider`。
 */
export function useKeyboardAnimation() {
    const height = useSharedValue(0);
    const state = useSharedValue(KeyboardState.UNKNOWN);
    useKeyboardHandler({
        onStart: (event) => {
            "worklet";
            state.set(event.height > 0 ? KeyboardState.OPENING : KeyboardState.CLOSING);
            height.set(withTiming(event.height, event.duration > 0 ? { duration: event.duration } : undefined));
        },
        onMove: (event) => {
            "worklet";
            height.set(event.height);
        },
        onInteractive: (event) => {
            "worklet";
            height.set(event.height);
        },
        onEnd: (event) => {
            "worklet";
            state.set(event.height > 0 ? KeyboardState.OPEN : KeyboardState.CLOSED);
            height.set(event.height);
        },
    }, []);
    return { height, state };
}
