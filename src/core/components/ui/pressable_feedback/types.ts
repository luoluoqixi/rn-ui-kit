import type { ComponentProps, ReactNode } from "react";
import type { PressableFeedback as NativeFeedback } from "heroui-native/pressable-feedback";
import type { Button as WebPressable } from "react-aria-components/Button";
import type { FieldSlotProps } from "../utils/field_types";
import type { NativeHapticsSetting } from "../utils/haptics";
export type PressableFeedbackProps = FieldSlotProps<ComponentProps<typeof NativeFeedback>, ComponentProps<typeof WebPressable>,
  "isDisabled" | "onPress" | "animation" | "isAnimatedStyleActive" | "aria-label" | "accessibilityLabel"
> & {
  children?: ReactNode;
  isDisabled?: boolean;
  accessibilityLabel?: string;
  onPress?: () => void;
  /** Native uses HeroUI feedback. Web ripple expands from the pointer (keyboard: center). */
  feedback?: "none" | "highlight" | "ripple";
  isAnimationDisabled?: boolean;
  nativeHaptics?: NativeHapticsSetting;
};
