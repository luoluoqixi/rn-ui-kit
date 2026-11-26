import { PressableFeedback } from "heroui-native/pressable-feedback";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import type { PressableFeedbackProps } from "./types";
export function PressableFeedbackHeroUI(p: PressableFeedbackProps) {
  const haptics = useResolvedNativeHaptics(p.nativeHaptics, { defaultEnabled: true });
  return <PressableFeedback {...p.herouiNativeProps} className={p.className} isDisabled={p.isDisabled}
    accessibilityRole="button" accessibilityLabel={p.accessibilityLabel}
    animation={p.isAnimationDisabled ? "disable-all" : undefined}
    onPress={() => { if (!p.isDisabled) { triggerNativeHaptics(haptics); p.onPress?.(); } }}>
    {p.children}
    {p.feedback === "highlight" && <PressableFeedback.Highlight className="z-10" />}
    {p.feedback === "ripple" && <PressableFeedback.Ripple className="z-10" />}
  </PressableFeedback>;
}
