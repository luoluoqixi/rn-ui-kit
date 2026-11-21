import { TextHeroUI } from "./text_heroui";
import type { TextProps } from "./types";

export function Text(props: TextProps) {
  return <TextHeroUI {...props} />;
}
export { TextClassContext } from "./text_context";
