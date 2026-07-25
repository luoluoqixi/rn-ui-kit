import { actionFeedbackExamples } from "./examples/action_feedback_examples";
import { collectionExamples } from "./examples/collection_examples";
import { compositionExamples } from "./examples/composition_examples";
import { displayExamples } from "./examples/display_examples";
import { formExamples } from "./examples/form_examples";
import { overlayExamples } from "./examples/overlay_examples";
import type { ComponentExampleDefinition } from "./types";

export const componentExampleDefinitions: ComponentExampleDefinition[] = [
  ...actionFeedbackExamples,
  ...formExamples,
  ...compositionExamples,
  ...overlayExamples,
  ...collectionExamples,
  ...displayExamples,
];
