import { BadgeHeroUI } from "./badge_heroui";
import type { BadgeProps } from "./types";

export function Badge(props: BadgeProps) {
  return <BadgeHeroUI {...props} />;
}
