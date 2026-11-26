import { jsx as _jsx } from "react/jsx-runtime";
import { PressableFeedbackHeroUI } from "./pressable_feedback_heroui";
import { normalizeSlotText } from "../utils/slot_content";
export function PressableFeedback(props) { return _jsx(PressableFeedbackHeroUI, { ...props, children: normalizeSlotText(props.children) }); }
