import { jsx as _jsx } from "react/jsx-runtime";
import { GlassContainer as ExpoGlassContainer, GlassView as ExpoGlassView, } from "expo-glass-effect";
import { NavigationContext } from "@react-navigation/native";
import { forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import { Keyboard } from "react-native";
import { KeyboardState } from "react-native-keyboard-controller";
import Animated, { cancelAnimation, runOnJS, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming, } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useKeyboardAnimation } from "../utils/keyboard";
const AnimatedExpoGlassView = Animated.createAnimatedComponent(ExpoGlassView);
const DEFAULT_KEYBOARD_HIDDEN_HEIGHT_THRESHOLD = 20;
const DEFAULT_KEYBOARD_HIDDEN_CONSECUTIVE_FRAMES = 1;
const FRAME_DURATION_MS = 1000 / 60;
function useKeyboardHidden(onKeyboardHidden, keyboardHeight, navigationGestureActiveValue, keyboardHiddenConfirmation, onNavigationGestureChange) {
    const navigation = useContext(NavigationContext);
    const callbackRef = useRef(onKeyboardHidden);
    const navigationGestureCallbackRef = useRef(onNavigationGestureChange);
    const keyboardHiddenNotifiedRef = useRef(false);
    // `keyboardDidHide` can arrive while the final UI-thread positioning animation
    // is still running. Keep that event as a fallback only when no confirmation
    // was started by `keyboardWillHide`.
    const hideConfirmationPendingRef = useRef(false);
    callbackRef.current = onKeyboardHidden;
    navigationGestureCallbackRef.current = onNavigationGestureChange;
    const hideConfirmationActive = useSharedValue(false);
    const confirmationProgress = useSharedValue(0);
    const notifyKeyboardHidden = useCallback(() => {
        if (keyboardHiddenNotifiedRef.current) {
            return;
        }
        hideConfirmationPendingRef.current = false;
        keyboardHiddenNotifiedRef.current = true;
        callbackRef.current?.();
    }, []);
    const heightThreshold = Math.max(keyboardHiddenConfirmation?.heightThreshold ?? DEFAULT_KEYBOARD_HIDDEN_HEIGHT_THRESHOLD, 0);
    const consecutiveFrames = Math.max(Math.round(keyboardHiddenConfirmation?.consecutiveFrames ?? DEFAULT_KEYBOARD_HIDDEN_CONSECUTIVE_FRAMES), 1);
    const confirmationDuration = consecutiveFrames * FRAME_DURATION_MS;
    const finalHeight = Math.min(keyboardHiddenConfirmation?.finalHeight ?? 0, 0);
    useAnimatedReaction(() => hideConfirmationActive.value &&
        !navigationGestureActiveValue.value &&
        keyboardHeight.value <= heightThreshold, (shouldConfirm, wasConfirming) => {
        if (!shouldConfirm) {
            cancelAnimation(confirmationProgress);
            confirmationProgress.value = 0;
            return;
        }
        if (wasConfirming) {
            return;
        }
        confirmationProgress.value = withTiming(1, { duration: confirmationDuration }, (finished) => {
            if (finished &&
                hideConfirmationActive.value &&
                !navigationGestureActiveValue.value &&
                keyboardHeight.value <= heightThreshold) {
                runOnJS(notifyKeyboardHidden)();
            }
        });
    }, [confirmationDuration, heightThreshold]);
    useEffect(() => {
        if (onKeyboardHidden == null && onNavigationGestureChange == null) {
            return;
        }
        let navigationGestureActive = false;
        const handleKeyboardWillHide = () => {
            if (!navigationGestureActive) {
                keyboardHiddenNotifiedRef.current = false;
                hideConfirmationPendingRef.current = true;
                confirmationProgress.value = 0;
                hideConfirmationActive.value = true;
            }
        };
        const handleKeyboardDidHide = () => {
            if (!navigationGestureActive && !hideConfirmationPendingRef.current) {
                confirmationProgress.value = 0;
                notifyKeyboardHidden();
            }
        };
        const handleKeyboardWillShow = () => {
            keyboardHiddenNotifiedRef.current = false;
            hideConfirmationPendingRef.current = false;
            confirmationProgress.value = 0;
            hideConfirmationActive.value = false;
        };
        const handleGestureStart = () => {
            navigationGestureActive = true;
            handleKeyboardWillShow();
            navigationGestureCallbackRef.current?.(true);
        };
        const handleGestureCancel = () => {
            navigationGestureActive = false;
            navigationGestureCallbackRef.current?.(false);
        };
        const handleGestureEnd = () => {
            navigationGestureActive = false;
            navigationGestureCallbackRef.current?.(false);
        };
        const handleTransitionStart = (event) => {
            if (event.data?.closing) {
                handleGestureStart();
            }
        };
        const handleTransitionEnd = (event) => {
            if (event.data?.closing) {
                handleGestureEnd();
            }
            else if (navigationGestureActive) {
                handleGestureCancel();
            }
        };
        const willHideSubscription = Keyboard.addListener("keyboardWillHide", handleKeyboardWillHide);
        const didHideSubscription = Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide);
        const willShowSubscription = Keyboard.addListener("keyboardWillShow", handleKeyboardWillShow);
        const addNavigationListener = (eventName, listener) => navigation?.addListener?.(eventName, listener);
        const gestureStartUnsubscribe = addNavigationListener("gestureStart", handleGestureStart);
        const gestureEndUnsubscribe = addNavigationListener("gestureEnd", handleGestureEnd);
        const gestureCancelUnsubscribe = addNavigationListener("gestureCancel", handleGestureCancel);
        const transitionStartUnsubscribe = addNavigationListener("transitionStart", handleTransitionStart);
        const transitionEndUnsubscribe = addNavigationListener("transitionEnd", handleTransitionEnd);
        return () => {
            handleKeyboardWillShow();
            navigationGestureCallbackRef.current?.(false);
            willHideSubscription.remove();
            didHideSubscription.remove();
            willShowSubscription.remove();
            gestureStartUnsubscribe?.();
            gestureEndUnsubscribe?.();
            gestureCancelUnsubscribe?.();
            transitionStartUnsubscribe?.();
            transitionEndUnsubscribe?.();
        };
    }, [navigation, onKeyboardHidden, onNavigationGestureChange]);
    return {
        confirmationDuration,
        finalHeight,
        heightThreshold,
        isConfirming: hideConfirmationActive,
    };
}
function KeyboardAvoidingGlassEffect({ forwardedRef, keyboardAvoidance, keyboardHiddenConfirmation, onKeyboardHidden, ...props }) {
    const insets = useSafeAreaInsets();
    const navigationGestureActive = useSharedValue(false);
    const keyboardAvoidanceFrozen = useSharedValue(false);
    const keyboardAvoidanceReleasePending = useSharedValue(false);
    const frozenKeyboardHeight = useSharedValue(0);
    const stableKeyboardHeight = useSharedValue(0);
    const displayedKeyboardHeight = useSharedValue(0);
    const { height, state } = useKeyboardAnimation();
    const setNavigationGestureActive = useCallback((active) => {
        navigationGestureActive.value = active;
        if (active) {
            // On iOS 18 the keyboard can report one interactive height before the
            // navigation event reaches JS. Freeze against the last settled OPEN
            // height instead of that transient value.
            frozenKeyboardHeight.value = stableKeyboardHeight.value || height.value;
            keyboardAvoidanceReleasePending.value = false;
            keyboardAvoidanceFrozen.value = true;
        }
        else if (keyboardAvoidanceFrozen.value) {
            // A cancelled interactive pop briefly reports a transition height. The
            // UI worklet releases only after the keyboard is OPEN again.
            keyboardAvoidanceReleasePending.value = true;
        }
    }, [
        height,
        keyboardAvoidanceFrozen,
        keyboardAvoidanceReleasePending,
        navigationGestureActive,
        stableKeyboardHeight,
    ]);
    const keyboardHiddenConfirmationState = useKeyboardHidden(onKeyboardHidden, height, navigationGestureActive, keyboardHiddenConfirmation, setNavigationGestureActive);
    useDerivedValue(() => {
        if (state.value === KeyboardState.OPEN) {
            stableKeyboardHeight.value = height.value;
        }
        if (keyboardAvoidanceReleasePending.value && state.value === KeyboardState.OPEN) {
            keyboardAvoidanceReleasePending.value = false;
            keyboardAvoidanceFrozen.value = false;
        }
        if (!keyboardAvoidanceFrozen.value) {
            frozenKeyboardHeight.value = height.value;
            if (keyboardHiddenConfirmationState.isConfirming.value &&
                height.value <= keyboardHiddenConfirmationState.heightThreshold) {
                displayedKeyboardHeight.value = withTiming(keyboardHiddenConfirmationState.finalHeight, {
                    duration: keyboardHiddenConfirmationState.confirmationDuration,
                });
            }
            else {
                displayedKeyboardHeight.value = height.value;
            }
        }
    });
    const config = typeof keyboardAvoidance === "object" ? keyboardAvoidance : undefined;
    const enabled = keyboardAvoidance === true || config?.enabled !== false;
    const offset = config?.offset ?? 0;
    const safeAreaInset = config?.subtractSafeAreaInset === false ? 0 : insets.bottom;
    const keyboardStyle = useAnimatedStyle(() => {
        const allowsNegativeFinalHeight = keyboardHiddenConfirmationState.isConfirming.value &&
            keyboardHiddenConfirmationState.finalHeight < 0;
        const keyboardHeight = keyboardAvoidanceFrozen.value
            ? frozenKeyboardHeight.value
            : displayedKeyboardHeight.value;
        const keyboardOffset = keyboardHeight - safeAreaInset + offset;
        return {
            transform: [
                {
                    translateY: enabled
                        ? -(allowsNegativeFinalHeight ? keyboardOffset : Math.max(keyboardOffset, 0))
                        : 0,
                },
            ],
        };
    }, [enabled, offset, safeAreaInset]);
    return (_jsx(AnimatedExpoGlassView, { ...props, ref: forwardedRef, style: [props.style, keyboardStyle] }));
}
const GlassEffectRoot = forwardRef(function GlassEffectRoot({ keyboardAvoidance, keyboardHiddenConfirmation, onKeyboardHidden, ...props }, forwardedRef) {
    if (keyboardAvoidance != null && keyboardAvoidance !== false) {
        return (_jsx(KeyboardAvoidingGlassEffect, { ...props, forwardedRef: forwardedRef, keyboardAvoidance: keyboardAvoidance, keyboardHiddenConfirmation: keyboardHiddenConfirmation, onKeyboardHidden: onKeyboardHidden }));
    }
    return (_jsx(KeyboardVisibilityGlassEffect, { ...props, forwardedRef: forwardedRef, keyboardHiddenConfirmation: keyboardHiddenConfirmation, onKeyboardHidden: onKeyboardHidden }));
});
function KeyboardVisibilityGlassEffect({ forwardedRef, keyboardHiddenConfirmation, onKeyboardHidden, ...props }) {
    if (onKeyboardHidden == null) {
        return _jsx(ExpoGlassView, { ...props, ref: forwardedRef });
    }
    return (_jsx(KeyboardVisibilityTrackingGlassEffect, { ...props, forwardedRef: forwardedRef, keyboardHiddenConfirmation: keyboardHiddenConfirmation, onKeyboardHidden: onKeyboardHidden }));
}
function KeyboardVisibilityTrackingGlassEffect({ forwardedRef, keyboardHiddenConfirmation, onKeyboardHidden, ...props }) {
    const navigationGestureActive = useSharedValue(false);
    const { height } = useKeyboardAnimation();
    const setNavigationGestureActive = useCallback((active) => {
        navigationGestureActive.value = active;
    }, [navigationGestureActive]);
    useKeyboardHidden(onKeyboardHidden, height, navigationGestureActive, keyboardHiddenConfirmation, setNavigationGestureActive);
    return _jsx(ExpoGlassView, { ...props, ref: forwardedRef });
}
export const GlassEffectContainer = forwardRef(function GlassEffectContainer(props, forwardedRef) {
    return _jsx(ExpoGlassContainer, { ...props, ref: forwardedRef });
});
/**
 * iOS 26+ 使用系统原生 Liquid Glass；其他平台由 expo-glass-effect 降级为普通 View。
 *
 * 默认不附加布局或定位语义；启用 `keyboardAvoidance` 后会在 UI 线程跟随键盘位移。
 * 其余 GlassView props、style 与 children 均原样透传。
 */
export const GlassEffect = Object.assign(GlassEffectRoot, {
    Container: GlassEffectContainer,
});
