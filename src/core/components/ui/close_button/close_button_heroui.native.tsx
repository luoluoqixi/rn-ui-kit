import { CloseButton } from "heroui-native/close-button";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import type { CloseButtonProps } from "./types";
export function CloseButtonHeroUI(p: CloseButtonProps) {
  const haptics = useResolvedNativeHaptics(p.nativeHaptics, { defaultEnabled: true });
  return <CloseButton {...p.herouiNativeProps} className={p.className}
    aria-label={p.accessibilityLabel ?? "关闭"} accessibilityLabel={p.accessibilityLabel ?? "关闭"}
    isDisabled={p.isDisabled} onPress={() => {
      if (p.isDisabled) return;
      triggerNativeHaptics(haptics); p.onPress?.();
    }}>{p.children}</CloseButton>;
}
