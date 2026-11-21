import { AvatarHeroUI } from "./avatar_heroui";
import type { AvatarProps } from "./types";

export function Avatar(props: AvatarProps) {
  return <AvatarHeroUI {...props} />;
}
