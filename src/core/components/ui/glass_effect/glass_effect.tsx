import {
  GlassContainer as ExpoGlassContainer,
  GlassView as ExpoGlassView,
} from "expo-glass-effect";
import { NavigationContext } from "@react-navigation/native";
import { forwardRef, useCallback, useContext, useEffect, useRef, type ForwardedRef } from "react";
import { Keyboard, type View } from "react-native";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { GlassEffectContainerProps, GlassEffectProps } from "./types";
import { useKeyboardAnimation } from "../utils/keyboard";

const AnimatedExpoGlassView = Animated.createAnimatedComponent(ExpoGlassView);
const DEFAULT_KEYBOARD_HIDDEN_HEIGHT_THRESHOLD = 10;
const DEFAULT_KEYBOARD_HIDDEN_CONSECUTIVE_FRAMES = 3;
const FRAME_DURATION_MS = 1000 / 60;
type NavigationEvent = { data?: { closing?: boolean } };
type NavigationEventSource = {
  addListener?: (eventName: string, listener: (event: NavigationEvent) => void) => () => void;
};

function useKeyboardHidden(
  onKeyboardHidden: GlassEffectProps["onKeyboardHidden"],
  keyboardHeight: SharedValue<number>,
  navigationGestureActiveValue: SharedValue<boolean>,
  keyboardHiddenConfirmation: GlassEffectProps["keyboardHiddenConfirmation"],
  onNavigationGestureChange?: (active: boolean) => void,
) {
  const navigation = useContext(NavigationContext);
  const callbackRef = useRef(onKeyboardHidden);
  const navigationGestureCallbackRef = useRef(onNavigationGestureChange);
  const keyboardHiddenNotifiedRef = useRef(false);
  callbackRef.current = onKeyboardHidden;
  navigationGestureCallbackRef.current = onNavigationGestureChange;
  const hideConfirmationActive = useSharedValue(false);
  const confirmationProgress = useSharedValue(0);
  const notifyKeyboardHidden = useCallback(() => {
    if (keyboardHiddenNotifiedRef.current) {
      return;
    }
    keyboardHiddenNotifiedRef.current = true;
    callbackRef.current?.();
  }, []);
  const heightThreshold = Math.max(
    keyboardHiddenConfirmation?.heightThreshold ?? DEFAULT_KEYBOARD_HIDDEN_HEIGHT_THRESHOLD,
    0,
  );
  const consecutiveFrames = Math.max(
    Math.round(
      keyboardHiddenConfirmation?.consecutiveFrames ?? DEFAULT_KEYBOARD_HIDDEN_CONSECUTIVE_FRAMES,
    ),
    1,
  );
  const confirmationDuration = consecutiveFrames * FRAME_DURATION_MS;

  useAnimatedReaction(
    () =>
      hideConfirmationActive.value &&
      !navigationGestureActiveValue.value &&
      keyboardHeight.value <= heightThreshold,
    (shouldConfirm, wasConfirming) => {
      if (!shouldConfirm) {
        cancelAnimation(confirmationProgress);
        confirmationProgress.value = 0;
        return;
      }

      if (wasConfirming) {
        return;
      }

      confirmationProgress.value = withTiming(1, { duration: confirmationDuration }, (finished) => {
        if (
          finished &&
          hideConfirmationActive.value &&
          !navigationGestureActiveValue.value &&
          keyboardHeight.value <= heightThreshold
        ) {
          hideConfirmationActive.value = false;
          runOnJS(notifyKeyboardHidden)();
        }
      });
    },
    [confirmationDuration, heightThreshold],
  );

  useEffect(() => {
    if (onKeyboardHidden == null && onNavigationGestureChange == null) {
      return;
    }

    let navigationGestureActive = false;
    const handleKeyboardWillHide = () => {
      if (!navigationGestureActive) {
        keyboardHiddenNotifiedRef.current = false;
        confirmationProgress.value = 0;
        hideConfirmationActive.value = true;
      }
    };
    const handleKeyboardDidHide = () => {
      if (!navigationGestureActive) {
        hideConfirmationActive.value = false;
        confirmationProgress.value = 0;
        notifyKeyboardHidden();
      }
    };
    const handleKeyboardWillShow = () => {
      keyboardHiddenNotifiedRef.current = false;
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
}

function KeyboardAvoidingGlassEffect({
  forwardedRef,
  keyboardAvoidance,
  keyboardHiddenConfirmation,
  onKeyboardHidden,
  ...props
}: GlassEffectProps & {
  forwardedRef: ForwardedRef<View>;
}) {
  const insets = useSafeAreaInsets();
  const keyboardAvoidanceFrozen = useSharedValue(false);
  const frozenKeyboardHeight = useSharedValue(0);
  const { height } = useKeyboardAnimation();
  const setKeyboardAvoidanceFrozen = useCallback(
    (frozen: boolean) => {
      keyboardAvoidanceFrozen.value = frozen;
    },
    [keyboardAvoidanceFrozen],
  );
  useKeyboardHidden(
    onKeyboardHidden,
    height,
    keyboardAvoidanceFrozen,
    keyboardHiddenConfirmation,
    setKeyboardAvoidanceFrozen,
  );
  useDerivedValue(() => {
    if (!keyboardAvoidanceFrozen.value) {
      frozenKeyboardHeight.value = height.value;
    }
  });
  const config = typeof keyboardAvoidance === "object" ? keyboardAvoidance : undefined;
  const enabled = keyboardAvoidance === true || config?.enabled !== false;
  const offset = config?.offset ?? 0;
  const safeAreaInset = config?.subtractSafeAreaInset === false ? 0 : insets.bottom;
  const keyboardStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: enabled
            ? -Math.max(
                (keyboardAvoidanceFrozen.value ? frozenKeyboardHeight.value : height.value) -
                  safeAreaInset +
                  offset,
                0,
              )
            : 0,
        },
      ],
    }),
    [enabled, offset, safeAreaInset],
  );

  return (
    <AnimatedExpoGlassView {...props} ref={forwardedRef} style={[props.style, keyboardStyle]} />
  );
}

