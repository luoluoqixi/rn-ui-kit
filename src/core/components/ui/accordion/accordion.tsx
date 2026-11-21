import { AccordionHeroUI } from "./accordion_heroui";
import type { AccordionProps } from "./types";

/** Metro selects the implementation; the public entry and types stay shared. */
export function Accordion(props: AccordionProps) {
  return <AccordionHeroUI {...props} />;
}
