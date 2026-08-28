import { useCallback, useRef } from "react";
import { KeyboardState } from "react-native-keyboard-controller";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { useKeyboardVisibility } from "./use_keyboard_visibility";
/**
 * 返回可直接用于底部浮层位移的稳定键盘高度。
 *
 * iOS 交互式返回会临时移动键盘；本 Hook 会在手势期间冻结高度，取消返回后等键盘
 * 回到 OPEN 状态才继续跟随，避免工具栏在开始或取消手势的瞬间跳动。
 */
export function useKeyboardAvoidance(options = {}) {
    const keyboardAvoidanceFrozen = useSharedValue(false);
    const keyboardAvoidanceReleasePending = useSharedValue(false);
    const frozenKeyboardHeight = useSharedValue(0);
    const stableKeyboardHeight = useSharedValue(0);
    const displayedKeyboardHeight = useSharedValue(0);
    const keyboardRef = useRef(null);
    const setNavigationGestureActive = useCallback((active) => {
        const keyboard = keyboardRef.current;
        if (keyboard == null) {
            return;
        }
        if (active) {
            if (keyboard.height.value <= 0) {
                frozenKeyboardHeight.value = 0;
                keyboardAvoidanceReleasePending.value = false;
                keyboardAvoidanceFrozen.value = false;
                return;
            }
            frozenKeyboardHeight.value = stableKeyboardHeight.value || keyboard.height.value;
            keyboardAvoidanceReleasePending.value = false;
            keyboardAvoidanceFrozen.value = true;
        }
        else if (keyboardAvoidanceFrozen.value) {
            if (keyboard.height.value <= 0) {
                keyboardAvoidanceReleasePending.value = false;
                keyboardAvoidanceFrozen.value = false;
                return;
            }
            keyboardAvoidanceReleasePending.value = true;
        }
    }, [
        keyboardAvoidanceFrozen,
        keyboardAvoidanceReleasePending,
        frozenKeyboardHeight,
        stableKeyboardHeight,
    ]);
    const keyboard = useKeyboardVisibility({
        hiddenConfirmation: options.hiddenConfirmation,
        onNavigationGestureChange: setNavigationGestureActive,
        onPhaseChange: options.onPhaseChange,
    });
    keyboardRef.current = keyboard;
    useDerivedValue(() => {
        if (keyboard.state.value === KeyboardState.OPEN) {
            stableKeyboardHeight.value = keyboard.height.value;
        }
        else if (keyboard.state.value === KeyboardState.CLOSED) {
            stableKeyboardHeight.value = 0;
        }
        if (keyboardAvoidanceReleasePending.value && keyboard.state.value === KeyboardState.OPEN) {
            keyboardAvoidanceReleasePending.value = false;
            keyboardAvoidanceFrozen.value = false;
        }
        if (!keyboardAvoidanceFrozen.value) {
            frozenKeyboardHeight.value = keyboard.height.value;
            if (keyboard.isHiddenConfirmationActive.value &&
                keyboard.height.value <= keyboard.hiddenHeightThreshold) {
                displayedKeyboardHeight.value = withTiming(keyboard.hiddenFinalHeight, {
                    duration: keyboard.hiddenConfirmationDuration,
                });
            }
            else {
                displayedKeyboardHeight.value = keyboard.height.value;
            }
        }
    });
    const effectiveKeyboardHeight = useDerivedValue(() => keyboardAvoidanceFrozen.value ? frozenKeyboardHeight.value : displayedKeyboardHeight.value);
    return {
        height: effectiveKeyboardHeight,
        hiddenFinalHeight: keyboard.hiddenFinalHeight,
        isHiddenConfirmationActive: keyboard.isHiddenConfirmationActive,
        isFullyDisplayed: keyboard.isFullyDisplayed,
        isVisible: keyboard.isVisible,
        phase: keyboard.phase,
    };
}
