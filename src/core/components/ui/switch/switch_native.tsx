import type { SwitchNativeProps } from "./types";

/** Web/typecheck fallback; native platforms resolve this module to Expo UI implementations. */
export function SwitchNative(_props: SwitchNativeProps) {
  return null;
}
