import { createContext, useContext } from "react";
import { Platform } from "react-native";

import { NATIVE_LIST_BASIC_DEFAULT_PRESS_FEEDBACK, NATIVE_LIST_BASIC_PRESS_DELAY } from "./constants";
import type { NativeListBasicPressFeedback } from "./types";

export const BasicPressFeedbackContext =
  createContext<NativeListBasicPressFeedback>(NATIVE_LIST_BASIC_DEFAULT_PRESS_FEEDBACK);

/** Keep press cancellation, quick taps and long-press recognition owned by
 * Pressable. RN Web exposes the same activation delay under a different prop. */
export function useBasicPressFeedbackProps() {
  const mode = useContext(BasicPressFeedbackContext);
  const delay = mode === "immediate" ? 0 : NATIVE_LIST_BASIC_PRESS_DELAY;
  return Platform.OS === "web"
    ? { delayPressIn: delay }
    : { unstable_pressDelay: delay };
}
