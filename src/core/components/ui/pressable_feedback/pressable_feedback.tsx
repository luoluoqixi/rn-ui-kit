import { PressableFeedbackHeroUI } from "./pressable_feedback_heroui";
import { normalizeSlotText } from "../utils/slot_content";
import type { PressableFeedbackProps } from "./types";
export function PressableFeedback(props: PressableFeedbackProps) { return <PressableFeedbackHeroUI {...props}>{normalizeSlotText(props.children)}</PressableFeedbackHeroUI>; }
