import { CloseButton } from "@heroui/react/close-button";
import type { CloseButtonProps } from "./types";
export function CloseButtonHeroUI(p: CloseButtonProps) {
  return <CloseButton {...p.herouiWebProps} className={p.className}
    aria-label={p.accessibilityLabel ?? "关闭"} isDisabled={p.isDisabled}
    onPress={() => { if (!p.isDisabled) p.onPress?.(); }}>{p.children}</CloseButton>;
}
