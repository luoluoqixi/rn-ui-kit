import { NavigationContext } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Keyboard } from "react-native";
import { cancelAnimation, runOnJS, useAnimatedReaction, useSharedValue, withTiming, } from "react-native-reanimated";
import { KeyboardState } from "react-native-keyboard-controller";
import { useKeyboardAnimation } from "./use_keyboard_animation";
const DEFAULT_KEYBOARD_HIDDEN_HEIGHT_THRESHOLD = 20;
const DEFAULT_KEYBOARD_HIDDEN_CONSECUTIVE_FRAMES = 1;
const FRAME_DURATION_MS = 1000 / 60;
/**
 * 提供稳定的键盘显示/隐藏通知。
 *
 * `hidden` 阶段不会直接相信 `keyboardWillHide`：它会等待键盘高度连续满足配置阈值，
 * 并在 iOS 交互式返回期间暂停确认，避免把页面返回动画误判为键盘关闭。
 */
export function useKeyboardVisibility(options = {}) {
    const navigation = useContext(NavigationContext);
    const { height, state } = useKeyboardAnimation();
    const callbackRef = useRef(options);
    const hideConfirmationPendingRef = useRef(false);
    callbackRef.current = options;
    const isVisible = useSharedValue(false);
    const isFullyDisplayed = useSharedValue(false);
    const phase = useSharedValue("hidden");
    const isNavigationGestureActive = useSharedValue(false);
    const isHiddenConfirmationActive = useSharedValue(false);
    const confirmationProgress = useSharedValue(0);
    const heightThreshold = Math.max(options.hiddenConfirmation?.heightThreshold ?? DEFAULT_KEYBOARD_HIDDEN_HEIGHT_THRESHOLD, 0);
    const consecutiveFrames = Math.max(Math.round(options.hiddenConfirmation?.consecutiveFrames ?? DEFAULT_KEYBOARD_HIDDEN_CONSECUTIVE_FRAMES), 1);
    const confirmationDuration = consecutiveFrames * FRAME_DURATION_MS;
    const finalHeight = Math.min(options.hiddenConfirmation?.finalHeight ?? 0, 0);
    const notifyPhaseChange = useCallback((nextPhase) => {
        if (nextPhase === "hidden") {
            hideConfirmationPendingRef.current = false;
        }
        callbackRef.current.onPhaseChange?.(nextPhase);
    }, []);
    const transitionPhase = (nextPhase) => {
        "worklet";
        if (phase.value === nextPhase) {
            return;
        }
        phase.value = nextPhase;
        isVisible.value = nextPhase !== "hidden";
        isFullyDisplayed.value = nextPhase === "visible";
        runOnJS(notifyPhaseChange)(nextPhase);
    };
    const transitionPhaseFromJs = useCallback((nextPhase) => {
        if (phase.value === nextPhase) {
            return;
        }
        phase.value = nextPhase;
        isVisible.value = nextPhase !== "hidden";
        isFullyDisplayed.value = nextPhase === "visible";
        notifyPhaseChange(nextPhase);
    }, [isFullyDisplayed, isVisible, notifyPhaseChange, phase]);
    useAnimatedReaction(() => state.value, (keyboardState, previousKeyboardState) => {
        if (keyboardState === KeyboardState.OPENING &&
            previousKeyboardState !== KeyboardState.OPENING) {
            // Once a keyboard has been confirmed visible, an interactive-back
            // cancellation can transiently report OPENING. Keep the stable phase.
            if (!isVisible.value) {
                transitionPhase("opening");
            }
            else if (phase.value === "hiding") {
                transitionPhase("visible");
            }
        }
        if (keyboardState === KeyboardState.OPEN && previousKeyboardState !== KeyboardState.OPEN) {
            transitionPhase("visible");
        }
    });
    useAnimatedReaction(() => isHiddenConfirmationActive.value &&
        !isNavigationGestureActive.value &&
        height.value <= heightThreshold, (shouldConfirm, wasConfirming) => {
        if (!shouldConfirm) {
            cancelAnimation(confirmationProgress);
            confirmationProgress.value = 0;
            if (phase.value === "hiding") {
                transitionPhase(isVisible.value ? "visible" : "hidden");
            }
            return;
        }
        if (wasConfirming) {
            return;
        }
        transitionPhase("hiding");
        confirmationProgress.value = withTiming(1, { duration: confirmationDuration }, (finished) => {
            if (finished &&
                isHiddenConfirmationActive.value &&
                !isNavigationGestureActive.value &&
                height.value <= heightThreshold) {
                transitionPhase("hidden");
            }
        });
    }, [confirmationDuration, heightThreshold]);
    useEffect(() => {
        let navigationGestureActive = false;
        const handleKeyboardWillHide = () => {
            if (!navigationGestureActive) {
                hideConfirmationPendingRef.current = true;
                confirmationProgress.value = 0;
                isHiddenConfirmationActive.value = true;
            }
        };
        const handleKeyboardDidHide = () => {
            if (!navigationGestureActive && !hideConfirmationPendingRef.current) {
                confirmationProgress.value = 0;
                transitionPhaseFromJs("hidden");
            }
        };
        const handleKeyboardWillShow = () => {
            hideConfirmationPendingRef.current = false;
            confirmationProgress.value = 0;
            isHiddenConfirmationActive.value = false;
        };
        const setNavigationGestureActive = (active) => {
            navigationGestureActive = active;
            isNavigationGestureActive.value = active;
            if (active) {
                handleKeyboardWillShow();
                if (isVisible.value) {
                    transitionPhaseFromJs("visible");
                }
            }
            callbackRef.current.onNavigationGestureChange?.(active);
        };
        const handleGestureStart = () => setNavigationGestureActive(true);
        const handleGestureCancel = () => setNavigationGestureActive(false);
        const handleGestureEnd = () => setNavigationGestureActive(false);
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
            setNavigationGestureActive(false);
            willHideSubscription.remove();
            didHideSubscription.remove();
            willShowSubscription.remove();
            gestureStartUnsubscribe?.();
            gestureEndUnsubscribe?.();
            gestureCancelUnsubscribe?.();
            transitionStartUnsubscribe?.();
            transitionEndUnsubscribe?.();
        };
    }, [navigation, transitionPhaseFromJs]);
    return {
        height,
        hiddenConfirmationDuration: confirmationDuration,
        hiddenFinalHeight: finalHeight,
        hiddenHeightThreshold: heightThreshold,
        isHiddenConfirmationActive,
        isNavigationGestureActive,
        isFullyDisplayed,
        isVisible,
        phase,
        state,
    };
}
