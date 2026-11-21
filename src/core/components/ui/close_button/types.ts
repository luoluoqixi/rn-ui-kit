import type { ComponentProps, ReactNode } from "react";
import type { CloseButton as NativeClose } from "heroui-native/close-button";
import type { CloseButton as WebClose } from "@heroui/react/close-button";
import type { FieldSlotProps } from "../utils/field_types";
import type { NativeHapticsSetting } from "../utils/haptics";
/** HeroUI on every platform; no system-native Button branch. */
export type CloseButtonProps = FieldSlotProps<ComponentProps<typeof NativeClose>, ComponentProps<typeof WebClose>,
  "onPress" | "isDisabled" | "accessibilityLabel" | "aria-label" | "isIconOnly" | "variant" | "size"
> & {
  children?: ReactNode;
  accessibilityLabel?: string;
  isDisabled?: boolean;
  onPress?: () => void;
  nativeHaptics?: NativeHapticsSetting;
};
