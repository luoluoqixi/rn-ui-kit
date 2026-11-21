import { CardHeroUI } from "./card_heroui";
import type { CardProps } from "./types";

/** Metro selects the implementation; the public entry and types stay shared. */
export function Card(props: CardProps) {
  return <CardHeroUI {...props} />;
}
