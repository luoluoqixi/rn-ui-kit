import type { NativeListBasicPressFeedback } from "./types";
export declare const BasicPressFeedbackContext: import("react").Context<NativeListBasicPressFeedback>;
/** Keep press cancellation, quick taps and long-press recognition owned by
 * Pressable. RN Web exposes the same activation delay under a different prop. */
export declare function useBasicPressFeedbackProps(): {
    delayPressIn: number;
    unstable_pressDelay?: undefined;
} | {
    unstable_pressDelay: number;
    delayPressIn?: undefined;
};
