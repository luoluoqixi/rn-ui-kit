import {
  GlassContainer as ExpoGlassContainer,
  GlassView as ExpoGlassView,
} from "expo-glass-effect";
import { forwardRef, useCallback, type ForwardedRef } from "react";
import { type View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { GlassEffectContainerProps, GlassEffectProps } from "./types";
import {
  useKeyboardAvoidance,
  useKeyboardVisibility,
  type KeyboardVisibilityPhase,
} from "../utils/keyboard";

const AnimatedExpoGlassView = Animated.createAnimatedComponent(ExpoGlassView);

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
  const handlePhaseChange = useCallback(
    (phase: KeyboardVisibilityPhase) => {
      if (phase === "hidden") {
        onKeyboardHidden?.();
      }
    },
    [onKeyboardHidden],
  );
  const keyboard = useKeyboardAvoidance({
    hiddenConfirmation: keyboardHiddenConfirmation,
    onPhaseChange: handlePhaseChange,
  });
  const config = typeof keyboardAvoidance === "object" ? keyboardAvoidance : undefined;
  const enabled = keyboardAvoidance === true || config?.enabled !== false;
  const offset = config?.offset ?? 0;
  const safeAreaInset = config?.subtractSafeAreaInset === false ? 0 : insets.bottom;
  const keyboardStyle = useAnimatedStyle(() => {
    const allowsNegativeFinalHeight =
      keyboard.isHiddenConfirmationActive.value && keyboard.hiddenFinalHeight < 0;
    const keyboardHeight = keyboard.height.value;
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
  const handlePhaseChange = useCallback(
    (phase: KeyboardVisibilityPhase) => {
      if (phase === "hidden") {
        onKeyboardHidden?.();
      }
    },
    [onKeyboardHidden],
  );
  useKeyboardVisibility({
    hiddenConfirmation: keyboardHiddenConfirmation,
    onPhaseChange: handlePhaseChange,
  });
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