const GlassEffectRoot = forwardRef<View, GlassEffectProps>(function GlassEffectRoot(
  { keyboardAvoidance, keyboardHiddenConfirmation, onKeyboardHidden, ...props },
  forwardedRef,
) {
  if (keyboardAvoidance != null && keyboardAvoidance !== false) {
    return (
      <KeyboardAvoidingGlassEffect
        {...props}
        forwardedRef={forwardedRef}
        keyboardAvoidance={keyboardAvoidance}
        keyboardHiddenConfirmation={keyboardHiddenConfirmation}
        onKeyboardHidden={onKeyboardHidden}
      />
    );
  }

  return (
    <KeyboardVisibilityGlassEffect
      {...props}
      forwardedRef={forwardedRef}
      keyboardHiddenConfirmation={keyboardHiddenConfirmation}
      onKeyboardHidden={onKeyboardHidden}
    />
  );
});

function KeyboardVisibilityGlassEffect({
  forwardedRef,
  keyboardHiddenConfirmation,
  onKeyboardHidden,
  ...props
}: Omit<GlassEffectProps, "keyboardAvoidance"> & { forwardedRef: ForwardedRef<View> }) {
  if (onKeyboardHidden == null) {
    return <ExpoGlassView {...props} ref={forwardedRef} />;
  }

  return (
    <KeyboardVisibilityTrackingGlassEffect
      {...props}
      forwardedRef={forwardedRef}
      keyboardHiddenConfirmation={keyboardHiddenConfirmation}
      onKeyboardHidden={onKeyboardHidden}
    />
  );
}

function KeyboardVisibilityTrackingGlassEffect({
  forwardedRef,
  keyboardHiddenConfirmation,
  onKeyboardHidden,
  ...props
}: Omit<GlassEffectProps, "keyboardAvoidance"> & { forwardedRef: ForwardedRef<View> }) {
  const navigationGestureActive = useSharedValue(false);
  const { height } = useKeyboardAnimation();
  const setNavigationGestureActive = useCallback(
    (active: boolean) => {
      navigationGestureActive.value = active;
    },
    [navigationGestureActive],
  );
  useKeyboardHidden(
    onKeyboardHidden,
    height,
    navigationGestureActive,
    keyboardHiddenConfirmation,
    setNavigationGestureActive,
  );
  return <ExpoGlassView {...props} ref={forwardedRef} />;
}

export const GlassEffectContainer = forwardRef<View, GlassEffectContainerProps>(
  function GlassEffectContainer(props, forwardedRef) {
    return <ExpoGlassContainer {...props} ref={forwardedRef} />;
  },
);

/**
 * iOS 26+ 使用系统原生 Liquid Glass；其他平台由 expo-glass-effect 降级为普通 View。
 *
 * 默认不附加布局或定位语义；启用 `keyboardAvoidance` 后会在 UI 线程跟随键盘位移。
 * 其余 GlassView props、style 与 children 均原样透传。
 */
export const GlassEffect = Object.assign(GlassEffectRoot, {
  Container: GlassEffectContainer,
});
