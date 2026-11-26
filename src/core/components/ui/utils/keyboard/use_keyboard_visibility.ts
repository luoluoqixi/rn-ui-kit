import { NavigationContext } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Keyboard } from "react-native";
import {
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { KeyboardState } from "react-native-keyboard-controller";

import { useKeyboardAnimation, type KeyboardAnimation } from "./use_keyboard_animation";

const DEFAULT_KEYBOARD_HIDDEN_HEIGHT_THRESHOLD = 20;
const DEFAULT_KEYBOARD_HIDDEN_CONSECUTIVE_FRAMES = 1;
const FRAME_DURATION_MS = 1000 / 60;

type NavigationEvent = { data?: { closing?: boolean } };
type NavigationEventSource = {
  addListener?: (eventName: string, listener: (event: NavigationEvent) => void) => () => void;
};

/** 确认软键盘已完全收起的规则。 */
export type KeyboardHiddenConfirmation = {
  /** 认为键盘已隐藏的最大高度。默认 20。 */
  heightThreshold?: number;
  /** 键盘高度满足阈值后的确认帧数。默认 1。 */
  consecutiveFrames?: number;
  /** 确认隐藏后，避让高度的最终值；仅负值有效，默认 0。 */
  finalHeight?: number;
};

export type KeyboardVisibilityOptions = {
  /** 键盘隐藏的确认规则。交互式返回期间会自动暂停确认。 */
  hiddenConfirmation?: KeyboardHiddenConfirmation;
  /** 经处理后的键盘生命周期发生变化时调用。 */
  onPhaseChange?: (phase: KeyboardVisibilityPhase) => void;
  /** 导航交互返回开始或结束时调用。 */
  onNavigationGestureChange?: (active: boolean) => void;
};

/** 经导航手势与隐藏确认处理后的键盘生命周期。 */
export type KeyboardVisibilityPhase = "hidden" | "opening" | "visible" | "hiding";

export type KeyboardVisibility = KeyboardAnimation & {
  /**
   * 经处理后的完整键盘生命周期。
   *
   * `hiding` 仅在非返回手势且高度达到隐藏阈值后进入；持续配置的确认帧数后才会
   * 切换至 `hidden`。
   */
  phase: SharedValue<KeyboardVisibilityPhase>;
  /** 键盘是否已显示在界面上，`opening`、`visible`、`hiding` 时均为 true。 */
  isVisible: SharedValue<boolean>;
  /** 键盘是否处于完全显示的稳定阶段，仅 `phase === "visible"` 时为 true。 */
  isFullyDisplayed: SharedValue<boolean>;
  /** 当前是否正处于导航交互返回。 */
  isNavigationGestureActive: SharedValue<boolean>;
  /** `keyboardWillHide` 后正在确认键盘是否真的关闭。 */
  isHiddenConfirmationActive: SharedValue<boolean>;
  /** 隐藏确认完成后供避让布局使用的最终高度。 */
  hiddenFinalHeight: number;
  /** 隐藏确认时长。 */
  hiddenConfirmationDuration: number;
  /** 隐藏确认高度阈值。 */
  hiddenHeightThreshold: number;
};

/**
 * 提供稳定的键盘显示/隐藏通知。
 *
 * `hidden` 阶段不会直接相信 `keyboardWillHide`：它会等待键盘高度连续满足配置阈值，
 * 并在 iOS 交互式返回期间暂停确认，避免把页面返回动画误判为键盘关闭。
 */
export function useKeyboardVisibility(options: KeyboardVisibilityOptions = {}): KeyboardVisibility {
  const navigation = useContext(NavigationContext);
  const { height, state } = useKeyboardAnimation();
  const callbackRef = useRef(options);
  const hideConfirmationPendingRef = useRef(false);
  callbackRef.current = options;

  const isVisible = useSharedValue(false);
  const isFullyDisplayed = useSharedValue(false);
  const phase = useSharedValue<KeyboardVisibilityPhase>("hidden");
  const isNavigationGestureActive = useSharedValue(false);
  const isHiddenConfirmationActive = useSharedValue(false);
  const confirmationProgress = useSharedValue(0);
  const heightThreshold = Math.max(
    options.hiddenConfirmation?.heightThreshold ?? DEFAULT_KEYBOARD_HIDDEN_HEIGHT_THRESHOLD,
    0,
  );
  const consecutiveFrames = Math.max(
    Math.round(
      options.hiddenConfirmation?.consecutiveFrames ?? DEFAULT_KEYBOARD_HIDDEN_CONSECUTIVE_FRAMES,
    ),
    1,
  );
  const confirmationDuration = consecutiveFrames * FRAME_DURATION_MS;
  const finalHeight = Math.min(options.hiddenConfirmation?.finalHeight ?? 0, 0);

  const notifyPhaseChange = useCallback((nextPhase: KeyboardVisibilityPhase) => {
    if (nextPhase === "hidden") {
      hideConfirmationPendingRef.current = false;
    }
    callbackRef.current.onPhaseChange?.(nextPhase);
  }, []);
  const transitionPhase = (nextPhase: KeyboardVisibilityPhase) => {
    "worklet";
    if (phase.value === nextPhase) {
      return;
    }
    phase.value = nextPhase;
    isVisible.value = nextPhase !== "hidden";
    isFullyDisplayed.value = nextPhase === "visible";
    runOnJS(notifyPhaseChange)(nextPhase);
  };
  const transitionPhaseFromJs = useCallback(
    (nextPhase: KeyboardVisibilityPhase) => {
      if (phase.value === nextPhase) {
        return;
      }
      phase.value = nextPhase;
      isVisible.value = nextPhase !== "hidden";
      isFullyDisplayed.value = nextPhase === "visible";
      notifyPhaseChange(nextPhase);
    },
    [isFullyDisplayed, isVisible, notifyPhaseChange, phase],
  );
  useAnimatedReaction(
    () => state.value,
    (keyboardState, previousKeyboardState) => {
      if (
        keyboardState === KeyboardState.OPENING &&
        previousKeyboardState !== KeyboardState.OPENING
      ) {
        // Once a keyboard has been confirmed visible, an interactive-back
        // cancellation can transiently report OPENING. Keep the stable phase.
        if (!isVisible.value) {
          transitionPhase("opening");
        } else if (phase.value === "hiding") {
          transitionPhase("visible");
        }
      }

      if (keyboardState === KeyboardState.OPEN && previousKeyboardState !== KeyboardState.OPEN) {
        transitionPhase("visible");
      }
    },
  );

  useAnimatedReaction(
    () =>
      isHiddenConfirmationActive.value &&
      !isNavigationGestureActive.value &&
      height.value <= heightThreshold,
    (shouldConfirm, wasConfirming) => {
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
        if (
          finished &&
          isHiddenConfirmationActive.value &&
          !isNavigationGestureActive.value &&
          height.value <= heightThreshold
        ) {
          transitionPhase("hidden");
        }
      });
    },
    [confirmationDuration, heightThreshold],
  );

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
    const setNavigationGestureActive = (active: boolean) => {
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
    const handleTransitionStart = (event: NavigationEvent) => {
      if (event.data?.closing) {
        handleGestureStart();
      }
    };
    const handleTransitionEnd = (event: NavigationEvent) => {
      if (event.data?.closing) {
        handleGestureEnd();
      } else if (navigationGestureActive) {
        handleGestureCancel();
      }
    };
    const willHideSubscription = Keyboard.addListener("keyboardWillHide", handleKeyboardWillHide);
    const didHideSubscription = Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide);
    const willShowSubscription = Keyboard.addListener("keyboardWillShow", handleKeyboardWillShow);
    const addNavigationListener = (eventName: string, listener: (event: NavigationEvent) => void) =>
      (navigation as unknown as NavigationEventSource | undefined)?.addListener?.(
        eventName,
        listener,
      );
    const gestureStartUnsubscribe = addNavigationListener("gestureStart", handleGestureStart);
    const gestureEndUnsubscribe = addNavigationListener("gestureEnd", handleGestureEnd);
    const gestureCancelUnsubscribe = addNavigationListener("gestureCancel", handleGestureCancel);
    const transitionStartUnsubscribe = addNavigationListener(
      "transitionStart",
      handleTransitionStart,
    );
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
