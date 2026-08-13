import { useAnimatedKeyboard, } from "react-native-keyboard-controller";
/**
 * 获取跨平台键盘的实时动画高度与状态。
 *
 * 使用 `RootProvider` / `UIProvider` 时无需额外配置；否则需要在应用根节点添加
 * `KeyboardAnimationProvider`。
 */
export function useKeyboardAnimation() {
    return useAnimatedKeyboard();
}
